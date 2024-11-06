import { useUtilisateur } from './hooks.ts';
import { Navigate, Outlet } from 'react-router-dom';

export const RequiertAuthentification = () => {
  const { estAuthentifie } = useUtilisateur();
  return estAuthentifie ? <Outlet /> : <Navigate to="/connexion" />;
};
