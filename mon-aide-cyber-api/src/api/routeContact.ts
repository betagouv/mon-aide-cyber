import { ConfigurationServeur } from '../serveur';
import express, { Request, Response } from 'express';
import {
  body,
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';
import { NextFunction } from 'express-serve-static-core';
import { ErreurMAC } from '../domaine/erreurMAC';

export const routeContact = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.post(
    '/',
    express.json(),
    body('nom').trim().notEmpty().escape(),
    body('email').trim().notEmpty().isEmail(),
    body('message').trim().notEmpty().escape(),
    (requete: Request, reponse: Response, suite: NextFunction) => {
      const resultatValidation: Result<FieldValidationError> = validationResult(
        requete,
      ) as Result<FieldValidationError>;

      const construisMessage = () => ({
        objet: 'Contact MAC',
        corps:
          `Bonjour, \n` +
          `${requete.body.nom} (${requete.body.email}) a envoyé le message suivant:\n` +
          `${requete.body.message}`,
        destinataire: {
          nom: 'MonAideCyber',
          email: process.env.EMAIL_CONTACT_MAC_DESTINATAIRE || '',
        },
      });

      if (resultatValidation.isEmpty()) {
        return configuration.adaptateurEnvoiMessage
          .envoie(construisMessage())
          .then(() => {
            reponse.status(202);
            return reponse.send();
          })
          .catch((erreur) =>
            suite(ErreurMAC.cree('Envoi un message de contact', erreur)),
          );
      }
      reponse.status(400);
      return reponse.send({
        message: `Des erreurs se trouvent dans le(s) champ(s) suivant(s): ${resultatValidation
          .array()
          .map((erreur) => `'${erreur.path}'`)
          .join(' - ')}`,
      });
    },
  );

  return routes;
};
