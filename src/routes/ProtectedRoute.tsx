import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({ requiredRole }: { requiredRole?: string }) => {
  const { token } = useAuth();
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole !== role) setRole(storedRole);
  }, [role]);

  if (!token) return <Navigate to="/login" replace />;

  console.log(`Accediendo a ruta protegida, se necesita: ${requiredRole}, usuario tiene: ${role}`);
  console.log('Comparación directa:', role === requiredRole);
  console.log('Comparación con trim:', role?.trim() === requiredRole?.trim());
  console.log('Estado actual de role:', role);

  if (requiredRole && role?.trim() !== requiredRole.trim()) {
    setTimeout(() => console.log('Redirigiendo a /user...'), 1000);
    return <Navigate to="/user" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;


