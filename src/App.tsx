import { useState } from "react";
import { CssBaseline, Box } from "@mui/material";
import Sidebar from "./components/SideBar";
import AppRouter from "./routes/AppRouter";

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [blur, setBlur] = useState(false);

  return (
    <>
      <CssBaseline />
      {showSidebar && <Sidebar setBlur={setBlur} />}

      {/* Contenido principal con margen solo si la sidebar está visible */}
      <Box
        sx={{
          transition: "margin-left 0.3s ease",
          ...(showSidebar && { marginLeft: "60px" }),
          ...(blur && showSidebar && { filter: "blur(3px)" }), // Solo aplicar blur si la sidebar está visible
        }}
      >
        <AppRouter setShowSidebar={setShowSidebar} />
      </Box>
    </>
  );
}

export default App;


