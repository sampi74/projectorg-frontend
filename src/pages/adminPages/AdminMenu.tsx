import { useNavigate } from "react-router-dom";
import { AccountCircle, AddModerator, BarChart, ExitToApp, FolderCopy, Group } from "@mui/icons-material";
import MenuComponent from "../../components/MenuComponent";
import miPer from "../../assets/menuImages/mi_perfil.png"
import cerrar from "../../assets/menuImages/cerrar_sesion.webp"
import usuarios from "../../assets/menuImages/gestionar_usuarios.avif"
import proyectos from "../../assets/menuImages/gestionar_proyectos.jpg"
import estadisticas from "../../assets/menuImages/estadisticas.jpg"

const AdminMenu = () => {
    const navigate = useNavigate();
  
    const adminOptions = [
      {
        label: "Gestionar Usuarios",
        icon: <Group fontSize="large" />,
        image: usuarios,
        onClick: () => navigate("/admin/users"),
      },
      {
        label: "Gestionar Proyectos",
        icon: <FolderCopy fontSize="large" />,
        image: proyectos,
        onClick: () => navigate("/admin/projects"),
      },
      {
        label: "Estadisticas",
        icon: <BarChart fontSize="large" />,
        image: estadisticas,
        onClick: () => navigate("/profile"),
      },
      {
        label: "ABM Tipo Diagrama",
        icon: <BarChart fontSize="large" />,
        image: estadisticas,
        onClick: () => navigate("/admin/diagramtype"),
      },
      {
        label: "ABM Estado Tarea",
        icon: <BarChart fontSize="large" />,
        image: estadisticas,
        onClick: () => navigate("/admin/taskstate"),
      },
      {
        label: "Crear Administrador",
        icon: <AddModerator fontSize="large" />,
        image: estadisticas,
        onClick: () => navigate("/admin/create"),
      },
      {
        label: "Mi Perfil",
        icon: <AccountCircle fontSize="large" />,
        image: miPer,
        onClick: () => navigate("/admin/user"),
      },
      {
        label: "Cerrar Sesión",
        icon: <ExitToApp fontSize="large" />,
        image: cerrar,
        onClick: () => {
          localStorage.clear();
          navigate("/login");
        },
      },
    ];
  
    return <MenuComponent title="Menú" options={adminOptions} />;
  };
  
  export default AdminMenu;