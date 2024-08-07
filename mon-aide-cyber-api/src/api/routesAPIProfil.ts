import { ConfigurationServeur } from '../serveur';
import express, { Response } from 'express';
import { RequeteUtilisateur } from './routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { ErreurMAC } from '../domaine/erreurMAC';
import { constructeurActionsHATEOAS } from './hateoas/hateoas';

import {
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';
import {
  ErreurValidationMotDePasse,
  validateurDeNouveauMotDePasse,
} from './validateurs/motDePasse';

type CorpsRequeteChangementMotDerPasse = {
  ancienMotDePasse: string;
  motDePasse: string;
  confirmationMotDePasse: string;
};

export const routesAPIProfil = (configuration: ConfigurationServeur) => {
  const routes = express.Router();
  const {
    entrepots,
    adaptateurDeVerificationDeSession: session,
    adaptateurDeVerificationDeCGU: cgu,
  } = configuration;

  routes.get(
    '/',
    session.verifie('Accède au profil'),
    cgu.verifie(),
    async (
      requete: RequeteUtilisateur,
      reponse: Response,
      suite: NextFunction
    ) => {
      return entrepots
        .aidants()
        .lis(requete.identifiantUtilisateurCourant!)
        .then((aidant) => {
          const dateSignatureCGU = aidant.dateSignatureCGU;
          return reponse.status(200).json({
            nomPrenom: aidant.nomPrenom,
            dateSignatureCGU: dateSignatureCGU
              ? FournisseurHorloge.formateDate(dateSignatureCGU).date
              : '',
            identifiantConnexion: aidant.identifiantConnexion,
            ...constructeurActionsHATEOAS().affichageProfil().construis(),
          });
        })
        .catch((erreur) => suite(ErreurMAC.cree('Accède au profil', erreur)));
    }
  );

  routes.post(
    '/modifier-mot-de-passe',
    express.json(),
    session.verifie('Modifie le mot de passe'),
    cgu.verifie(),
    validateurDeNouveauMotDePasse(
      entrepots,
      'ancienMotDePasse',
      'motDePasse',
      'confirmationMotDePasse'
    ),
    async (
      requete: RequeteUtilisateur,
      reponse: Response,
      suite: NextFunction
    ) => {
      const resultatValidation: Result<FieldValidationError> = validationResult(
        requete
      ) as Result<FieldValidationError>;
      if (resultatValidation.isEmpty()) {
        const aidant = await entrepots
          .aidants()
          .lis(requete.identifiantUtilisateurCourant!);
        const changementnMotDePasse: CorpsRequeteChangementMotDerPasse =
          requete.body;
        aidant.motDePasse = changementnMotDePasse.motDePasse;
        return entrepots
          .aidants()
          .persiste(aidant)
          .then(() => {
            reponse.status(204);
            return reponse.send();
          });
      }
      const erreursValidation = resultatValidation
        .array()
        .map((resultat) => resultat.msg)
        .filter((erreur): erreur is string => !!erreur);
      return suite(
        ErreurMAC.cree(
          'Modifie le mot de passe',
          new ErreurValidationMotDePasse(erreursValidation.join('\n'))
        )
      );
    }
  );

  return routes;
};
