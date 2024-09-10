import * as path from 'path';
import express, { Request, Response } from 'express';
import * as http from 'http';
import rateLimit from 'express-rate-limit';
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

const ENDPOINTS_SANS_CSRF = ['/api/token'];

const COOKIE_DUREE_SESSION = 180 * 60 * 1000;

export type ConfigurationServeur = {
  adaptateurRelations: AdaptateurRelations;
  adaptateurEnvoiMessage: AdaptateurEnvoiMail;
  adaptateurReferentiel: Adaptateur<Referentiel>;
  adaptateursRestitution: AdaptateursRestitution;
  adaptateurMesures: Adaptateur<ReferentielDeMesures>;
  adaptateurTranscripteurDonnees: AdaptateurTranscripteur;
  adaptateurDeGestionDeCookies: AdaptateurDeGestionDeCookies;
  adaptateurDeVerificationDeCGU: AdaptateurDeVerificationDeCGU;
  adaptateurDeVerificationDeSession: AdaptateurDeVerificationDeSession;
  adaptateurDeVerificationDeRelations: AdaptateurDeVerificationDesAcces;
  serviceDeChiffrement: ServiceDeChiffrement;
  avecProtectionCsrf: boolean;
  busCommande: BusCommande;
  busEvenement: BusEvenement;
  entrepots: Entrepots;
  gestionnaireDeJeton: GestionnaireDeJeton;
  gestionnaireErreurs: AdaptateurGestionnaireErreurs;
};
const creeApp = (config: ConfigurationServeur) => {
  const app = express();
  config.gestionnaireErreurs.initialise(app);
  app.set('trust proxy', 1);
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

  const dureePeriodeConnexionMs =
    Number(process.env.MAC_LIMITEUR_TRAFFIC_DUREE_PERIODE_CONNEXIONS_MS) ||
    5 * 60 * 1000;
  const nombreMaximumDeConnexions =
    Number(
      process.env.MAC_LIMITEUR_TRAFFIC_NOMBRE_CONNEXIONS_MAXIMUM_PAR_PERIODE
    ) || 100;
  const limiteurTrafficUI = rateLimit({
    windowMs: dureePeriodeConnexionMs,
    max: nombreMaximumDeConnexions,
    message:
      'Vous avez atteint le nombre maximal de requête. Veuillez réessayer ultérieurement.',
    standardHeaders: true,
    keyGenerator: (requete: Request, __: Response) =>
      requete.headers['x-real-ip'] as string,
    legacyHeaders: false,
    skip: (requete: Request, __) =>
      ['/assets/', '/fontes/', '/images/'].some((req) =>
        requete.path.startsWith(req)
      ),
  });
  app.use(limiteurTrafficUI);
  app.use((_: Request, reponse: Response, suite: NextFunction) => {
    reponse.setHeader('Content-Security-Policy', process.env.MAC_CSP || '*');
    reponse.setHeader(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
    reponse.setHeader('X-Content-Type-Options', 'nosniff');
    suite();
  });
  app.use(
    express.static(path.join(__dirname, './../../mon-aide-cyber-ui/dist'))
  );
  app.use('/api', routesAPI(config));

  app.use('/contact', routeContact(config));

  app.get('*', (_: Request, reponse: Response) =>
    reponse.sendFile(
      path.join(__dirname, './../../mon-aide-cyber-ui/dist/index.html')
    )
  );

  app.use(
    gestionnaireErreurGeneralisee(config.gestionnaireErreurs.consignateur())
  );
  app.use(config.gestionnaireErreurs.controleurErreurs());

  return app;
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
