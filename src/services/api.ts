let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const notifySubscribers = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("token");
    if (!refreshToken) throw new Error("No refresh token");

    const response = await fetch("http://localhost:8080/projectorg/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }), // Asegúrate de que el backend recibe este body
    });

    if (!response.ok) throw new Error("Refresh token inválido");

    const data = await response.json();
    localStorage.setItem("token", data.accessToken);
    return data.accessToken;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.href = "/login";
    return null;
  }
};

export const apiRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let token = localStorage.getItem("token");

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 403) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshAccessToken().then((newToken) => {
        isRefreshing = false;
        if (newToken) {
          notifySubscribers(newToken);
        }
      });
    }

    return new Promise<Response>((resolve, reject) => {
      refreshSubscribers.push((newToken) => {
        if (newToken) {
          resolve(apiRequest(url, options)); // Reintentamos la petición original
        } else {
          reject(new Error("No se pudo refrescar el token"));
        }
      });
    });
  }

  return response;
};

