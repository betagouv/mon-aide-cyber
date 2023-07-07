import * as path from "path";
import express, { Request, Response } from "express";
import * as http from "http";
import rateLimit from "express-rate-limit";
import routesAPI from "./api/routesAPI";
import { AdaptateurReferentiel } from "./adaptateurs/AdaptateurReferentiel";
import { AdaptateurTranscripteur } from "./adaptateurs/AdaptateurTranscripteur";
import { Entrepots } from "./domaine/Entrepots";
import { gestionnaireErreurAggregatNonTrouve } from "./api/gestionnaires/erreurs";

export type ConfigurationServeur = {
  adaptateurReferentiel: AdaptateurReferentiel;
  adaptateurTranscripteurDonnees: AdaptateurTranscripteur;
  entrepots: Entrepots;
};

const creeServeur = (config: ConfigurationServeur) => {
  let serveur: http.Server;

  const app = express();

  const limiteurTrafficUI = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message:
      "Vous avez atteint le nombre maximal de requête. Veuillez réessayer ultérieurement.",
    standardHeaders: true,
    legacyHeaders: false,
    skip: (requete: Request, _) => requete.path.startsWith("/api"),
  });
  app.use(limiteurTrafficUI);
  app.use(
    express.static(path.join(__dirname, "./../../mon-aide-cyber-ui/dist")),
  );
  const ecoute = (port: number, succes: () => void) => {
    serveur = app.listen(port, succes);
  };
  const arreteEcoute = () => {
    serveur.close();
  };

  app.use("/api", routesAPI(config));

  app.get("*", (_: Request, reponse: Response) =>
    reponse.sendFile(
      path.join(__dirname, "./../../mon-aide-cyber-ui/dist/index.html"),
    ),
  );

  app.use(gestionnaireErreurAggregatNonTrouve);

  return { ecoute, arreteEcoute };
};

export default { creeServeur };
