import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import { apiRequest } from "../../services/api";

interface CreateRequirementPopupProps {
  projectId: number;
  userId: number;
  open: boolean;
  onClose: () => void;
  refreshRequirements: () => void;
}

const CreateRequirementPopup = ({ projectId, userId, open, onClose, refreshRequirements }: CreateRequirementPopupProps) => {
  const [text, setText] = useState("");
  const [type, setType] = useState("FUNCIONAL");

  const handleCreate = async () => {
    try {
      const url = `http://localhost:8080/projectorg/projects/${projectId}/requirements?userId=${userId}&text=${encodeURIComponent(text)}&type=${type}`;
      const response = await apiRequest(url, { method: "POST" });
      if (response.ok) {
        refreshRequirements();
        onClose();
      }
    } catch (error) {
      console.error("Error creating requirement", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Crear Nuevo Requisito</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Texto del Requisito" value={text} onChange={(e) => setText(e.target.value)} />
        <TextField
          select
          fullWidth
          label="Tipo de Requisito"
          value={type}
          onChange={(e) => setType(e.target.value)}
          margin="dense"
        >
          <MenuItem value="FUNCIONAL">Funcional</MenuItem>
          <MenuItem value="NO_FUNCIONAL">No Funcional</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleCreate} color="primary">Crear</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRequirementPopup;
