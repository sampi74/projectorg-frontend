import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { apiRequest } from "../../services/api";

interface DeleteTaskPopupProps {
  projectId: number;
  taskId: number;
  open: boolean;
  onClose: () => void;
  refreshTasks: () => void;
}

const DeleteTaskPopup = ({ projectId, taskId, open, onClose, refreshTasks }: DeleteTaskPopupProps) => {
  const handleDelete = async () => {
    try {
      const response = await apiRequest(
        `http://localhost:8080/projectorg/projects/${projectId}/tasks/${taskId}`,
        {method: "DELETE"}
      );
      if (response.ok) {
        refreshTasks(); // Refresca la lista de tareas después de eliminar
        onClose(); // Cierra el popup
      } else {
        console.error("Error al eliminar la tarea");
      }
    } catch (error) {
      console.error("Error en la solicitud de eliminación", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Eliminar Tarea</DialogTitle>
      <DialogContent>
        <Typography>¿Estás seguro de que deseas eliminar esta tarea?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleDelete} color="error">Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTaskPopup;
