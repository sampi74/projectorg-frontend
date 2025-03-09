import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { apiRequest } from "../../services/api";

interface CreateTaskPopupProps {
  projectId: number;
  userId: number;
  open: boolean;
  onClose: () => void;
  refreshTasks: () => void;
}

const CreateTaskPopup = ({ projectId, userId, open, onClose, refreshTasks }: CreateTaskPopupProps) => {
  const [text, setText] = useState("");

  const handleCreate = async () => {
    if (!text.trim()) return;
    try {
      const response = await apiRequest(
        `http://localhost:8080/projectorg/projects/${projectId}/tasks?userId=${userId}&text=${encodeURIComponent(text)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        refreshTasks();
        onClose();
      }
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Crear Nueva Tarea</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Texto de la Tarea" value={text} onChange={(e) => setText(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleCreate} color="primary">Crear</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskPopup;
