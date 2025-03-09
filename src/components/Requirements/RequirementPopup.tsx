import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from "@mui/material";
import { apiRequest } from "../../services/api";
import EditRequirementPopup from "./EditRequirementPopup";
import CreateRequirementPopup from "./CreateRequirementPopup";

interface Requirement {
  requirementId: number;
  requirementText: string;
  requirementType: "FUNCIONAL" | "NO_FUNCIONAL";
}

interface RequirementsPopupProps {
  projectId: number;
  userId: number;
  open: boolean;
  onClose: () => void;
}

const RequirementsPopup = ({ projectId, userId, open, onClose }: RequirementsPopupProps) => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchRequirements = async () => {
    try {
      const response = await apiRequest(`http://localhost:8080/projectorg/projects/${projectId}/requirements`);
      if (response.ok) {
        const data: Requirement[] = await response.json();
        setRequirements(data);
      }
    } catch (error) {
      console.error("Error fetching requirements", error);
    }
  };

  useEffect(() => {
    if (open) fetchRequirements();
  }, [open]);

  const handleDelete = async (requirementId: number) => {
    try {
      const response = await apiRequest(
        `http://localhost:8080/projectorg/projects/${projectId}/requirements/${requirementId}?userId=${userId}`,
        { method: "DELETE" }
      );
      if (response.ok) fetchRequirements();
    } catch (error) {
      console.error("Error deleting requirement", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Requisitos del Proyecto</DialogTitle>
      <DialogContent>
        <h3>Funcionales</h3>
        <List>
          {requirements.filter(req => req.requirementType === "FUNCIONAL").map(req => (
            <ListItem key={req.requirementId}>
              <ListItemText primary={req.requirementText} />
              <Button variant="contained" color="primary" onClick={() => setEditingRequirement(req)}>
                Editar
              </Button>
              <Button variant="contained" color="error" onClick={() => handleDelete(req.requirementId)}>
                Eliminar
              </Button>
            </ListItem>
          ))}
        </List>
        <h3>No Funcionales</h3>
        <List>
          {requirements.filter(req => req.requirementType === "NO_FUNCIONAL").map(req => (
            <ListItem key={req.requirementId}>
              <ListItemText primary={req.requirementText} />
              <Button variant="contained" color="primary" onClick={() => setEditingRequirement(req)}>
                Editar
              </Button>
              <Button variant="contained" color="error" onClick={() => handleDelete(req.requirementId)}>
                Eliminar
              </Button>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cerrar</Button>
        <Button onClick={() => setCreating(true)} color="primary">Crear Nuevo Requisito</Button>
      </DialogActions>
      {editingRequirement && (
        <EditRequirementPopup
          projectId={projectId}
          userId={userId}
          requirement={editingRequirement}
          open={Boolean(editingRequirement)}
          onClose={() => setEditingRequirement(null)}
          refreshRequirements={fetchRequirements}
        />
      )}
      {creating && (
        <CreateRequirementPopup
          projectId={projectId}
          userId={userId}
          open={creating}
          onClose={() => setCreating(false)}
          refreshRequirements={fetchRequirements}
        />
      )}
    </Dialog>
  );
};

export default RequirementsPopup;
