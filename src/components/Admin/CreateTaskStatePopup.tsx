import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { apiRequest } from "../../services/api";

interface CreateTaskStatePopupProps {
  open: boolean;
  onClose: () => void;
  refreshTaskStates: () => void;
}

const CreateTaskStatePopup = ({ open, onClose, refreshTaskStates }: CreateTaskStatePopupProps) => {
  const [taskStateName, setTaskStateName] = useState("");

  const handleCreate = async () => {
    try {
      const response = await apiRequest(
        `http://localhost:8080/projectorg/admin/taskstate?name=${encodeURIComponent(taskStateName)}`,
        { method: "POST" }
      );
      if (response.ok) {
        refreshTaskStates(); // Refresca la lista después de crear
        onClose();
        setTaskStateName(""); // Limpiar input
      } else {
        console.error("Error al crear el estado de tarea");
      }
    } catch (error) {
      console.error("Error en la solicitud de creación", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Crear Nuevo Estado de Tarea</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre del Estado"
          value={taskStateName}
          onChange={(e) => setTaskStateName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleCreate} color="primary" disabled={!taskStateName.trim()}>
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskStatePopup;
