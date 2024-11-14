import { describe, expect } from 'vitest';
import {
  initialiseReducteurUtilisateurAuthentifie,
  reducteurUtilisateurAuthentifie,
  utilisateurCharge,
} from '../../../src/domaine/authentification/reducteurUtilisateurAuthentifie.ts';

describe('Réducteur utilisateur authentifié', () => {
  it("charge l'utilisateur", () => {
    const etatUtilisateurAuthentifie = reducteurUtilisateurAuthentifie(
      initialiseReducteurUtilisateurAuthentifie(),
      utilisateurCharge()
    );

    expect(etatUtilisateurAuthentifie).toStrictEqual({
      enAttenteDeChargement: false,
    });
  });
});
