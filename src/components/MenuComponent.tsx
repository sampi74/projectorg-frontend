import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";

interface MenuOption {
  label: string;
  icon: React.ReactNode;
  image: string;
  onClick: () => void;
}

interface MenuComponentProps {
  title: string;
  options: MenuOption[];
}

const MenuComponent: React.FC<MenuComponentProps> = ({ title, options }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          justifyContent: "center",
          alignItems: "stretch", // Hace que las tarjetas crezcan en altura
          gridTemplateColumns: isSmallScreen
            ? "1fr"
            : isMediumScreen
            ? "repeat(2, 1fr)"
            : "repeat(2, minmax(300px, 1fr))",
        }}
      >
        {options.map((option, index) => (
          <Paper
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: isSmallScreen ? 150 : isMediumScreen ? 200 : 250, // Aumenta el alto en pantallas grandes
              p: 2,
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${option.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
              color: "#fff",
              textShadow: "2px 2px 8px rgba(0,0,0,1)", // Más sombra para mejorar legibilidad
              "&:hover": { opacity: 0.9 },
            }}
            onClick={option.onClick}
          >
            <Box
              sx={{
                fontSize: isSmallScreen ? 40 : isMediumScreen ? 50 : 60, // Ajusta el tamaño del icono
                filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.8))", // Sombra al icono
              }}
            >
              {option.icon}
            </Box>
            <Typography
              variant="h6"
              sx={{
                mt: 1,
                fontSize: isSmallScreen ? "1rem" : isMediumScreen ? "1.2rem" : "1.5rem",
                fontWeight: "bold",
              }}
            >
              {option.label}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default MenuComponent;

