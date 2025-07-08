import * as path from 'path';
import * as fs from 'fs';
import express, { Request, RequestHandler, Response } from 'express';
import * as http from 'http';
import routesAPI from './api/routesAPI';
import { AdaptateurTranscripteur } from './adaptateurs/AdaptateurTranscripteur';
import { Entrepots } from './domaine/Entrepots';
import { gestionnaireErreurGeneralisee } from './api/gestionnaires/erreurs';
import { Referentiel } from './diagnostic/Referentiel';
import { Adaptateur } from './adaptateurs/Adaptateur';
import { BusEvenement } from './domaine/BusEvenement';
import { AdaptateurGestionnaireErreurs } from './adaptateurs/AdaptateurGestionnaireErreurs';
import { NextFunction } from 'express-serve-static-core';
import { GestionnaireDeJeton } from './authentification/GestionnaireDeJeton';
import { csrf } from 'lusca';
import { AdaptateurDeVerificationDeSession } from './adaptateurs/AdaptateurDeVerificationDeSession';
import { AdaptateursRestitution } from './adaptateurs/AdaptateursRestitution';
import { BusCommande } from './domaine/commande';
import { routeContact } from './api/routeContact';
import { AdaptateurEnvoiMail } from './adaptateurs/AdaptateurEnvoiMail';
import { ReferentielDeMesures } from './diagnostic/ReferentielDeMesures';
import { AdaptateurDeVerificationDeCGU } from './adaptateurs/AdaptateurDeVerificationDeCGU';
import { AdaptateurDeGestionDeCookies } from './adaptateurs/AdaptateurDeGestionDeCookies';
import { AdaptateurRelations } from './relation/AdaptateurRelations';
import CookieSession from 'cookie-session';
import { AdaptateurDeVerificationDesAcces } from './adaptateurs/AdaptateurDeVerificationDesAcces';
import { ServiceDeChiffrement } from './securite/ServiceDeChiffrement';
import { AdaptateurMetabase } from './adaptateurs/AdaptateurMetabase';
import { adaptateurConfigurationLimiteurTraffic } from './api/adaptateurLimiteurTraffic';
import { AdaptateurDeVerificationDeTypeDeRelation } from './adaptateurs/AdaptateurDeVerificationDeTypeDeRelation';
import { AdaptateurProConnect } from './adaptateurs/pro-connect/adaptateurProConnect';
import { routesProConnect } from './api/pro-connect/routeProConnect';
import { AdaptateurDeVerificationDeDemande } from './adaptateurs/AdaptateurDeVerificationDeDemande';
import { AdaptateurAseptisation } from './adaptateurs/AdaptateurAseptisation';
import { RepertoireDeContacts } from './contacts/RepertoireDeContacts';
import { positionneLesCsp } from './infrastructure/securite/Http';
import { adaptateurEnvironnement } from './adaptateurs/adaptateurEnvironnement';
import { filtreIp } from './infrastructure/securite/Reseau';
import { AdaptateurRechercheEntreprise } from './infrastructure/adaptateurs/adaptateurRechercheEntreprise';

import { AdaptateurCmsCrispMAC } from './adaptateurs/AdaptateurCmsCrispMAC';
import { interdisLaMiseEnCache } from './infrastructure/middlewares/middlewares';

import { AdaptateurSignatureRequete } from './adaptateurs/AdaptateurSignatureRequete';
import { AdaptateurValidateurCoherence } from './adaptateurs/AdaptateurValidateurCoherence';

const ENDPOINTS_SANS_CSRF = ['/api/token'];

const COOKIE_DUREE_SESSION = 180 * 60 * 1000;

