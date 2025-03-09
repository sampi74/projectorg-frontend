import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Paper, Box, Link } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = ({ setShowSidebar }: { setShowSidebar: (show: boolean) => void }) => {
  const [userFullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [userEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { token, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
      setShowSidebar(false); // Ocultar la sidebar en esta página
      return () => setShowSidebar(true); // Mostrarla al salir
    }, [setShowSidebar]);

  useEffect(() => {
      if (token) {
        navigate(role === "ADMIN" ? "/admin" : "/menu", { replace: true });
      }
    }, [token, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const userData = { userFullName, username, userEmail, password };

    try {
      const response = await fetch("http://localhost:8080/projectorg/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Error en el registro");

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000); // Redirige al login después de 2s
    } catch (error) {
      setError("Hubo un problema al registrarse");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          Registrarse
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre Completo"
            variant="outlined"
            margin="normal"
            value={userFullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Nombre de Usuario"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Correo Electrónico"
            type="email"
            variant="outlined"
            margin="normal"
            value={userEmail}
            onChange={(e) => setEmail(e.target.value)}
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
          <TextField
            fullWidth
            label="Repetir Contraseña"
            type="password"
            variant="outlined"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">Registro exitoso, redirigiendo...</Typography>}
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Registrarse
            </Button>
          </Box>
          <Box mt={2} textAlign="center">
            <Typography>
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" color="primary" underline="hover">
                Inicia sesión
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
