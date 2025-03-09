import { useEffect, useState } from "react";
import { Container, Typography, Button, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";

interface DiagramType {
  diagramTypeId: number;
  diagramTypeName: string;
  diagramCount: number;
  lowDateDiagramType?: string | null;
}

const DiagramTypeABM = () => {
  const [diagramTypes, setDiagramTypes] = useState<DiagramType[]>([]);
  const [filter, setFilter] = useState("active");
  const navigate = useNavigate();

  const fetchDiagramTypes = async () => {
    const endpoint = filter === "active" 
      ? "http://localhost:8080/projectorg/admin/diagramtype" 
      : "http://localhost:8080/projectorg/admin/diagramtype/low";
    try {
      const response = await apiRequest(endpoint);
      if (response.ok) {
        const data: DiagramType[] = await response.json();
        const updatedData = await Promise.all(
          data.map(async (item) => {
            const countRes = await apiRequest(`http://localhost:8080/projectorg/admin/diagramtype/${item.diagramTypeId}/count`, { method: "GET" });
            if (countRes.ok) {
              const count = await countRes.json();
              return { ...item, diagramCount: count };
            }
            return item;
          })
        );
        setDiagramTypes(updatedData);
      }
    } catch (error) {
      console.error("Error fetching diagram types", error);
    }
  };

  useEffect(() => {
    fetchDiagramTypes();
  }, [filter]);

  const handleDelete = async (id: number) => {
    try {
      const response = await apiRequest(`http://localhost:8080/projectorg/admin/diagramtype/${id}`, { method: "DELETE" });
      if (response.ok) fetchDiagramTypes();
    } catch (error) {
      console.error("Error deleting diagram type", error);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      const response = await apiRequest(`http://localhost:8080/projectorg/admin/diagramtype/${id}/discharge`, { method: "PUT" });
      if (response.ok) fetchDiagramTypes();
    } catch (error) {
      console.error("Error restoring diagram type", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Administrar Tipos de Diagrama</Typography>
      <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <MenuItem value="active">Activos</MenuItem>
        <MenuItem value="low">Dados de Baja</MenuItem>
      </Select>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Cantidad de Diagramas</TableCell>
              <TableCell>Fecha de Baja</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diagramTypes.map((type) => (
              <TableRow key={type.diagramTypeId}>
                <TableCell>{type.diagramTypeId}</TableCell>
                <TableCell>{type.diagramTypeName}</TableCell>
                <TableCell>{type.diagramCount}</TableCell>
                <TableCell>{type.lowDateDiagramType || "-"}</TableCell>
                <TableCell>
                  {type.lowDateDiagramType ? (
                    <Button variant="contained" color="success" onClick={() => handleRestore(type.diagramTypeId)}>
                      Dar de Alta
                    </Button>
                  ) : (
                    <>
                      <Button variant="contained" color="warning" onClick={() => navigate(`/admin/diagramtype/${type.diagramTypeId}`)}>
                        Editar
                      </Button>
                      <Button variant="contained" color="error" onClick={() => handleDelete(type.diagramTypeId)} sx={{ ml: 1 }}>
                        Dar de Baja
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DiagramTypeABM;

