import { useState, useEffect } from "react";
import { Container, Button, Typography, Grid, Card, CardContent, Chip, Stack, TextField, MenuItem, Select } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api";

const API_BASE_URL = "http://localhost:8080/projectorg/admin/projects";

interface Project {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectLeader: {
    userFullName: string;
  };
  upDateProject: string;
  state: "IN_PROGRESS" | "CANCELED" | "FINISHED";
}

const AdminProjectsPage = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filterState, setFilterState] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  const fetchProjects = async () => {
    try {
      const url = filterState ? `${API_BASE_URL}/state?state=${filterState}` : API_BASE_URL;
      const response = await apiRequest(url);
      if (!response.ok) throw new Error("Error al cargar proyectos");
      const data: Project[] = await response.json();
      
      // Aplicar ordenamiento
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.upDateProject).getTime();
        const dateB = new Date(b.upDateProject).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });

      setProjects(sortedData);
      setPage(0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filterState, sortOrder]);

  const statusColor = (status: Project["state"]) => {
    switch (status) {
      case "IN_PROGRESS": return "warning";
      case "FINISHED": return "success";
      case "CANCELED": return "error";
      default: return "default";
    }
  };

  const projectsPerPage = 3;
  const filteredProjects = projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectId.toString().includes(searchTerm)
  );
  const paginatedProjects = filteredProjects.slice(page * projectsPerPage, (page + 1) * projectsPerPage);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Administración de Proyectos</Typography>
      <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
        <Button variant={!filterState ? "contained" : "outlined"} onClick={() => setFilterState(null)}>
          Todos
        </Button>
        <Button variant={filterState === "IN_PROGRESS" ? "contained" : "outlined"} onClick={() => setFilterState("IN_PROGRESS")}>
          En Progreso
        </Button>
        <Button variant={filterState === "CANCELED" ? "contained" : "outlined"} onClick={() => setFilterState("CANCELED")}>
          Cancelado
        </Button>
        <Button variant={filterState === "FINISHED" ? "contained" : "outlined"} onClick={() => setFilterState("FINISHED")}>
          Finalizado
        </Button>
        <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}>
          <MenuItem value="newest">Más recientes</MenuItem>
          <MenuItem value="oldest">Más antiguos</MenuItem>
        </Select>
      </Stack>

      <TextField
        label="Buscar por ID o Nombre"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Grid container spacing={2}>
        {paginatedProjects.map((project) => (
          <Grid item xs={12} key={project.projectId}>
            <Card>
              <CardContent>
                <Typography variant="h6">{project.projectName}</Typography>
                <Typography variant="body2" color="textSecondary">{project.projectDescription}</Typography>
                <Typography variant="subtitle2">Líder: {project.projectLeader.userFullName}</Typography>
                <Typography variant="subtitle2">Fecha de subida: {new Date(project.upDateProject).toLocaleDateString()}</Typography>
                <Stack direction="row" justifyContent="space-between">
                  <Chip label={project.state} color={statusColor(project.state)} />
                  <Button variant="contained">Ver Proyecto</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Button disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</Button>
        <Button disabled={(page + 1) * projectsPerPage >= filteredProjects.length} onClick={() => setPage(page + 1)}>Siguiente</Button>
      </Stack>
    </Container>
  );
};

export default AdminProjectsPage;

