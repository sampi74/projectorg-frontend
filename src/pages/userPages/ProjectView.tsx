import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { apiRequest } from "../../services/api";
import IdeasPopup from "../../components/Ideas/IdeasPopup";
import { useAuth } from "../../context/AuthContext";
import RequirementsPopup from "../../components/Requirements/RequirementPopup";
import TasksPopup from "../../components/Task/TaskPopup";

interface Project {
  projectId: number;
  projectName: string;
}

interface Idea {
  ideaId: number;
  ideaText: string;
}

interface Requirement {
  requirementId: number;
  requirementText: string;
  requirementType: "FUNCIONAL" | "NO_FUNCIONAL";
}

interface Task {
  taskId: number;
  taskText: string;
  state: string;
}

interface File {
  fileUrl: string;
}

interface Diagram {
  diagramUrl: string;
}

const ProjectView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [showIdeasPopup, setShowIdeasPopup] = useState(false);
  const [showRequirementsPopup, setShowRequirementsPopup] = useState(false);
  const [showTasksPopup, setShowTasksPopup] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await apiRequest(`http://localhost:8080/projectorg/projects/${id}`);
        if (projectRes.ok) setProject(await projectRes.json());

        const ideasRes = await apiRequest(`http://localhost:8080/projectorg/projects/${id}/ideas`);
        if (ideasRes.ok) setIdeas(await ideasRes.json());

        const requirementsRes = await apiRequest(`http://localhost:8080/projectorg/projects/${id}/requirements`);
        if (requirementsRes.ok) setRequirements(await requirementsRes.json());

        const tasksRes = await apiRequest(`http://localhost:8080/projectorg/projects/${id}/tasks`);
        if (tasksRes.ok) setTasks(await tasksRes.json());

        const filesRes = await apiRequest(`http://localhost:8080/projectorg/projects/${id}/files`);
        if (filesRes.ok) setFiles(await filesRes.json());

        const diagramsRes = await apiRequest(`http://localhost:8080/projectorg/projects/${id}/diagrams`);
        if (diagramsRes.ok) setDiagrams(await diagramsRes.json());
      } catch (error) {
        console.error("Error fetching project data", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{project?.projectName}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
        <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Ideas</Typography>
            {ideas.slice(0, 2).map((idea) => (
              <Typography key={idea.ideaId}>{idea.ideaText}</Typography>
            ))}
            <Button onClick={() => setShowIdeasPopup(true)}>Ver Ideas</Button> {/* Abre el popup */}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Requisitos</Typography>
            {requirements.slice(0, 2).map((req) => (
              <Typography key={req.requirementId}>{req.requirementText} ({req.requirementType})</Typography>
            ))}
            <Button onClick={() => setShowRequirementsPopup(true)}>Ver Requisitos</Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Tareas</Typography>
            <Grid container spacing={2}>
              {tasks.map((task) => (
                <Grid item xs={4} key={task.taskId}>
                  <Paper sx={{ padding: 1 }}>{task.taskText} ({task.state})</Paper>
                </Grid>
              ))}
            </Grid>
            <Button onClick={() => setShowTasksPopup(true)}>Ver Tareas</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Archivos</Typography>
            {files[0] && <img src={files[0].fileUrl} alt="Archivo" style={{ width: "100%" }} />}
            <Button onClick={() => navigate(`/projects/${id}/files`)}>Ver Archivos</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Diagramas</Typography>
            {diagrams[0] && <img src={diagrams[0].diagramUrl} alt="Diagrama" style={{ width: "100%" }} />}
            <Button onClick={() => navigate(`/projects/${id}/diagrams`)}>Ver Diagramas</Button>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item>
          <Button variant="contained" onClick={() => navigate(`/projects/${id}/members`)}>Ver Miembros</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => navigate(`/projects/${id}/edit`)}>Editar Proyecto</Button>
        </Grid>
      </Grid>

      <IdeasPopup
        open={showIdeasPopup}
        onClose={() => setShowIdeasPopup(false)}
        projectId={Number(id)}
        userId={Number(user?.userId)}
      />
      <RequirementsPopup
        open={showRequirementsPopup}
        onClose={() => setShowRequirementsPopup(false)}
        projectId={Number(id)}
        userId={Number(user?.userId)}
      />
      <TasksPopup
        open={showTasksPopup}
        onClose={() => setShowTasksPopup(false)}
        projectId={Number(id)}
        userId={Number(user?.userId)}
      />
    </Container>
  );
};

export default ProjectView;
