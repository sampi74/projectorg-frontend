import { useNavigate } from "react-router-dom";
import { AccountCircle, AddBox, ExitToApp, FolderCopy } from "@mui/icons-material";
import MenuComponent from "../../components/MenuComponent";
import crearP from "../../assets/menuImages/crear_proyecto.jpeg"
import misP from "../../assets/menuImages/mis_proyectos.jpg"
import miPer from "../../assets/menuImages/mi_perfil.png"
import cerrar from "../../assets/menuImages/cerrar_sesion.webp"

const UserMenu = () => {
  const navigate = useNavigate();

  const userOptions = [
    {
      label: "Crear Proyecto",
      icon: <AddBox fontSize="large" />,
      image: crearP,
      onClick: () => navigate("/projects/create"),
    },
    {
      label: "Mis Proyectos",
      icon: <FolderCopy fontSize="large" />,
      image: misP,
      onClick: () => navigate("/projects/all"),
    },
    {
      label: "Mi Perfil",
      icon: <AccountCircle fontSize="large" />,
      image: miPer,
      onClick: () => navigate("/user"),
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

  return <MenuComponent title="Menú" options={userOptions} />;
};

export default UserMenu;
