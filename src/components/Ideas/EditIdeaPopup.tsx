import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { apiRequest } from "../../services/api";

interface EditIdeaPopupProps {
  projectId: number;
  userId: number;
  idea: { ideaId: number; ideaText: string };
  open: boolean;
  onClose: () => void;
  refreshIdeas: () => void;
}

const EditIdeaPopup = ({ projectId, userId, idea, open, onClose, refreshIdeas }: EditIdeaPopupProps) => {
  const [newText, setNewText] = useState(idea.ideaText);

  const handleSave = async () => {
    try {
      const response = await apiRequest(
        `http://localhost:8080/projectorg/projects/${projectId}/ideas/${idea.ideaId}?userId=${userId}&newText=${encodeURIComponent(newText)}`,
        { method: "PUT" }
      );
      if (response.ok) {
        refreshIdeas();
        onClose();
      }
    } catch (error) {
      console.error("Error updating idea", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Editar Idea</DialogTitle>
      <DialogContent>
        <TextField 
          fullWidth 
          label="Nuevo Nombre" 
          value={newText} 
          onChange={(e) => setNewText(e.target.value)} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditIdeaPopup;
