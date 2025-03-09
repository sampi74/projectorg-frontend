import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Paper } from "@mui/material";
import { apiRequest } from "../../services/api";
import EditTaskPopup from "./EditTaskPopup";
import CreateTaskPopup from "./CreateTaskPopup";
import DeleteTaskPopup from "./DeleteTaskPopup";

interface Task {
  taskId: number;
  taskText: string;
  state: number;
}

interface TaskState {
  taskStateId: number;
  taskStateName: string;
}

interface TasksPopupProps {
  projectId: number;
  open: boolean;
  userId: number;
  onClose: () => void;
}

const TasksPopup = ({ projectId, open, onClose, userId }: TasksPopupProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskStates, setTaskStates] = useState<TaskState[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await apiRequest(`http://localhost:8080/projectorg/projects/${projectId}/tasks`);
      if (response.ok) {
        const data: Task[] = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const fetchTaskStates = async () => {
    try {
      const response = await apiRequest("http://localhost:8080/projectorg/projects/taskstate");
      if (response.ok) {
        const states: TaskState[] = await response.json();
        setTaskStates(states);
      }
    } catch (error) {
      console.error("Error fetching task states", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTasks();
      fetchTaskStates();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Gestión de Tareas</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {taskStates.map((state) => (
            <Grid item xs key={state.taskStateId}>
              <Paper elevation={3} style={{ padding: 10, minHeight: 200 }}>
                <h3>{state.taskStateName}</h3>
                {tasks.filter((task) => task.state === state.taskStateId).map((task) => (
                  <Button key={task.taskId} fullWidth onClick={() => setSelectedTask(task)}>
                    {task.taskText}
                  </Button>
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cerrar</Button>
        <Button onClick={() => setCreating(true)} color="primary">Crear Nueva Tarea</Button>
      </DialogActions>

      {selectedTask && (
        <Dialog open={Boolean(selectedTask)} onClose={() => setSelectedTask(null)}>
          <DialogTitle>Detalles de la Tarea</DialogTitle>
          <DialogContent>
            <h3>{selectedTask.taskText}</h3>
            <p>Estado: {taskStates.find((s) => s.taskStateId === selectedTask.state)?.taskStateName || "Desconocido"}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedTask(null)} color="secondary">Cerrar</Button>
            <Button onClick={() => setEditing(true)} color="primary">Editar</Button>
            <Button onClick={() => setDeleting(true)} color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>
      )}

      {creating && (
        <CreateTaskPopup
          projectId={projectId}
          open={creating}
          onClose={() => setCreating(false)}
          userId={userId}
          refreshTasks={fetchTasks}
        />
      )}

      {editing && selectedTask && (
        <EditTaskPopup
          projectId={projectId}
          task={selectedTask}
          open={editing}
          onClose={() => setEditing(false)}
          userId={userId}
          refreshTasks={fetchTasks}
        />
      )}

      {deleting && selectedTask && (
        <DeleteTaskPopup
          projectId={projectId}
          taskId={selectedTask.taskId}
          open={deleting}
          onClose={() => setDeleting(false)}
          refreshTasks={fetchTasks}
        />
      )}
    </Dialog>
  );
};

export default TasksPopup;

