import { useState } from "react";
import { TextField, Button, Typography, Container, Alert, Stack } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";

const EditUserPage = () => {
  const { user, setUser, token } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.userEmail || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpdate = async () => {
    setError("");
    setSuccess(false);
    
    if (!username.trim() || !email.trim()) {
      setError("El nombre de usuario y el email no pueden estar vacíos.");
      return;
    }

    try {
      const response = await apiRequest(
        `http://localhost:8080/projectorg/users/${user?.userId}/update`,
        {
          method: "PUT",
          body: JSON.stringify({ username, userEmail: email }),
        }
      );

      let errorMessage = "";
      
      if (!response.ok) {
        const text = await response.text(); // Intentamos leer el error como texto
        if (text.includes("Username already exists")) {
          errorMessage = "El nombre de usuario ya está en uso.";
        } else if (text.includes("Email already exists")) {
          errorMessage = "El email ya está en uso.";
        } else {
          errorMessage = "Error al actualizar el perfil.";
        }
        setError(errorMessage);
        return;
      }
      
      setUser((prev) => prev ? { ...prev, username, userEmail: email } : prev);
      setSuccess(true);

      // Redirigir después de un pequeño retraso para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate(user?.role === "ADMIN" ? "/admin/user" : "/user");
      }, 1500);
    } catch {
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Editar Perfil
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Perfil actualizado correctamente.</Alert>}
      <TextField
        label="Nombre de Usuario"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Correo Electrónico"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Stack spacing={2} direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" fullWidth onClick={handleUpdate}>
          Guardar Cambios
        </Button>
        <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      </Stack>
    </Container>
  );
};

export default EditUserPage;