export type ConfigurationServeur = {
  redirigeVersUrlBase: RequestHandler;
  adaptateurRelations: AdaptateurRelations;
  adaptateurEnvoiMessage: AdaptateurEnvoiMail;
  adaptateurReferentiel: Adaptateur<Referentiel>;
  adaptateursRestitution: AdaptateursRestitution;
  adaptateurMesures: Adaptateur<ReferentielDeMesures>;
  adaptateurTranscripteurDonnees: AdaptateurTranscripteur;
  adaptateurDeGestionDeCookies: AdaptateurDeGestionDeCookies;
  adaptateurAseptisation: AdaptateurAseptisation;
  adaptateurDeVerificationDeCGU: AdaptateurDeVerificationDeCGU;
  adaptateurDeVerificationDeDemande: AdaptateurDeVerificationDeDemande;
  adaptateurDeVerificationDeSession: AdaptateurDeVerificationDeSession;
  adaptateurDeVerificationDesAcces: AdaptateurDeVerificationDesAcces;
  adaptateurDeVerificationDeRelations: AdaptateurDeVerificationDeTypeDeRelation;
  repertoireDeContacts: RepertoireDeContacts;
  adaptateurProConnect: AdaptateurProConnect;
  serviceDeChiffrement: ServiceDeChiffrement;
  avecProtectionCsrf: boolean;
  busCommande: BusCommande;
  busEvenement: BusEvenement;
  entrepots: Entrepots;
  gestionnaireDeJeton: GestionnaireDeJeton;
  gestionnaireErreurs: AdaptateurGestionnaireErreurs;
  adaptateurMetabase: AdaptateurMetabase;
  adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  adaptateurCmsCrisp: AdaptateurCmsCrispMAC;
  adaptateurSignatureRequete: AdaptateurSignatureRequete;
  adaptateurValidateurCoherence: AdaptateurValidateurCoherence;
  estEnMaintenance: boolean;
};

const creeApp = (config: ConfigurationServeur) => {
  const app = express();

  config.gestionnaireErreurs.initialise(app);
  app.set('trust proxy', adaptateurEnvironnement.reseauTrustProxy());

  const ipAutorisees = adaptateurEnvironnement.ipAutorisees();
  if (ipAutorisees) app.use(filtreIp(ipAutorisees));

  app.use(
    CookieSession({
      sameSite: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_DUREE_SESSION,
      keys: [process.env.SECRET_COOKIE || ''],
    })
  );

  app.disable('x-powered-by');

  if (config.avecProtectionCsrf)
    app.use(csrf({ blocklist: ENDPOINTS_SANS_CSRF }));

  app.use(config.gestionnaireErreurs.controleurRequete());

  app.use(config.redirigeVersUrlBase);

  const limiteurTrafficUI = adaptateurConfigurationLimiteurTraffic('STANDARD');
  app.use(limiteurTrafficUI);

  if (config.estEnMaintenance) {
    app.use((_: Request, reponse: Response) =>
      reponse.sendFile(path.join(__dirname, './maintenance/maintenance.html'))
    );
  }

  app.use((_: Request, reponse: Response, suite: NextFunction) => {
    positionneLesCsp(reponse, adaptateurEnvironnement.http().csp());
    reponse.setHeader(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
    reponse.setHeader('X-Content-Type-Options', 'nosniff');
    suite();
  });

  app.get('/', (_: Request, reponse: Response) =>
    envoieIndexAvecNonce(reponse)
  );

  app.use(
    express.static(path.join(__dirname, './../../mon-aide-cyber-ui/dist'))
  );

  app.use(interdisLaMiseEnCache());

  app.use('/api', routesAPI(config));
  app.use('/pro-connect', routesProConnect(config));
  app.use('/contact', routeContact(config));

  app.get('*', (_: Request, reponse: Response) =>
    envoieIndexAvecNonce(reponse)
  );

  app.use(
    gestionnaireErreurGeneralisee(config.gestionnaireErreurs.consignateur())
  );
  app.use(config.gestionnaireErreurs.controleurErreurs());

  return app;
};

const lisLeFichierIndex = () => {
  const cheminIndex = path.join(
    __dirname,
    './../../mon-aide-cyber-ui/dist/index.html'
  );
  return fs.readFileSync(cheminIndex, 'utf8');
};

const envoieIndexAvecNonce = (reponse: Response) => {
  const indexAvecLeNonce = lisLeFichierIndex().replace(
    '%%NONCE%%',
    reponse.locals['nonce']
  );

  reponse.setHeader('Content-Type', 'text/html').send(indexAvecLeNonce);
};

const creeServeur = (config: ConfigurationServeur) => {
  let serveur: http.Server;

  const app = creeApp(config);

  const ecoute = (port: number, succes: () => void) => {
    serveur = app.listen(port, succes);
  };
  const arreteEcoute = () => {
    serveur.close();
  };

  return { app, ecoute, arreteEcoute };
};

export default { creeServeur };
