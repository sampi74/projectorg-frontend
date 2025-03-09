import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from "@mui/material";
import { apiRequest } from "../../services/api";
import EditIdeaPopup from "./EditIdeaPopup";
import CreateIdeaPopup from "./CreateIdeaPopup";

interface Idea {
  ideaId: number;
  ideaText: string;
}

interface IdeasPopupProps {
  projectId: number;
  userId: number;
  open: boolean;
  onClose: () => void;
}

const IdeasPopup = ({ projectId, userId, open, onClose }: IdeasPopupProps) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchIdeas = async () => {
    try {
      const response = await apiRequest(`http://localhost:8080/projectorg/projects/${projectId}/ideas`);
      if (response.ok) {
        const data: Idea[] = await response.json();
        setIdeas(data);
      }
    } catch (error) {
      console.error("Error fetching ideas", error);
    }
  };

  useEffect(() => {
    if (open) fetchIdeas();
  }, [open]);

  const handleDelete = async (ideaId: number) => {
    try {
      const response = await apiRequest(
        `http://localhost:8080/projectorg/projects/${projectId}/ideas/${ideaId}?userId=${userId}`,
        { method: "DELETE" }
      );
      if (response.ok) fetchIdeas();
    } catch (error) {
      console.error("Error deleting idea", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Ideas del Proyecto</DialogTitle>
      <DialogContent>
        <List>
          {ideas.map((idea) => (
            <ListItem key={idea.ideaId}>
              <ListItemText primary={idea.ideaText} />
              <Button variant="contained" color="primary" onClick={() => setEditingIdea(idea)}>
                Editar
              </Button>
              <Button variant="contained" color="error" onClick={() => handleDelete(idea.ideaId)}>
                Eliminar
              </Button>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cerrar</Button>
        <Button onClick={() => setCreating(true)} color="primary">Crear Nueva Idea</Button>
      </DialogActions>
      {editingIdea && (
        <EditIdeaPopup
          projectId={projectId}
          userId={userId}
          idea={editingIdea}
          open={Boolean(editingIdea)}
          onClose={() => setEditingIdea(null)}
          refreshIdeas={fetchIdeas}
        />
      )}
      {creating && (
        <CreateIdeaPopup
          projectId={projectId}
          userId={userId}
          open={creating}
          onClose={() => setCreating(false)}
          refreshIdeas={fetchIdeas}
        />
      )}
    </Dialog>
  );
};

export default IdeasPopup;
