import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { apiRequest } from "../../services/api";

interface EditRequirementPopupProps {
  projectId: number;
  userId: number;
  requirement: { requirementId: number; requirementText: string; requirementType: string };
  open: boolean;
  onClose: () => void;
  refreshRequirements: () => void;
}

const EditRequirementPopup = ({ projectId, userId, requirement, open, onClose, refreshRequirements }: EditRequirementPopupProps) => {
  const [text, setText] = useState(requirement.requirementText);
  const [type, setType] = useState(requirement.requirementType);

  const handleSave = async () => {
    try {
      const url = `http://localhost:8080/projectorg/projects/${projectId}/requirements/${requirement.requirementId}?userId=${userId}&newText=${encodeURIComponent(text)}&newType=${encodeURIComponent(type)}`;
      
      const response = await apiRequest(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        refreshRequirements();
        onClose();
      }
    } catch (error) {
      console.error("Error updating requirement", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Editar Requisito</DialogTitle>
      <DialogContent>
        <TextField 
          fullWidth 
          label="Texto del Requisito" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          margin="dense"
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Tipo de Requisito</InputLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <MenuItem value="FUNCIONAL">Funcional</MenuItem>
            <MenuItem value="NO_FUNCIONAL">No Funcional</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRequirementPopup;


