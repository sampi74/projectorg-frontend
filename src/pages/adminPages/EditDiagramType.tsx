import { useEffect, useState } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../services/api";

const EditDiagramType = () => {
  const { id } = useParams<{ id: string }>(); // Captura el ID desde la URL
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchDiagramType = async () => {
      try {
        const response = await apiRequest(`http://localhost:8080/projectorg/admin/diagramtype/${id}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.diagramTypeName);
        }
      } catch (error) {
        console.error("Error fetching diagram type", error);
      }
    };
    fetchDiagramType();
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await apiRequest(`http://localhost:8080/projectorg/admin/diagramtype/${id}?name=${encodeURIComponent(name)}`, {
        method: "PUT",
      });
      if (response.ok) {
        navigate("/admin/diagramtype"); // Vuelve a la lista después de editar
      }
    } catch (error) {
      console.error("Error updating diagram type", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Editar Tipo de Diagrama</Typography>
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
      <Button variant="outlined" color="secondary" onClick={() => navigate("/admin/diagramtype")}>
        Cancelar
      </Button>
    </Container>
  );
};

export default EditDiagramType;
