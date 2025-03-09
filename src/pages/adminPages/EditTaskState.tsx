import { useEffect, useState } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../services/api";

const EditTaskState = () => {
  const { id } = useParams<{ id: string }>(); // Captura el ID desde la URL
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchTaskState = async () => {
      try {
        const response = await apiRequest(`http://localhost:8080/projectorg/admin/taskstate/${id}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.taskStateName);
        }
      } catch (error) {
        console.error("Error fetching task state", error);
      }
    };
    fetchTaskState();
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await apiRequest(`http://localhost:8080/projectorg/admin/taskstate/${id}?name=${encodeURIComponent(name)}`, {
        method: "PUT",
      });
      if (response.ok) {
        navigate("/admin/taskstate"); // Vuelve a la lista después de editar
      }
    } catch (error) {
      console.error("Error updating task state", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Editar Estado de Tarea</Typography>
      <TextField
        label="Nombre"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
        Guardar
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => navigate("/admin/taskstate")}>
        Cancelar
      </Button>
    </Container>
  );
};

export default EditTaskState;
