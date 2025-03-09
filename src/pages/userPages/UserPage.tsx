import { Container, Paper, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "ADMIN"; // Verifica si el usuario es admin

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          Mi Perfil
        </Typography>
        <Typography variant="body1">
          <strong>Nombre Completo:</strong> {user?.userFullName}
        </Typography>
        <Typography variant="body1">
          <strong>Nombre de Usuario:</strong> {user?.username}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user?.userEmail}
        </Typography>

        <Box mt={3} display="flex" flexDirection="column" gap={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate(`${isAdmin ? "/admin" : ""}/user/edit`)}
          >
            Editar Perfil
          </Button>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => navigate(`${isAdmin ? "/admin" : ""}/user/change-password`)}
          >
            Cambiar Contraseña
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;

