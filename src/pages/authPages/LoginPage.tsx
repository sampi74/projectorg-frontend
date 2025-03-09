import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
  Link,
} from "@mui/material";

const LoginPage = ({ setShowSidebar }: { setShowSidebar: (show: boolean) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, token, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setShowSidebar(false); // Ocultar la sidebar en esta página
    return () => setShowSidebar(true); // Mostrarla al salir
  }, [setShowSidebar]);

  useEffect(() => {
    if (token && role) {
      navigate(role === "ADMIN" ? "/admin" : "/menu", { replace: true });
    }
  }, [token, role, navigate]); // Asegura que reaccione a cambios en `token` y `role`

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/projectorg/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Credenciales incorrectas");

      const data = await response.json();

      login(data.token, data.user); // Guardamos el usuario y el token en el contexto

      // Redirigimos solo cuando se haya actualizado el estado en useEffect
    } catch (error) {
      setError("Usuario o contraseña incorrectos");
    }
  };


  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Usuario"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Iniciar Sesión
            </Button>
          </Box>
        </form>

        {/* Texto de registro */}
        <Box mt={3} textAlign="center">
          <Typography>
            ¿No tienes cuenta?{" "}
            <Link href="/register" color="primary" underline="hover">
              Registrate
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;

