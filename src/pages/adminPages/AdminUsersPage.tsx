import { useState, useEffect } from "react";
import { Container, Button, Typography, Grid, Card, CardContent, Stack, TextField, MenuItem, Select } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api";

const API_BASE_URL = "http://localhost:8080/projectorg/admin/users";

interface User {
  userId: number;
  fullName: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  leadingProjects: number;
  collaboratingProjects: number;
}

const AdminUsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  const fetchUsers = async () => {
    try {
      const url = filterRole ? `${API_BASE_URL}/role?role=${filterRole}` : API_BASE_URL;
      const response = await apiRequest(url);
      if (!response.ok) throw new Error("Error al cargar usuarios");
      const data: User[] = await response.json();

      // Obtener cantidad de proyectos liderados y colaborados por cada usuario
      const usersWithProjectCounts = await Promise.all(
        data.map(async (user) => {
          const leadingRes = await fetch(`${API_BASE_URL}/${user.userId}/leading`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const collaboratingRes = await fetch(`${API_BASE_URL}/${user.userId}/collaborating`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          const leadingProjects = leadingRes.ok ? await leadingRes.json() : 0;
          const collaboratingProjects = collaboratingRes.ok ? await collaboratingRes.json() : 0;

          return { ...user, leadingProjects, collaboratingProjects };
        })
      );

      setUsers(usersWithProjectCounts);
      setPage(0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const usersPerPage = 4;
  const filteredUsers = users?.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm?.toLowerCase() ?? "")
  ) || [];
  
  const paginatedUsers = filteredUsers.slice(page * usersPerPage, (page + 1) * usersPerPage);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Administración de Usuarios</Typography>
      <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
        <Button variant={!filterRole ? "contained" : "outlined"} onClick={() => setFilterRole(null)}>
          Todos
        </Button>
        <Button variant={filterRole === "USER" ? "contained" : "outlined"} onClick={() => setFilterRole("USER")}>
          Usuarios
        </Button>
        <Button variant={filterRole === "ADMIN" ? "contained" : "outlined"} onClick={() => setFilterRole("ADMIN")}>
          Administradores
        </Button>
      </Stack>

      <TextField
        label="Buscar por Nombre, Usuario o Email"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Grid container spacing={2}>
        {paginatedUsers.map((user) => (
          <Grid item xs={12} key={user.userId}>
            <Card>
              <CardContent>
                <Typography variant="h6">{user.fullName}</Typography>
                <Typography variant="body2">Usuario: {user.username}</Typography>
                <Typography variant="body2">Email: {user.email}</Typography>
                <Typography variant="body2">Rol: {user.role}</Typography>
                <Typography variant="body2">Proyectos Liderados: {user.leadingProjects}</Typography>
                <Typography variant="body2">Proyectos Colaborados: {user.collaboratingProjects}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Button disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</Button>
        <Button disabled={(page + 1) * usersPerPage >= filteredUsers.length} onClick={() => setPage(page + 1)}>Siguiente</Button>
      </Stack>
    </Container>
  );
};

export default AdminUsersPage;
