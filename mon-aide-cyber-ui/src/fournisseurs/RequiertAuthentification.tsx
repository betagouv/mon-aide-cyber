import { useUtilisateur } from './hooks.ts';
import { Outlet } from 'react-router-dom';

export const RequiertAuthentification = () => {
  const { affiche } = useUtilisateur();
  return affiche(<Outlet />);
};
