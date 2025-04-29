import { ConfigurationServeur } from '../../serveur';
import express, { NextFunction, Request, Response } from 'express';
import { ErreurMAC } from '../../domaine/erreurMAC';
import { ReponseRequeteHTTPEnErreur } from '../../infrastructure/adaptateurs/adaptateurDeRequeteHTTP';
import {
  adaptateurRechercheEntreprise,
  Entreprise,
} from '../../infrastructure/adaptateurs/adaptateurRechercheEntreprise';

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

type RechercheEntreprise = Omit<Entreprise, 'typeEntite'>;
export type ReponseRechercheEntreprise = RechercheEntreprise[];

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
      try {
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
        const entreprises: ReponseRechercheEntreprise = (
          await adaptateurRechercheEntreprise(
            adaptateurDeRequeteHTTP
          ).rechercheEntreprise(nomEntreprise, parametresRecherche)
        ).map((entreprise) => {
          const { typeEntite, ...rechercheEntreprise } = entreprise;
          return rechercheEntreprise;
        });
        return reponse.status(200).json(entreprises);
      } catch (erreur: unknown | ReponseRequeteHTTPEnErreur) {
        return suite(
          ErreurMAC.cree(
            'Exécution requête HTTP',
            new ErreurRequeteHTTP(
              erreur as ReponseRequeteHTTPEnErreur,
              'API recherche entreprise'
            )
          )
        );
      }
    }
  );

  return routes;
};
