import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from "@mui/material";
import { apiRequest } from "../../services/api";

interface TaskState {
  taskStateId: number;
  taskStateName: string;
}

interface EditTaskPopupProps {
  projectId: number;
  userId: number;
  task: { taskId: number; taskText: string; state: number }; // Ahora `state` es un número
  open: boolean;
  onClose: () => void;
  refreshTasks: () => void;
}

const EditTaskPopup = ({ projectId, userId, task, open, onClose, refreshTasks }: EditTaskPopupProps) => {
  const [text, setText] = useState(task.taskText);
  const [state, setState] = useState<number>(task.state); // Estado ahora es un número
  const [states, setStates] = useState<TaskState[]>([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await apiRequest("http://localhost:8080/projectorg/projects/taskstate");
        if (response.ok) {
          const data: TaskState[] = await response.json();
          setStates(data);
        }
      } catch (error) {
        console.error("Error fetching task states", error);
      }
    };
    fetchStates();
  }, []);

  const handleSave = async () => {
    try {
      // Buscar el nombre del estado basado en el ID seleccionado
      const selectedState = states.find((s) => s.taskStateId === state);
      if (!selectedState) {
        console.error("Error: Estado no encontrado");
        return;
      }
  
      const response = await apiRequest(
        `http://localhost:8080/projectorg/projects/${projectId}/tasks/${task.taskId}?newText=${encodeURIComponent(text)}&newState=${encodeURIComponent(selectedState.taskStateName)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" }
        }
      );
  
      if (response.ok) {
        refreshTasks();
        onClose();
      }
    } catch (error) {
      console.error("Error updating task", error);
    }
  };  


  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Editar Tarea</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Texto de la Tarea" value={text} onChange={(e) => setText(e.target.value)} />
        <Select fullWidth value={state} onChange={(e) => setState(Number(e.target.value))}>
          {states.map((s) => (
            <MenuItem key={s.taskStateId} value={s.taskStateId}>
              {s.taskStateName}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskPopup;

