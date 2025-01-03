import { ConfigurationServeur } from '../../serveur';
import express, { NextFunction, Request, Response } from 'express';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { ErreurMAC } from '../../domaine/erreurMAC';
import { ReponseRequeteHTTPEnErreur } from '../../infrastructure/adaptateurs/adaptateurDeRequeteHTTP';

type Entreprise = {
  siret: string;
  nom: string;
  departement: string;
  commune: string;
};
export type ReponseRechercheEntreprise = Entreprise[];

type APIEntreprise = {
  nom_complet: string;
  siege: { siret: string; departement: string; libelle_commune: string };
};
type ReponseAPIRechercheEntreprise = {
  results: APIEntreprise[];
};

type ReponseEnErreur = {
  message: string;
};

export class ErreurRequeteHTTP extends Error {
  public readonly codeErreur?: number;
  constructor(
    erreur: ReponseRequeteHTTPEnErreur,
    public readonly contexte?: string
  ) {
    super(
      Object.entries(erreur.corps)
        .map(([, valeur]) => valeur)
        .join('\n')
    );
    this.codeErreur = erreur.codeErreur;
  }
}

export const routesAPIRechercheEntreprise = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();

  const { adaptateurDeRequeteHTTP } = configuration;

  routes.get(
    '/',
    async (
      requete: Request,
      reponse: Response<ReponseRechercheEntreprise | ReponseEnErreur>,
      suite: NextFunction
    ) => {
      const nomEntreprise: string = requete.query.nom as string;
      const parametresRecherche = Object.entries(requete.query).reduce(
        (precedent, courant) => {
          const parametres = courant as [string, string];
          if (parametres[0] !== 'nom') {
            precedent += `&${parametres[0]}=${parametres[1]}`;
          }
          return precedent;
        },
        ''
      );
      return adaptateurDeRequeteHTTP
        .execute<ReponseAPIRechercheEntreprise>({
          url: `${adaptateurEnvironnement.apiRechercheEntreprise().url()}/search?q=${encodeURIComponent(nomEntreprise)}${parametresRecherche}&per_page=25&limite_matching_etablissements=1`,
          headers: { Accept: 'application/json' },
          methode: 'GET',
        })
        .then(async (reponseAPI) =>
          reponse.status(200).json(
            reponseAPI.results.map((res) => ({
              nom: res.nom_complet,
              siret: res.siege.siret,
              commune: res.siege.libelle_commune,
              departement: res.siege.departement,
            }))
          )
        )
        .catch((erreur) => {
          return suite(
            ErreurMAC.cree(
              'Exécution requête HTTP',
              new ErreurRequeteHTTP(erreur, 'API recherche entreprise')
            )
          );
        });
    }
  );

  return routes;
};
