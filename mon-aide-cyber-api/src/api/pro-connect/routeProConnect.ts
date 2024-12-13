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
    recuperateurDeCookies,
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

      const redirige = (
        idToken: string | undefined,
        identifiant: crypto.UUID
      ) => {
        requete.session!.ProConnectIdToken = idToken;
        const jeton = gestionnaireDeJeton.genereJeton({
          identifiant: identifiant,
        });
        requete.session!.token = jeton;
        return reponse.redirect('/aidant/tableau-de-bord');
      };

      try {
        const { idToken, accessToken } =
          await adaptateurProConnect.recupereJeton(
            requete,
            JSON.parse(decodeURIComponent(cookie).substring(2))
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
          return redirige(idToken, aidant.identifiant);
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
            motDePasse: '',
            type: 'CommandeCreeEspaceAidant',
            departement: {
              nom: 'Gironde',
              code: '33',
              codeRegion: '75',
            },
            ...(siret && { siret: siret }),
          });
          return redirige(idToken, compte.identifiant);
        }
        return reponse.status(401).json({
          message: 'Vous n’avez pas de compte enregistré sur MonAideCyber',
          liens: {},
        });
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
