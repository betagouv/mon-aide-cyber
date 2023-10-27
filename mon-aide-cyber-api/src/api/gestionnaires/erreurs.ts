import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { AggregatNonTrouve } from '../../domaine/Aggregat';
import { ConsignateurErreurs } from '../../adaptateurs/ConsignateurErreurs';

import { ErreurMAC } from '../../domaine/erreurMAC';

const HTTP_NON_TROUVE = 404;
const HTTP_ERREUR_SERVEUR = 500;
const CORPS_REPONSE_ERREUR_NON_GEREE = {
  message: "MonAideCyber n'est pas en mesure de traiter votre demande.",
};

export const gestionnaireErreurGeneralisee = (
  gestionnaireErreurs: ConsignateurErreurs,
) => {
  return (
    erreur: Error,
    _requete: Request,
    reponse: Response,
    suite: NextFunction,
  ) => {
    const construisReponse = (
      codeHTTP: number,
      corpsReponse: { message: string },
    ) => {
      reponse.status(codeHTTP);
      reponse.json(corpsReponse);
    };

    const construisReponseErreurServeur = () => {
      construisReponse(HTTP_ERREUR_SERVEUR, CORPS_REPONSE_ERREUR_NON_GEREE);
    };

    if (erreur) {
      if (erreur instanceof ErreurMAC) {
        if (erreur.erreurOriginelle instanceof AggregatNonTrouve) {
          construisReponse(HTTP_NON_TROUVE, { message: erreur.message });
          gestionnaireErreurs.consigne(erreur);
        } else {
          construisReponseErreurServeur();
          suite(erreur);
        }
      } else {
        construisReponseErreurServeur();
        suite(erreur);
      }
    }
  };
};
