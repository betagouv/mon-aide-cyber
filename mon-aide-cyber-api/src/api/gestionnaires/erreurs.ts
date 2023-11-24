import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { ConsignateurErreurs } from '../../adaptateurs/ConsignateurErreurs';

import { ErreurMAC } from '../../domaine/erreurMAC';

const HTTP_NON_AUTORISE = 401;
const HTTP_ACCES_REFUSE = 403;
const HTTP_NON_TROUVE = 404;
const HTTP_ERREUR_SERVEUR = 500;

const CORPS_REPONSE_ERREUR_NON_GEREE = {
  message: "MonAideCyber n'est pas en mesure de traiter votre demande.",
};

const construisReponse = (
  reponse: Response,
  codeHTTP: number,
  corpsReponse: { message: string },
) => {
  reponse.status(codeHTTP);
  reponse.json(corpsReponse);
};

const erreursGerees: Map<
  string,
  (
    erreur: ErreurMAC,
    consignateur: ConsignateurErreurs,
    reponse: Response,
  ) => void
> = new Map([
  [
    'AggregatNonTrouve',
    (erreur, consignateur, reponse) => {
      consignateur.consigne(erreur);
      construisReponse(reponse, HTTP_NON_TROUVE, { message: erreur.message });
    },
  ],
  [
    'ErreurAuthentification',
    (erreur, consignateur, reponse) => {
      consignateur.consigne(erreur);
      construisReponse(reponse, HTTP_NON_AUTORISE, { message: erreur.message });
    },
  ],
  [
    'ErreurAccesRefuse',
    (erreur, consignateur, reponse) => {
      consignateur.consigne(erreur);
      construisReponse(reponse, HTTP_ACCES_REFUSE, {
        message: "L'accès à la ressource est interdit.",
      });
    },
  ],
]);

export const gestionnaireErreurGeneralisee = (
  consignateurErreur: ConsignateurErreurs,
) => {
  return (
    erreur: Error,
    _requete: Request,
    reponse: Response,
    suite: NextFunction,
  ) => {
    const construisReponseErreurServeur = () => {
      construisReponse(
        reponse,
        HTTP_ERREUR_SERVEUR,
        CORPS_REPONSE_ERREUR_NON_GEREE,
      );
    };

    if (erreur) {
      if (erreur instanceof ErreurMAC) {
        if (erreursGerees.has(erreur.erreurOriginelle.constructor.name)) {
          erreursGerees.get(erreur.erreurOriginelle.constructor.name)?.(
            erreur,
            consignateurErreur,
            reponse,
          );
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
