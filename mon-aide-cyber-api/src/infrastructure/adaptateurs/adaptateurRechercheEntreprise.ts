import { AdaptateurDeRequeteHTTP } from './adaptateurDeRequeteHTTP';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { associationsNonReferencees } from '../../api/recherche-entreprise/associationsNonReferencees';
import {
  associations,
  EntitesAssociations,
  EntitesEntreprisesPrivees,
  EntitesOrganisationsPubliques,
  entitesPrivees,
  entitesPubliques,
} from '../../espace-aidant/Aidant';

export type Entreprise = {
  siret: string;
  nom: string;
  departement: string;
  commune: string;
  typeEntite:
    | EntitesAssociations
    | EntitesEntreprisesPrivees
    | EntitesOrganisationsPubliques;
};
type APIEntreprise = {
  nom_complet: string;
  siege: { siret: string; departement: string; libelle_commune: string };
  complements: { est_association: boolean; est_service_public: boolean };
};
type ReponseAPIRechercheEntreprise = {
  results: APIEntreprise[];
};

class AdaptateurRechercheEntreprise {
  constructor(
    private readonly adaptateurDeRequeteHTTP: AdaptateurDeRequeteHTTP
  ) {}

  async rechercheEntreprise(
    nomOuSiretEntreprise: string,
    parametresRecherche: string
  ): Promise<Entreprise[]> {
    const reponseAPI =
      await this.adaptateurDeRequeteHTTP.execute<ReponseAPIRechercheEntreprise>(
        {
          url: `${adaptateurEnvironnement.apiRechercheEntreprise().url()}/search?q=${encodeURIComponent(nomOuSiretEntreprise)}${parametresRecherche}&per_page=25&limite_matching_etablissements=1`,
          headers: { Accept: 'application/json' },
          methode: 'GET',
        }
      );
    const entreprises: Entreprise[] = reponseAPI.results.map((res) => {
      let typeEntite:
        | EntitesAssociations
        | EntitesEntreprisesPrivees
        | EntitesOrganisationsPubliques = entitesPrivees;
      if (res.complements.est_association) {
        typeEntite = associations;
      }
      if (res.complements.est_service_public) {
        typeEntite = entitesPubliques;
      }

      return {
        nom: res.nom_complet,
        siret: res.siege.siret,
        commune: res.siege.libelle_commune,
        departement: res.siege.departement,
        typeEntite
      };
    });
    const associationsTrouvees: Entreprise[] = parametresRecherche.includes(
      'est_association=true'
    )
      ? associationsNonReferencees
          .filter((asso) =>
            asso.nom
              .toLowerCase()
              .normalize('NFD')
              .replace(/\p{Diacritic}/gu, '')
              .includes(
                nomOuSiretEntreprise
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/\p{Diacritic}/gu, '')
              )
          )
          .map((asso) => ({
            nom: asso.nom,
            siret: asso.siret,
            commune: asso.commune,
            departement: asso.departement,
            typeEntite: associations,
          }))
      : [];
    return [...entreprises, ...associationsTrouvees];
  }
}

export const adaptateurRechercheEntreprise = (
  adaptateurDeRequeteHTTP: AdaptateurDeRequeteHTTP
): AdaptateurRechercheEntreprise => {
  return new AdaptateurRechercheEntreprise(adaptateurDeRequeteHTTP);
};
