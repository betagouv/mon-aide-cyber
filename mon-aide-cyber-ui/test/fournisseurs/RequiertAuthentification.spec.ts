import { describe, expect, it } from 'vitest';
import {
  initialiseReducteurUtilisateurAuthentifie,
  reducteurUtilisateurAuthentifie,
} from '../../src/fournisseurs/RequiertAuthentification';
import { ReponseAuthentification } from '../../src/domaine/authentification/Authentification';
describe('Fournisseur requiert authentification', () => {
  it("n'est pas authentifié si l'utilisateur est null", () => {
    const etatUtilisateurAuthentifie = reducteurUtilisateurAuthentifie(
      initialiseReducteurUtilisateurAuthentifie(null),
    );

    expect(etatUtilisateurAuthentifie.estAuthentifie()).toBe(false);
  });

  it("n'est pas authentifié si l'utilisateur est n'a pas de nom prénom", () => {
    const etatUtilisateurAuthentifie = reducteurUtilisateurAuthentifie(
      initialiseReducteurUtilisateurAuthentifie(
        {} as unknown as ReponseAuthentification,
      ),
    );

    expect(etatUtilisateurAuthentifie.estAuthentifie()).toBe(false);
  });

  it('est authentifié', () => {
    const etatUtilisateurAuthentifie = reducteurUtilisateurAuthentifie(
      initialiseReducteurUtilisateurAuthentifie({ nomPrenom: 'Jean Dupont' }),
    );

    expect(etatUtilisateurAuthentifie.estAuthentifie()).toBe(true);
  });
});
