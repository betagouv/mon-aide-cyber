import { describe, expect } from 'vitest';
import {
  choixTypeAidantFait,
  choixUtilisationFaite,
  demandeDevenirAidantCreee,
  EtatEtapesDemande,
  initialiseReducteur,
  reducteurEtapes,
  retourEtapePrecedente,
  signeCharteAidant,
  TypeAidant,
  TypeAidantEtSonEntite,
} from '../../../../src/domaine/gestion-demandes/parcours-aidant/reducteurEtapes';
import { fakerFR } from '@faker-js/faker';
import { Constructeur } from '../../../constructeurs/Constructeur';

class ConstructeurChoixTypeAidant
  implements Constructeur<TypeAidantEtSonEntite>
{
  private typeAidant: TypeAidant = 'AgentPublic';
  private siret = '1234567890';
  private commune: string = fakerFR.location.city();
  private nomEntreprise: string = fakerFR.company.name();
  private departement: string = fakerFR.location.zipCode();

  representantEtat(): ConstructeurChoixTypeAidant {
    this.typeAidant = 'RepresentantEtat';
    return this;
  }

  mairieBordeaux(): ConstructeurChoixTypeAidant {
    this.nomEntreprise = 'COMMUNE DE BORDEAUX';
    this.commune = 'BORDEAUX';
    this.siret = '21330063500017';
    this.departement = '33';
    return this;
  }

  agentPublic(): ConstructeurChoixTypeAidant {
    this.typeAidant = 'AgentPublic';
    return this;
  }

  construis(): TypeAidantEtSonEntite {
    return {
      typeAidant: this.typeAidant,
      entite: {
        siret: this.siret,
        commune: this.commune,
        nom: this.nomEntreprise,
        departement: this.departement,
      },
    };
  }
}

const unChoixTypeAidant = () => new ConstructeurChoixTypeAidant();

describe('Reducteur d’étapes pour le parcours Aidant', () => {
  describe('Choix utilisation', () => {
    it('Oeuvre pour l’intérêt général', () => {
      const etat = reducteurEtapes(
        initialiseReducteur(),
        choixUtilisationFaite('InteretGeneral')
      );

      expect(etat).toStrictEqual({
        etapeCourante: 'choixTypeAidant',
        demande: undefined,
      });
    });

    it('Oeuvre pour sa propre structure', () => {
      const etat = reducteurEtapes(
        initialiseReducteur(),
        choixUtilisationFaite('ActiviteProfessionnelle')
      );

      expect(etat).toStrictEqual({
        etapeCourante: 'signatureCGUs',
        demande: undefined,
      });
    });
  });

  describe("Choix du type d'Aidant", () => {
    it("Pour un représentant de l'Etat pour la Mairie de BORDEAUX", () => {
      const typeAidant = unChoixTypeAidant()
        .representantEtat()
        .mairieBordeaux()
        .construis();

      const etat = reducteurEtapes(
        initialiseReducteur(),
        choixTypeAidantFait(typeAidant)
      );

      expect(etat).toStrictEqual({
        etapeCourante: 'signatureCharteAidant',
        demande: {
          type: typeAidant,
        },
      });
    });

    it('Pour un Agent public à la mairie de BORDEAUX', () => {
      const typeAidant = unChoixTypeAidant()
        .agentPublic()
        .mairieBordeaux()
        .construis();
      const etat = reducteurEtapes(
        initialiseReducteur(),
        choixTypeAidantFait(typeAidant)
      );

      expect(etat).toStrictEqual({
        etapeCourante: 'signatureCharteAidant',
        demande: {
          type: typeAidant,
        },
      });
    });

    it('Revenir sur son choix', () => {
      const etat = reducteurEtapes(
        { etapeCourante: 'choixTypeAidant', demande: undefined },
        retourEtapePrecedente()
      );

      expect(etat).toStrictEqual({
        etapeCourante: 'choixUtilisation',
        demande: undefined,
      });
    });
  });

  describe('Signature de la charte Aidant', () => {
    it("Passe à l'étape suivante", () => {
      const etat = reducteurEtapes(
        {
          etapeCourante: 'signatureCharteAidant',
          demande: {
            type: {
              typeAidant: 'FuturAdherent',
            },
          },
        },
        signeCharteAidant()
      );

      expect(etat).toStrictEqual<EtatEtapesDemande>({
        etapeCourante: 'formulaireDevenirAidant',
        demande: {
          type: {
            typeAidant: 'FuturAdherent',
          },
          signatureCharte: true,
        },
      });
    });

    it('Revenir sur la sélection du type Aidant', () => {
      const etat = reducteurEtapes(
        { etapeCourante: 'signatureCharteAidant', demande: undefined },
        retourEtapePrecedente()
      );

      expect(etat).toStrictEqual({
        etapeCourante: 'choixTypeAidant',
        demande: undefined,
      });
    });
  });

  describe('Demande devenir Aidant créée', () => {
    it("Passe à l'étape suivante", () => {
      const etat = reducteurEtapes(
        {
          etapeCourante: 'formulaireDevenirAidant',
          demande: {
            type: {
              typeAidant: 'FuturAdherent',
            },
            signatureCharte: true,
          },
        },
        demandeDevenirAidantCreee()
      );

      expect(etat).toStrictEqual<EtatEtapesDemande>({
        etapeCourante: 'confirmationDemandeDevenirAidantPriseEnCompte',
        demande: {
          type: {
            typeAidant: 'FuturAdherent',
          },
          signatureCharte: true,
        },
      });
    });
  });
});
