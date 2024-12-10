import express, { NextFunction, Request, Response } from 'express';
import { ConfigurationServeur } from '../../serveur';
import { ReponseHATEOASEnErreur } from '../hateoas/hateoas';
import { ErreurMAC } from '../../domaine/erreurMAC';

export class ErreurProConnectApresAuthentification extends Error {
  constructor(e: Error) {
    super(e.message);
  }
}

export const routesProConnect = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const {
    adaptateurProConnect,
    entrepots,
    gestionnaireDeJeton,
    recuperateurDeCookies,
  } = configuration;

  routes.get(
    '/connexion',
    // adaptateurDeGestionDeCookies.supprime,
    async (_requete: Request, reponse: Response, suite: NextFunction) => {
      try {
        const { url, state, nonce } =
          await adaptateurProConnect.genereDemandeAutorisation();

        reponse.cookie(
          'ProConnectInfo',
          { state, nonce },
          {
            maxAge: 120_000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          }
        );
        reponse.redirect(url.toString());
      } catch (e) {
        suite(e);
      }
    }
  );

  routes.get(
    '/apres-authentification',
    async (
      requete: Request,
      reponse: Response<ReponseHATEOASEnErreur>,
      suite: NextFunction
    ) => {
      const cookie = recuperateurDeCookies(requete, reponse, {
        nom: 'ProConnectInfo',
      });
      if (!cookie) {
        return reponse
          .status(401)
          .json({ message: 'Erreur d’authentification', liens: {} });
      }
      try {
        const { idToken, accessToken } =
          await adaptateurProConnect.recupereJeton(
            requete,
            JSON.parse(decodeURIComponent(cookie).substring(2))
          );

        reponse.clearCookie('ProConnectInfo');

        const { email } =
          await adaptateurProConnect.recupereInformationsUtilisateur(
            accessToken!
          );
        return entrepots
          .aidants()
          .rechercheParEmail(email!)
          .then((aidant) => {
            requete.session!.ProConnectIdToken = idToken;
            const jeton = gestionnaireDeJeton.genereJeton({
              identifiant: aidant.identifiant,
            });
            requete.session!.token = jeton;
            return reponse.redirect('/aidant/tableau-de-bord');
          })
          .catch(() =>
            reponse.status(401).json({
              message: 'Vous n’avez pas de compte enregistré sur MonAideCyber',
              liens: {},
            })
          );
      } catch (e: unknown | Error) {
        return suite(
          ErreurMAC.cree(
            'Authentification ProConnect',
            new ErreurProConnectApresAuthentification(e as Error)
          )
        );
      }
    }
  );
  //
  // routes.get('/apres-deconnexion', async (requete, reponse) => {
  //   const { state } = requete.cookies.AgentConnectInfo;
  //   if (state !== requete.query.state) {
  //     reponse.sendStatus(401);
  //     return;
  //   }
  //   reponse.clearCookie('AgentConnectInfo');
  //   reponse.redirect('/connexion');
  // });

  return routes;
};
