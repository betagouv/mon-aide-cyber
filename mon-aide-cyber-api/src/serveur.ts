import * as path from 'path';
import express, { Request, Response } from 'express';
import * as http from 'http';
import rateLimit from 'express-rate-limit';
import routesAPI from './api/routesAPI';
import { AdaptateurTranscripteur } from './adaptateurs/AdaptateurTranscripteur';
import { Entrepots } from './domaine/Entrepots';
import { gestionnaireErreurGeneralisee } from './api/gestionnaires/erreurs';
import { Referentiel } from './diagnostic/Referentiel';
import { TableauDeRecommandations } from './diagnostic/TableauDeRecommandations';
import { Adaptateur } from './adaptateurs/Adaptateur';
import { AdaptateurPDF } from './adaptateurs/AdaptateurPDF';
import { BusEvenement } from './domaine/BusEvenement';
import { AdaptateurGestionnaireErreurs } from './adaptateurs/AdaptateurGestionnaireErreurs';
import { NextFunction } from 'express-serve-static-core';

export type ConfigurationServeur = {
  adaptateurPDF: AdaptateurPDF;
  adaptateurReferentiel: Adaptateur<Referentiel>;
  adaptateurTableauDeRecommandations: Adaptateur<TableauDeRecommandations>;
  adaptateurTranscripteurDonnees: AdaptateurTranscripteur;
  entrepots: Entrepots;
  busEvenement: BusEvenement;
  gestionnaireErreurs: AdaptateurGestionnaireErreurs;
};

const creeApp = (config: ConfigurationServeur) => {
  const app = express();

  app.use(config.gestionnaireErreurs.controleurRequete());

  const limiteurTrafficUI = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message:
      'Vous avez atteint le nombre maximal de requête. Veuillez réessayer ultérieurement.',
    standardHeaders: true,
    keyGenerator: (requete: Request, __: Response) =>
      requete.headers['x-real-ip'] as string,
    legacyHeaders: false,
    skip: (requete: Request, __) => requete.path.startsWith('/api'),
  });
  app.use(limiteurTrafficUI);
  app.use((_: Request, reponse: Response, suite: NextFunction) => {
    reponse.setHeader('Content-Security-Policy', process.env.MAC_CSP || '*');
    reponse.setHeader(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    );
    reponse.setHeader('X-Content-Type-Options', 'nosniff');
    suite();
  });
  app.use(
    express.static(path.join(__dirname, './../../mon-aide-cyber-ui/dist')),
  );
  app.use('/api', routesAPI(config));

  app.get('*', (_: Request, reponse: Response) =>
    reponse.sendFile(
      path.join(__dirname, './../../mon-aide-cyber-ui/dist/index.html'),
    ),
  );

  app.use(
    gestionnaireErreurGeneralisee(config.gestionnaireErreurs.consignateur()),
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
