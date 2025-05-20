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
import { SecteurActivite } from '../../espace-aidant/preferences/secteursActivite';
import {
  equivalenceSecteursActivite,
  LettreSecteur,
} from '../../api/recherche-entreprise/equivalenceSecteursActivite';

export type Entreprise = {
  siret: string;
  nom: string;
  departement: string;
  commune: string;
  typeEntite:
    | EntitesAssociations
    | EntitesEntreprisesPrivees
    | EntitesOrganisationsPubliques;
  secteursActivite: SecteurActivite[];
};
type APIEntreprise = {
  nom_complet: string;
  siege: { siret: string; departement: string; libelle_commune: string };
  complements: { est_association: boolean; est_service_public: boolean };
  section_activite_principale: LettreSecteur;
};
type ReponseAPIRechercheEntreprise = {
  results: APIEntreprise[];
};

export interface AdaptateurRechercheEntreprise {
  rechercheEntreprise(
    nomOuSiretEntreprise: string,
    parametresRecherche: string
  ): Promise<Entreprise[]>;

  rechercheParSiret(siret: string): Promise<Entreprise | undefined>;
}

class AdaptateurRechercheEntrepriseHTTP
  implements AdaptateurRechercheEntreprise
{
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

      const secteursActivite = equivalenceSecteursActivite
        .filter((eq) => eq.lettreSecteur === res.section_activite_principale)
        .flatMap((eq) => eq.secteursMAC);

      return {
        nom: res.nom_complet,
        siret: res.siege.siret,
        commune: res.siege.libelle_commune,
        departement: res.siege.departement,
        typeEntite,
        secteursActivite,
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
            secteursActivite: [],
          }))
      : [];
    return [...entreprises, ...associationsTrouvees];
  }

  async rechercheParSiret(siret: string): Promise<Entreprise | undefined> {
    const entreprises = await this.rechercheEntreprise(siret, '');
    return entreprises.length === 0 ? undefined : entreprises[0];
  }
}

export const adaptateurRechercheEntreprise = (
  adaptateurDeRequeteHTTP: AdaptateurDeRequeteHTTP
): AdaptateurRechercheEntreprise => {
  return new AdaptateurRechercheEntrepriseHTTP(adaptateurDeRequeteHTTP);
};
