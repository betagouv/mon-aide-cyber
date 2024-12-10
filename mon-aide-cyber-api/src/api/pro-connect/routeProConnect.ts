import express, { NextFunction, Request, Response } from 'express';
import { ConfigurationServeur } from '../../serveur';

export const routesProConnect = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const { adaptateurProConnect } = configuration;

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

  // routes.get('/apres-authentification', async (requete, reponse) => {
  //   if (!requete.cookies.AgentConnectInfo) {
  //     reponse.status(401).send("Erreur d'authentification");
  //     return;
  //   }
  //   try {
  //     const { idToken, accessToken } =
  //       await adaptateurOidc.recupereJeton(requete);
  //     const { urlRedirection } = requete.cookies.AgentConnectInfo;
  //
  //     reponse.clearCookie('AgentConnectInfo');
  //
  //     const { nom, prenom, email, siret } =
  //       await adaptateurOidc.recupereInformationsUtilisateur(accessToken);
  //     const infosUtilisateur = { nom, prenom, email, siret };
  //     const utilisateurExistant =
  //       await depotDonnees.utilisateurAvecEmail(email);
  //
  //     if (!utilisateurExistant) {
  //       const token = adaptateurJWT.signeDonnees(infosUtilisateur);
  //       reponse.redirect(`/creation-compte?token=${token}`);
  //       return;
  //     }
  //
  //     requete.session.AgentConnectIdToken = idToken;
  //     requete.session.token = utilisateurExistant.genereToken(
  //       SourceAuthentification.AGENT_CONNECT
  //     );
  //     if (!utilisateurExistant.aLesInformationsAgentConnect()) {
  //       await depotDonnees.metsAJourUtilisateur(utilisateurExistant.id, {
  //         nom,
  //         prenom,
  //         entite: { siret },
  //       });
  //     }
  //     await depotDonnees.enregistreNouvelleConnexionUtilisateur(
  //       utilisateurExistant.id,
  //       SourceAuthentification.AGENT_CONNECT
  //     );
  //
  //     const tokenDonneesInvite = utilisateurExistant.estUnInvite()
  //       ? adaptateurJWT.signeDonnees({ ...infosUtilisateur, invite: true })
  //       : undefined;
  //
  //     reponse.render('apresAuthentification', {
  //       ...(urlRedirection && {
  //         urlRedirection:
  //           adaptateurEnvironnement.mss().urlBase() + urlRedirection,
  //       }),
  //       tokenDonneesInvite,
  //     });
  //   } catch (e) {
  //     fabriqueAdaptateurGestionErreur().logueErreur(e);
  //     reponse.status(401).send("Erreur d'authentification");
  //   }
  // });
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
