import express, { Request, Response, Router } from "express";
import { ServiceReferentiel } from "../diagnostic/ServiceReferentiel";
import { Referentiel } from "../diagnostic/Referentiel";
import { ConfigurationServeur } from "../serveur";

type RepresentationReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
};

type RepresentationQuestionChoixUnique = {
  reponsesPossibles: RepresentationReponsePossible[];
  identifiant: string;
  libelle: string;
};

type RepresentationContexte = {
  questions: RepresentationQuestionChoixUnique[];
};

type RepresentationReferentiel = {
  contexte: RepresentationContexte;
};
function representeLeReferentielPourLeClient(
  referentiel: Referentiel,
): RepresentationReferentiel {
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

  routes.get("/diagnostic/:id", (_req: Request, res: Response) => {
    new ServiceReferentiel(configuration.adaptateurDonnees)
      .referentiel()
      .then((referentiel) =>
        res.json(representeLeReferentielPourLeClient(referentiel)),
      );
  });

  return routes;
};

export default routesAPI;
