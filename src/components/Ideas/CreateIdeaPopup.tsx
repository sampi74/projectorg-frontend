import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { apiRequest } from "../../services/api";

interface CreateIdeaPopupProps {
  projectId: number;
  userId: number;
  open: boolean;
  onClose: () => void;
  refreshIdeas: () => void;
}

const CreateIdeaPopup = ({ projectId, userId, open, onClose, refreshIdeas }: CreateIdeaPopupProps) => {
  const [newText, setNewText] = useState("");

  const handleCreate = async () => {
    try {
      const response = await apiRequest(
        `http://localhost:8080/projectorg/projects/${projectId}/ideas?userId=${userId}&text=${encodeURIComponent(newText)}`,
        { method: "POST" }
      );
      if (response.ok) {
        refreshIdeas();
        onClose();
      }
    } catch (error) {
      console.error("Error creating idea", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Crear Nueva Idea</DialogTitle>
      <DialogContent>
        <TextField 
          fullWidth 
          label="Nombre de la Idea" 
          value={newText} 
          onChange={(e) => setNewText(e.target.value)} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleCreate} color="primary">Crear</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateIdeaPopup;
