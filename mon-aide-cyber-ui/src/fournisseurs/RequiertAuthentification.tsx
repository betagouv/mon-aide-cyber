import { Navigate, Outlet } from 'react-router-dom';
import { useAuthentification } from './hooks.ts';
import { useReducer } from 'react';
import { Utilisateur } from '../domaine/authentification/Authentification.ts';
type EtatUtilisateurAuthentifie = {
  estAuthentifie: () => boolean;
};
export const reducteurUtilisateurAuthentifie = (
  etat: EtatUtilisateurAuthentifie,
): EtatUtilisateurAuthentifie => {
  return { estAuthentifie: () => etat.estAuthentifie() };
};

export const initialiseReducteurUtilisateurAuthentifie = (
  utilisateur: Utilisateur | null,
): EtatUtilisateurAuthentifie => {
  return {
    estAuthentifie: () =>
      utilisateur !== null &&
      utilisateur.nomPrenom !== undefined &&
      utilisateur.nomPrenom !== '',
  };
};

export const RequiertAuthentification = () => {
  const authentification = useAuthentification();
  const [etatUtilisateurAuthentifie] = useReducer(
    reducteurUtilisateurAuthentifie,
    initialiseReducteurUtilisateurAuthentifie(authentification.utilisateur),
  );

  return etatUtilisateurAuthentifie.estAuthentifie() ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};
