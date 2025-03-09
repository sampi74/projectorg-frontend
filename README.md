# ProjectOrg - Frontend

Este es el frontend de **ProjectOrg**, una aplicación de gestión de proyectos. Está desarrollado con **React**, **TypeScript** y utiliza **Material-UI** para la interfaz de usuario.

## 🚀 Tecnologías
- **React** (con Vite)
- **TypeScript**
- **Material-UI**
- **React Router**
- **JWT para autenticación**

## 📂 Estructura del Proyecto
```
projectorg-frontend/
│── src/
│   ├── components/       # Componentes reutilizables
│   ├── pages/            # Páginas principales
│   ├── services/         # Llamadas a la API
│   ├── context/          # Manejo de estado global
│   ├── hooks/            # Hooks personalizados
│── public/               # Archivos estáticos
│── vite.config.ts        # Configuración de Vite
│── package.json          # Dependencias y scripts
│── README.md             # Documentación
```

## ⚙️ Configuración

1. **Clonar el repositorio:**
```sh
git clone https://github.com/tuusuario/projectorg-frontend.git
cd projectorg-frontend
```

2. **Instalar dependencias:**
```sh
yarn install  # O npm install
```

3. **Configurar variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto con:
```sh
VITE_API_URL=http://localhost:8080
```

4. **Ejecutar el proyecto:**
```sh
yarn dev  # O npm run dev
```
El frontend estará disponible en `http://localhost:5173/`.

## 🔑 Autenticación
El frontend usa **JWT** para la autenticación. Tras hacer login, el token se almacena en **localStorage** y se usa en las solicitudes a la API.

## 📌 Funcionalidades
- **Inicio de sesión y registro**.
- **Gestión de proyectos y tareas**.
- **Edición de tareas con selección de estado**.

## 📜 Licencia
Este proyecto está bajo la licencia **MIT**.

