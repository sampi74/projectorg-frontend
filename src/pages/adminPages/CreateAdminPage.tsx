import { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { apiRequest } from "../../services/api";

const API_URL = "http://localhost:8080/projectorg/admin/create";

const CreateAdminPage = () => {
  const [formData, setFormData] = useState({
    userFullName: "",
    username: "",
    userEmail: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    try {
      const response = await apiRequest(API_URL, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al crear el moderador");
      }

      setSuccess(true);
      setFormData({ userFullName: "", username: "", userEmail: "", password: "" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocurrió un error desconocido.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Crear Administrador</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Moderador creado exitosamente</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre Completo"
            name="userFullName"
            value={formData.userFullName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Nombre de Usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Correo Electrónico"
            name="userEmail"
            type="email"
            value={formData.userEmail}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Crear Administrador
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CreateAdminPage;

