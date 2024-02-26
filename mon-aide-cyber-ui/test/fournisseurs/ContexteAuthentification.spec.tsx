import { describe, expect, it } from 'vitest';

import { Navigate, Outlet } from 'react-router-dom';
import {
  initialiseReducteurUtilisateurAuthentifie,
  reducteurUtilisateurAuthentifie,
  utilisateurCharge,
  utilisateurNonAuthentifie,
} from '../../src/fournisseurs/ContexteAuthentification.tsx';

describe('Fournisseur contexte authentification', () => {
  it("l'utilisateur n'est pas authentifié", () => {
    const etatUtilisateurAuthentifie = reducteurUtilisateurAuthentifie(
      initialiseReducteurUtilisateurAuthentifie(),
      utilisateurNonAuthentifie(),
    );

    expect(etatUtilisateurAuthentifie).toStrictEqual({
      element: <Navigate to="/" />,
      enAttenteDeChargement: false,
    });
  });

  it('est authentifié', () => {
    const etatUtilisateurAuthentifie = reducteurUtilisateurAuthentifie(
      initialiseReducteurUtilisateurAuthentifie(),
      utilisateurCharge({ nomPrenom: 'Jean Dupont' }),
    );

    expect(etatUtilisateurAuthentifie).toStrictEqual({
      element: <Outlet />,
      enAttenteDeChargement: false,
      utilisateur: {
        nomPrenom: 'Jean Dupont',
      },
    });
  });
});
