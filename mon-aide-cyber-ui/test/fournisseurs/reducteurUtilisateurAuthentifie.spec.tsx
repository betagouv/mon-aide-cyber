import { describe, expect } from 'vitest';
import {
  initialiseReducteurUtilisateurAuthentifie,
  reducteurUtilisateurAuthentifie,
  utilisateurCharge,
  utilisateurNonAuthentifie,
} from '../../src/fournisseurs/reducteurUtilisateurAuthentifie.tsx';
import { unUtilisateur } from '../constructeurs/constructeurUtilisateur.ts';
import { Navigate, Outlet } from 'react-router-dom';

describe('Réducteur utilisateur authentifié', () => {
  it("charge l'utilisateur", () => {
    const utilisateur = unUtilisateur().construis();
    const etatUtilisateurAuthentifie = reducteurUtilisateurAuthentifie(
      initialiseReducteurUtilisateurAuthentifie(),
      utilisateurCharge(utilisateur)
    );

    expect(etatUtilisateurAuthentifie).toStrictEqual({
      element: <Outlet />,
      enAttenteDeChargement: false,
      utilisateur,
    });
  });

  it("redirige l'utilisateur", () => {
    const etatUtilisateurAuthentifie = reducteurUtilisateurAuthentifie(
      initialiseReducteurUtilisateurAuthentifie(),
      utilisateurNonAuthentifie()
    );

    expect(etatUtilisateurAuthentifie).toStrictEqual({
      element: <Navigate to="/" />,
      enAttenteDeChargement: false,
    });
  });
});
