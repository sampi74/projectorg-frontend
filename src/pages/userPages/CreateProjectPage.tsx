import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { apiRequest } from "../../services/api";

const CreateProjectPage = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [error, setError] = useState("");
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!projectName.trim() || !projectDescription.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await apiRequest("http://localhost:8080/projectorg/projects/create", {
        method: "POST",
        body: JSON.stringify({
          projectName,
          projectDescription,
          leaderId: user?.userId, // Asignar el ID del usuario autenticado como líder
        }),
      });

      if (!response.ok) throw new Error("Error al crear el proyecto");

      navigate("/menu"); // Redirigir al menú después de la creación exitosa
    } catch (error) {
      setError("No se pudo crear el proyecto. Inténtalo nuevamente.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          Crear Proyecto
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre del Proyecto"
            variant="outlined"
            margin="normal"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            variant="outlined"
            margin="normal"
            multiline
            rows={3}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Crear Proyecto
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProjectPage;
