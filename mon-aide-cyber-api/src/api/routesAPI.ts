import express, { Request, Response, Router } from "express";
import { ServiceReferentiel } from "../diagnostique/ServiceReferentiel";
import { Referentiel } from "../diagnostique/referentiel";
import { ConfigurationServeur } from "../serveur";

type ReponsePossibleOT = {
  identifiant: string;
  libelle: string;
  ordre: number;
};

type QuestionChoixUniqueOT = {
  reponsesPossibles: ReponsePossibleOT[];
  identifiant: string;
  libelle: string;
};

type ContexteOT = {
  questions: QuestionChoixUniqueOT[];
};

type ReferentielOT = {
  contexte: ContexteOT;
};
function representeLeReferentielPourLeClient(
  referentiel: Referentiel,
): ReferentielOT {
  return {
    contexte: {
      questions: referentiel.contexte.questions.map((question) => ({
        ...question,
        reponsesPossibles: question.reponsesPossibles.map((reponse) => ({
          ...reponse,
        })),
      })),
    },
  };
}

const routesAPI = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.get("/diagnostiques/:id", (_req: Request, res: Response) => {
    new ServiceReferentiel(configuration.adaptateurDonnees)
      .referentiel()
      .then((referentiel) =>
        res.json(representeLeReferentielPourLeClient(referentiel)),
      );
  });

  return routes;
};

export default routesAPI;
