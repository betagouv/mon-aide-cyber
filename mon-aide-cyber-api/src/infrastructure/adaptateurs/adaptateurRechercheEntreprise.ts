import { AdaptateurDeRequeteHTTP } from './adaptateurDeRequeteHTTP';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { associationsNonReferencees } from '../../api/recherche-entreprise/associationsNonReferencees';

export type Entreprise = {
  siret: string;
  nom: string;
  departement: string;
  commune: string;
};
type APIEntreprise = {
  nom_complet: string;
  siege: { siret: string; departement: string; libelle_commune: string };
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
    const entreprises = reponseAPI.results.map((res) => ({
      nom: res.nom_complet,
      siret: res.siege.siret,
      commune: res.siege.libelle_commune,
      departement: res.siege.departement,
    }));
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
