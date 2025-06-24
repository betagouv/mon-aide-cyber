import { describe, expect, it } from 'vitest';
import { Constructeur } from '../../../constructeurs/Constructeur';
import { InformationsTypeAidant } from '../../../../src/domaine/parcours-utilisation-service/parcours-mon-espace-demande-devenir-aidant/ecran-mon-espace-demande-devenir-aidant/EcranMonEspaceDemandeDevenirAidant';
import { fakerFR } from '@faker-js/faker';
import { TypeAidant } from '../../../../src/domaine/gestion-demandes/devenir-aidant/DevenirAidant';
import {
  choixTypeAidantFait,
  EtatInformationsAidant,
  initialiseReducteurInformationsAidant,
  reducteurInformationsAidant,
  valideLaCharteAidant,
  videLesInformationsDuTypeAidant,
} from '../../../../src/domaine/parcours-utilisation-service/parcours-mon-espace-demande-devenir-aidant/ecran-mon-espace-demande-devenir-aidant/reducteurInformationsAidant';

class ConstructeurChoixTypeAidant
  implements Constructeur<InformationsTypeAidant>
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

  construis(): InformationsTypeAidant {
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

describe("Réducteur des informations de l'Aidant", () => {
  describe("Choix du type d'Aidant", () => {
    it("pour un représentant de l'Etat pour la Mairie de BORDEAUX", () => {
      const informationsTypeAidant = unChoixTypeAidant()
        .representantEtat()
        .mairieBordeaux()
        .construis();

      const etat = reducteurInformationsAidant(
        initialiseReducteurInformationsAidant(),
        choixTypeAidantFait(informationsTypeAidant)
      );

      expect(etat).toStrictEqual<EtatInformationsAidant>({
        informations: {
          typeAidant: informationsTypeAidant.typeAidant,
          entite: informationsTypeAidant.entite,
          charteValidee: false,
        },
      });
    });

    it('Pour un Agent public à la mairie de BORDEAUX', () => {
      const informationsTypeAidant = unChoixTypeAidant()
        .agentPublic()
        .mairieBordeaux()
        .construis();

      const etat = reducteurInformationsAidant(
        initialiseReducteurInformationsAidant(),
        choixTypeAidantFait(informationsTypeAidant)
      );

      expect(etat).toStrictEqual<EtatInformationsAidant>({
        informations: {
          typeAidant: informationsTypeAidant.typeAidant,
          entite: informationsTypeAidant.entite,
          charteValidee: false,
        },
      });
    });

    it('Vide les données', () => {
      const informationsTypeAidant = unChoixTypeAidant()
        .agentPublic()
        .mairieBordeaux()
        .construis();
      const etatParDefautDuReducteur: EtatInformationsAidant = {
        informations: {
          ...informationsTypeAidant,
          charteValidee: false,
        },
      };

      const etat = reducteurInformationsAidant(
        etatParDefautDuReducteur,
        videLesInformationsDuTypeAidant()
      );

      expect(etat).toStrictEqual<EtatInformationsAidant>({
        informations: {
          typeAidant: undefined,
          entite: undefined,
          charteValidee: false,
        },
      });
    });
  });

  describe("Signature de la charte de l'Aidant cyber", () => {
    it("L'enregistre", () => {
      const informationsTypeAidant = unChoixTypeAidant()
        .agentPublic()
        .mairieBordeaux()
        .construis();
      const etatParDefautDuReducteur: EtatInformationsAidant = {
        informations: {
          ...informationsTypeAidant,
          charteValidee: false,
        },
      };

      const etat = reducteurInformationsAidant(
        etatParDefautDuReducteur,
        valideLaCharteAidant()
      );

      expect(etat).toStrictEqual<EtatInformationsAidant>({
        informations: {
          typeAidant: informationsTypeAidant.typeAidant,
          entite: informationsTypeAidant.entite,
          charteValidee: true,
        },
      });
    });
  });
});
