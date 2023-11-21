import { Navigate, Outlet } from 'react-router-dom';
import { useAuthentification } from './hooks.ts';

export const RequiertAuthentification = () => {
  const authentification = useAuthentification();

  return authentification.utilisateur !== null &&
    authentification.utilisateur.nomPrenom !== '' ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};
