import { describe, expect, it } from 'vitest';
import {
  cocheConsentementAnnuaire,
  EtatProfil,
  profilCharge,
  reducteurProfil,
} from '../../../src/composants/profil/reducteurProfil.ts';

describe('reducteur profil', () => {
  const profilVide: EtatProfil = {
    dateCreationCompte: '',
    email: '',
    nom: '',
    prenom: '',
    consentementAnnuaire: false,
    enCoursDeChargement: true,
  };

  it('charge un profil', () => {
    const etatProfil = reducteurProfil(
      profilVide,
      profilCharge({
        liens: { 'modifier-profil': { url: '' }, suite: { url: '' } },
        nomPrenom: 'Jean Dupont',
        dateSignatureCGU: '03.12.2023',
        consentementAnnuaire: false,
        identifiantConnexion: 'jean.dupont@email.fr',
      })
    );

    expect(etatProfil).toStrictEqual({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@email.fr',
      dateCreationCompte: '03.12.2023',
      consentementAnnuaire: false,
      enCoursDeChargement: false,
    });
  });

  it('charge un profil avec nom composé', () => {
    const etatProfil = reducteurProfil(
      profilVide,
      profilCharge({
        liens: { 'modifier-profil': { url: '' }, suite: { url: '' } },
        nomPrenom: 'Jean Du Jardin',
        dateSignatureCGU: '03.12.2023',
        consentementAnnuaire: false,
        identifiantConnexion: 'jean.dupont@email.fr',
      })
    );

    expect(etatProfil).toStrictEqual({
      nom: 'Du Jardin',
      prenom: 'Jean',
      email: 'jean.dupont@email.fr',
      dateCreationCompte: '03.12.2023',
      consentementAnnuaire: false,
      enCoursDeChargement: false,
    });
  });

  describe('Modifie les valeurs du formulaire', () => {
    it("Coche la case de consentement à apparaître sur l'annuaire", () => {
      const etatProfil = reducteurProfil(
        {
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean.dupont@email.fr',
          dateCreationCompte: '03.12.2023',
          consentementAnnuaire: false,
          enCoursDeChargement: false,
        },
        cocheConsentementAnnuaire()
      );

      expect(etatProfil).toStrictEqual({
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@email.fr',
        dateCreationCompte: '03.12.2023',
        consentementAnnuaire: true,
        enCoursDeChargement: false,
      });
    });
  });
});
