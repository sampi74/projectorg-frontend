import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  token: string | null;
  role: string | null;
  user: { userId: number; username: string; role: string; 
    userEmail: string; userFullName: string } | null;
  setUser: React.Dispatch<React.SetStateAction<AuthContextType["user"]>>;
  login: (token: string, user: { userId: number; username: string; role: string; 
    userEmail: string; userFullName: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);

  }, []);

  const login = (
    token: string,
    user: { userId: number; username: string; role: string; userEmail: string; userFullName: string }
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", user.role);
  
    setToken(token);
    setUser(user);
    setRole(user.role);
  
    navigate(user.role === "ADMIN" ? "/admin" : "/menu");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken"); // Eliminamos también el refreshToken
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

