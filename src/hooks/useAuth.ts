import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useAuthCheck = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          logout();
        }
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [logout]);
};
export { useAuth };

