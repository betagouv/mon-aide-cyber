import express, { NextFunction, Request, Response } from 'express';
import { ConfigurationServeur } from '../../serveur';
import { ReponseHATEOASEnErreur } from '../hateoas/hateoas';
import { ErreurMAC } from '../../domaine/erreurMAC';
import { unServiceAidant } from '../../espace-aidant/ServiceAidantMAC';
import {
  CommandeCreeEspaceAidant,
  EspaceAidantCree,
} from '../../espace-aidant/CapteurCommandeCreeEspaceAidant';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { adaptateurUUID } from '../../infrastructure/adaptateurs/adaptateurUUID';
import crypto from 'crypto';
import { estSiretGendarmerie } from '../../espace-aidant/Aidant';
import {
  MACCookies,
  utilitairesCookies,
} from '../../adaptateurs/utilitairesDeCookies';
import { estDateNouveauParcoursDemandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/nouveauParcours';
import { isAfter } from 'date-fns';
import { dateValiditeCGU } from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';

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
    busCommande,
    gestionnaireDeJeton,
    adaptateurDeGestionDeCookies,
  } = configuration;

  routes.get(
    '/connexion',
    adaptateurDeGestionDeCookies.supprime(),
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

  const extraisCookieProConnect = (cookie: string) =>
    JSON.parse(decodeURIComponent(cookie).substring(2));

  routes.get(
    '/apres-authentification',
    async (
      requete: Request,
      reponse: Response<ReponseHATEOASEnErreur>,
      suite: NextFunction
    ) => {
      const cookie = utilitairesCookies.recuperateurDeCookies(
        requete,
        reponse,
        {
          nom: 'ProConnectInfo',
        }
      );
      if (!cookie) {
        return reponse
          .status(401)
          .json({ message: 'Erreur d’authentification', liens: {} });
      }

      const redirige = (
        idToken: string | undefined,
        identifiant: crypto.UUID,
        urlDeRedirection: string
      ) => {
        requete.session!.ProConnectIdToken = idToken;
        const jeton = gestionnaireDeJeton.genereJeton({
          identifiant: identifiant,
        });
        requete.session!.token = jeton;
        return reponse.redirect(urlDeRedirection);
      };

      try {
        const { idToken, accessToken } =
          await adaptateurProConnect.recupereJeton(
            requete,
            extraisCookieProConnect(cookie)
          );

        reponse.clearCookie('ProConnectInfo');

        const { email, siret, nom, prenom } =
          await adaptateurProConnect.recupereInformationsUtilisateur(
            accessToken!
          );

        const estGendarme = estSiretGendarmerie(siret);

        const aidant = await unServiceAidant(
          entrepots.aidants()
        ).rechercheParMail(email!);

        if (aidant) {
          let redirection = '/mon-espace/tableau-de-bord';
          if (!aidant.dateSignatureCGU) {
            redirection = '/mon-espace/valide-signature-cgu';
          }
          if (
            aidant.dateSignatureCGU &&
            isAfter(dateValiditeCGU(), aidant.dateSignatureCGU) &&
            estDateNouveauParcoursDemandeDevenirAidant()
          ) {
            redirection = '/mon-espace/mon-utilisation-du-service';
          }
          return redirige(idToken, aidant.identifiant, redirection);
        }
        if (estGendarme) {
          const compte = await busCommande.publie<
            CommandeCreeEspaceAidant,
            EspaceAidantCree
          >({
            identifiant: adaptateurUUID.genereUUID(),
            dateSignatureCGU: FournisseurHorloge.maintenant(),
            email: email!,
            nomPrenom: `${prenom} ${nom}`,
            type: 'CommandeCreeEspaceAidant',
            departement: {
              nom: 'Gironde',
              code: '33',
              codeRegion: '75',
            },
            ...(siret && { siret: siret }),
          });
          return redirige(
            idToken,
            compte.identifiant,
            '/mon-espace/valide-signature-cgu'
          );
        }

        return reponse.redirect(
          '/connexion?erreurConnexion=Vous n’avez pas de compte enregistré sur MonAideCyber'
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

  routes.get('/deconnexion', async (requete: Request, reponse: Response) => {
    const valeurCookie = utilitairesCookies.recuperateurDeCookies(
      requete,
      reponse
    );
    if (!valeurCookie) {
      return reponse.status(401).send();
    }
    const cookies: MACCookies = utilitairesCookies.fabriqueDeCookies(
      'Demande de déconnexion',
      requete,
      reponse
    );
    const jwtPayload = utilitairesCookies.jwtPayload(
      cookies,
      gestionnaireDeJeton
    );
    if (!jwtPayload.estProconnect) {
      return reponse.status(401).send();
    }
    const { url, state } = await adaptateurProConnect.genereDemandeDeconnexion(
      requete.session!.ProConnectIdToken
    );

    reponse.cookie(
      'ProConnectInfo',
      { state },
      {
        maxAge: 30_000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      }
    );

    return reponse.redirect(url.toString());
  });

  routes.get(
    '/apres-deconnexion',
    async (requete: Request, reponse: Response) => {
      const cookie = utilitairesCookies.recuperateurDeCookies(
        requete,
        reponse,
        {
          nom: 'ProConnectInfo',
        }
      );
      if (!cookie) {
        return reponse.sendStatus(401);
      }
      const { state } = extraisCookieProConnect(cookie);
      if (state !== requete.query.state) {
        return reponse.sendStatus(401);
      }
      utilitairesCookies.reinitialiseLaSession(requete, reponse);
      reponse.clearCookie('AgentConnectInfo');
      return reponse.redirect('/connexion');
    }
  );

  return routes;
};
