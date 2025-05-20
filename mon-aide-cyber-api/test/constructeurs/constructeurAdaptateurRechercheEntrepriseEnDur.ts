import { AdaptateurRechercheEntreprise } from '../../src/infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import { Constructeur } from './constructeur';
import { entitesPrivees } from '../../src/espace-aidant/Aidant';

class ConstructeurAdaptateurRechercheEntrepriseEnDur
  implements Constructeur<AdaptateurRechercheEntreprise>
{
  private readonly siret = '12345678912345';
  private readonly nom = 'Une entreprise';
  private readonly departement = '33';
  private readonly commune = 'Bordeaux';
  private readonly typeEntite = entitesPrivees;
  private readonly secteursActivite = [];

  construis(): AdaptateurRechercheEntreprise {
    return {
      rechercheEntreprise: async (
        __nomOuSiretEntreprise: string,
        __parametresRecherche: string
      ) => [
        {
          siret: this.siret,
          nom: this.nom,
          departement: this.departement,
          commune: this.commune,
          typeEntite: this.typeEntite,
          secteursActivite: this.secteursActivite,
        },
      ],
      rechercheParSiret: async (__siret: string) => ({
        siret: this.siret,
        nom: this.nom,
        departement: this.departement,
        commune: this.commune,
        typeEntite: this.typeEntite,
        secteursActivite: this.secteursActivite,
      }),
    };
  }
}

export const unAdaptateurRechercheEntreprise = () =>
  new ConstructeurAdaptateurRechercheEntrepriseEnDur();
