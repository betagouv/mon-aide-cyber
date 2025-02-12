import { describe, expect, it } from 'vitest';
import {
  cocheConsentementAnnuaire,
  cocheTypeAffichageAnnuaire,
  EtatProfil,
  profilCharge,
  reducteurProfil,
} from '../../../src/domaine/espace-aidant/mon-compte/ecran-mes-informations/composants/reducteurProfil.ts';
import { TypeAffichageAnnuaire } from 'mon-aide-cyber-api/src/espace-aidant/Aidant';

describe('reducteur profil', () => {
  const profilVide: EtatProfil = {
    dateCreationCompte: '',
    email: '',
    nom: '',
    prenom: '',
    consentementAnnuaire: false,
    consentementAChange: false,
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
        affichagesAnnuaire: [
          {
            type: TypeAffichageAnnuaire.PRENOM_N,
            valeur: 'Jean D.',
            actif: true,
          },
          {
            type: TypeAffichageAnnuaire.PRENOM_NOM,
            valeur: 'Jean Dupont',
            actif: false,
          },
          {
            type: TypeAffichageAnnuaire.P_NOM,
            valeur: 'J. Dupont',
            actif: false,
          },
        ],
      })
    );

    expect(etatProfil).toStrictEqual<EtatProfil>({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@email.fr',
      dateCreationCompte: '03.12.2023',
      consentementAnnuaire: false,
      consentementAChange: false,
      affichagesAnnuaire: [
        {
          type: TypeAffichageAnnuaire.PRENOM_N,
          valeur: 'Jean D.',
          actif: true,
        },
        {
          type: TypeAffichageAnnuaire.PRENOM_NOM,
          valeur: 'Jean Dupont',
          actif: false,
        },
        {
          type: TypeAffichageAnnuaire.P_NOM,
          valeur: 'J. Dupont',
          actif: false,
        },
      ],
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
        affichagesAnnuaire: [
          {
            type: TypeAffichageAnnuaire.PRENOM_N,
            valeur: 'Jean D.',
            actif: true,
          },
          {
            type: TypeAffichageAnnuaire.PRENOM_NOM,
            valeur: 'Jean Du Jardin',
            actif: false,
          },
          {
            type: TypeAffichageAnnuaire.P_NOM,
            valeur: 'J. Du Jardin',
            actif: false,
          },
        ],
        identifiantConnexion: 'jean.dupont@email.fr',
      })
    );

    expect(etatProfil).toStrictEqual<EtatProfil>({
      nom: 'Du Jardin',
      prenom: 'Jean',
      email: 'jean.dupont@email.fr',
      dateCreationCompte: '03.12.2023',
      consentementAnnuaire: false,
      consentementAChange: false,
      affichagesAnnuaire: [
        {
          type: TypeAffichageAnnuaire.PRENOM_N,
          valeur: 'Jean D.',
          actif: true,
        },
        {
          type: TypeAffichageAnnuaire.PRENOM_NOM,
          valeur: 'Jean Du Jardin',
          actif: false,
        },
        {
          type: TypeAffichageAnnuaire.P_NOM,
          valeur: 'J. Du Jardin',
          actif: false,
        },
      ],
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
          consentementAChange: false,
          enCoursDeChargement: false,
        },
        cocheConsentementAnnuaire()
      );

      expect(etatProfil).toStrictEqual<EtatProfil>({
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@email.fr',
        dateCreationCompte: '03.12.2023',
        consentementAnnuaire: true,
        consentementAChange: true,
        enCoursDeChargement: false,
      });
    });

    it("Sélectionne un format d'affichage du nom dans l'annuaire", () => {
      const etatProfil = reducteurProfil(
        {
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean.dupont@email.fr',
          dateCreationCompte: '03.12.2023',
          consentementAnnuaire: true,
          consentementAChange: false,
          enCoursDeChargement: false,
          affichagesAnnuaire: [
            {
              type: TypeAffichageAnnuaire.PRENOM_N,
              valeur: 'Jean D.',
              actif: false,
            },
            {
              type: TypeAffichageAnnuaire.PRENOM_NOM,
              valeur: 'Jean Dupont',
              actif: true,
            },
            {
              type: TypeAffichageAnnuaire.P_NOM,
              valeur: 'J. Dupont',
              actif: false,
            },
          ],
        },
        cocheTypeAffichageAnnuaire(TypeAffichageAnnuaire.PRENOM_N)
      );

      expect(etatProfil).toStrictEqual<EtatProfil>({
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@email.fr',
        dateCreationCompte: '03.12.2023',
        consentementAnnuaire: true,
        consentementAChange: false,
        enCoursDeChargement: false,
        affichagesAnnuaire: [
          {
            type: TypeAffichageAnnuaire.PRENOM_N,
            valeur: 'Jean D.',
            actif: true,
          },
          {
            type: TypeAffichageAnnuaire.PRENOM_NOM,
            valeur: 'Jean Dupont',
            actif: false,
          },
          {
            type: TypeAffichageAnnuaire.P_NOM,
            valeur: 'J. Dupont',
            actif: false,
          },
        ],
      });
    });

    it('S‘assure que le consentement a été modifié', () => {
      const etatProfil = reducteurProfil(
        {
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean.dupont@email.fr',
          dateCreationCompte: '03.12.2023',
          consentementAnnuaire: true,
          consentementAChange: false,
          enCoursDeChargement: false,
        },
        cocheConsentementAnnuaire()
      );

      expect(etatProfil).toStrictEqual<EtatProfil>({
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@email.fr',
        dateCreationCompte: '03.12.2023',
        consentementAnnuaire: false,
        consentementAChange: true,
        enCoursDeChargement: false,
      });
    });
  });
});
