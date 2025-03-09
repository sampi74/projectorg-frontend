import { useState, useEffect } from "react";
import { Container, Button, Typography, Stack, Card, CardContent, Chip, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";

const API_BASE_URL = "http://localhost:8080/projectorg/users";

const MyProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const fetchProjects = async (type: string) => {
    if (!user) return;
    try {
      const response = await apiRequest(`${API_BASE_URL}/${user.userId}/${type}`);
      if (!response.ok) throw new Error("Error al cargar proyectos");
      const data = await response.json();
      setProjects(data);
      setPage(0); // Resetear a la primera página cuando cambia el filtro
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects(filter === "all" ? "allprojects" : filter === "leader" ? "leading" : "collaborating");
  }, [filter]);

  const projectStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS": return "warning";
      case "FINISHED": return "success";
      case "CANCELED": return "error";
      default: return "default";
    }
  };

  const getUserRole = (project: any) => {
    if (filter === "leader") return "Líder";
    if (filter === "collaborator") return "Colaborador";
    return project.projectLeader.userId === user?.userId ? "Líder" : "Colaborador";
  };

  const projectsPerPage = 3;
  const paginatedProjects = projects.slice(page * projectsPerPage, (page + 1) * projectsPerPage);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Mis Proyectos</Typography>
      
      {/* Filtros */}
      <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
        <Button variant={filter === "all" ? "contained" : "outlined"} onClick={() => setFilter("all")}>
          Todos
        </Button>
        <Button variant={filter === "leader" ? "contained" : "outlined"} onClick={() => setFilter("leader")}>
          Líder
        </Button>
        <Button variant={filter === "collaborator" ? "contained" : "outlined"} onClick={() => setFilter("collaborator")}>
          Colaborador
        </Button>
      </Stack>

      {/* Lista de proyectos en filas */}
      <Stack spacing={2}>
        {paginatedProjects.map((project: any) => (
          <Card key={project.projectId} sx={{ p: 2 }}>
            <CardContent>
              {/* Contenedor superior con estado y rol */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Chip label={project.state} color={projectStatusColor(project.state)} />
                <Chip 
                  label={getUserRole(project)} 
                  color={getUserRole(project) === "Líder" ? "primary" : "secondary"} 
                  variant="outlined"
                />
              </Box>

              <Typography variant="h6" sx={{ mt: 1 }}>{project.projectName}</Typography>
              <Typography variant="body2" color="textSecondary">{project.projectDescription}</Typography>
              <Typography variant="subtitle2">Líder: {project.projectLeader.userFullName}</Typography>

              {/* Botón para abrir proyecto */}
              <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth
              onClick={() => navigate(`/projects/${project.projectId}`)}>
                Abrir Proyecto
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Paginación */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Button disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</Button>
        <Button disabled={(page + 1) * projectsPerPage >= projects.length} onClick={() => setPage(page + 1)}>Siguiente</Button>
      </Stack>
    </Container>
  );
};

export default MyProjectsPage;

