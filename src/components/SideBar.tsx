import { useMemo, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Toolbar
} from "@mui/material";
import {
  Home,
  AccountCircle,
  ExitToApp,
  Menu,
  People,
  BarChart,
  Assignment,
  Login,
  AppRegistration,
  AddBox,
  FolderCopy,
  AddModerator
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setBlur }: { setBlur: (blur: boolean) => void }) => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (role === undefined) {
    return null; // O un loader/spinner si prefieres
  }

  const toggleDrawer = () => {
    setOpen((prev) => {
      setBlur(!prev); // Aplica desenfoque al contenido cuando la sidebar esté abierta
      return !prev;
    });
  };

  const menuItems = useMemo(() => {
    if (role === "ADMIN") {
      return [
        { text: "Menú", icon: <Home />, path: "/admin" },
        { text: "Mi Perfil", icon: <AccountCircle />, path: "/admin/user" },
        { text: "Usuarios", icon: <People />, path: "/admin/users" },
        { text: "Proyectos", icon: <Assignment />, path: "/admin/projects" },
        { text: "Estadísticas", icon: <BarChart />, path: "/stats" },
        { text: "Crear Moderador", icon: <AddModerator />, path: "/admin/create" }
      ];
    } else if (role === "USER") {
      return [
        { text: "Menú", icon: <Home />, path: "/menu" },
        { text: "Mi Perfil", icon: <AccountCircle />, path: "/user" },
        { text: "Crear Proyecto", icon: <AddBox />, path: "/projects/create" },
        { text: "Mis Proyectos", icon: <FolderCopy />, path: "/projects/all" },
      ];
    } else {
      return [
        { text: "Iniciar Sesión", icon: <Login />, path: "/login" },
        { text: "Registrarse", icon: <AppRegistration />, path: "/register" },
      ];
    }
  }, [role]);

  return (
    <>
      {/* Botón para abrir/cerrar la Sidebar */}
      <Box sx={{ position: "fixed", top: 10, left: 10, zIndex: 1300 }}>
        <IconButton onClick={toggleDrawer}>
          <Menu />
        </IconButton>
      </Box>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? 240 : 60,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 240 : 60,
            transition: "width 0.3s ease",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        {/* Espacio para evitar que se solape con el botón */}
        <Toolbar />
        <Divider />

        {/* Menú principal */}
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              button
              onClick={() => navigate(item.path)}
              sx={{
                justifyContent: open ? "flex-start" : "center",
                padding: "10px 16px",
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} sx={{ marginLeft: 2 }} />}
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Cerrar sesión en la parte inferior */}
        {role && (
          <List>
            <ListItem
              button  
              onClick={logout}
              sx={{
                justifyContent: open ? "flex-start" : "center",
                padding: "10px 16px",
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                <ExitToApp />
              </ListItemIcon>
              {open && <ListItemText primary="Cerrar Sesión" sx={{ marginLeft: 2 }} />}
            </ListItem>
          </List>
        )}
      </Drawer>
    </>
  );
};

export default Sidebar;

