import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { AggregatNonTrouve } from '../../domaine/Aggregat';
import { ConsignateurErreurs } from '../../adaptateurs/ConsignateurErreurs';

import { ErreurMAC } from '../../domaine/erreurMAC';

import { ErreurAuthentification } from '../../authentification/Aidant';
import { ErreurAccesRefuse } from '../../adaptateurs/AdaptateurDeVerificationDeSession';

const HTTP_NON_AUTORISE = 401;
const HTTP_ACCES_REFUSE = 403;
const HTTP_NON_TROUVE = 404;
const HTTP_ERREUR_SERVEUR = 500;

const CORPS_REPONSE_ERREUR_NON_GEREE = {
  message: "MonAideCyber n'est pas en mesure de traiter votre demande.",
};

export const gestionnaireErreurGeneralisee = (
  consignateurErreur: ConsignateurErreurs,
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

    console.log(erreur);

    if (erreur) {
      if (erreur instanceof ErreurMAC) {
        if (erreur.erreurOriginelle instanceof AggregatNonTrouve) {
          construisReponse(HTTP_NON_TROUVE, { message: erreur.message });
          consignateurErreur.consigne(erreur);
        } else if (erreur.erreurOriginelle instanceof ErreurAuthentification) {
          consignateurErreur.consigne(erreur);
          construisReponse(HTTP_NON_AUTORISE, { message: erreur.message });
        } else if (erreur.erreurOriginelle instanceof ErreurAccesRefuse) {
          consignateurErreur.consigne(erreur);
          construisReponse(HTTP_ACCES_REFUSE, {
            message: "L'accès à la ressource est interdit.",
          });
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
