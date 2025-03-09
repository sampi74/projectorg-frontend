import { useEffect, useState } from "react";
import { Container, Typography, Button, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import CreateTaskStatePopup from "../../components/Admin/CreateTaskStatePopup"; // Importa el popup

interface TaskState {
  taskStateId: number;
  taskStateName: string;
  lowDateTaskState?: string | null;
}

const TaskStateABM = () => {
  const [taskStates, setTaskStates] = useState<TaskState[]>([]);
  const [filter, setFilter] = useState("active");
  const [creatingState, setCreatingState] = useState(false); // Estado para el popup
  const navigate = useNavigate();

  const fetchTaskStates = async () => {
    const endpoint = filter === "active" 
      ? "http://localhost:8080/projectorg/admin/taskstate" 
      : "http://localhost:8080/projectorg/admin/taskstate/low";

    try {
      const response = await apiRequest(endpoint);
      if (response.ok) {
        const data: TaskState[] = await response.json();
        setTaskStates(data);
      }
    } catch (error) {
      console.error("Error fetching task states", error);
    }
  };

  useEffect(() => {
    fetchTaskStates();
  }, [filter]);

  const handleDelete = async (id: number) => {
    try {
      const response = await apiRequest(`http://localhost:8080/projectorg/admin/taskstate/${id}`, { method: "DELETE" });
      if (response.ok) fetchTaskStates();
    } catch (error) {
      console.error("Error deleting task state", error);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      const response = await apiRequest(`http://localhost:8080/projectorg/admin/taskstate/${id}/discharge`, { method: "PUT" });
      if (response.ok) fetchTaskStates();
    } catch (error) {
      console.error("Error restoring task state", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Administrar Estados de Tarea</Typography>
      
      <Button variant="contained" color="primary" onClick={() => setCreatingState(true)} sx={{ mb: 2 }}>
        Crear Nuevo Estado
      </Button>

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
              <TableCell>Fecha de Baja</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taskStates.map((state) => (
              <TableRow key={state.taskStateId}>
                <TableCell>{state.taskStateId}</TableCell>
                <TableCell>{state.taskStateName}</TableCell>
                <TableCell>{state.lowDateTaskState || "-"}</TableCell>
                <TableCell>
                  {state.lowDateTaskState ? (
                    <Button variant="contained" color="success" onClick={() => handleRestore(state.taskStateId)}>
                      Dar de Alta
                    </Button>
                  ) : (
                    <>
                      <Button variant="contained" color="warning" onClick={() => navigate(`/admin/taskstate/${state.taskStateId}`)}>
                        Editar
                      </Button>
                      <Button variant="contained" color="error" onClick={() => handleDelete(state.taskStateId)} sx={{ ml: 1 }}>
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

      {/* Popup para crear nuevo estado */}
      <CreateTaskStatePopup open={creatingState} onClose={() => setCreatingState(false)} refreshTaskStates={fetchTaskStates} />
    </Container>
  );
};

export default TaskStateABM;

