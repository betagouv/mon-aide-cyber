import express, { Response } from 'express';
import { NextFunction } from 'express-serve-static-core';

import {
  body,
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';
import { ConfigurationServeur } from '../../serveur';
import { RequeteUtilisateur } from '../routesAPI';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { constructeurActionsHATEOAS } from '../hateoas/hateoas';
import { ErreurMAC } from '../../domaine/erreurMAC';
import {
  ErreurValidationMotDePasse,
  validateurDeNouveauMotDePasse,
} from '../validateurs/motDePasse';
import { ServiceProfilAidant } from '../../espace-aidant/profil/ServiceProfilAidant';

type CorpsRequeteChangementMotDerPasse = {
  ancienMotDePasse: string;
  motDePasse: string;
  confirmationMotDePasse: string;
};

type CorpsRequeteModifieProfilAidant = {
  consentementAnnuaire: boolean;
};

export const routesAPIProfil = (configuration: ConfigurationServeur) => {
  const routes = express.Router();
  const {
    entrepots,
    adaptateurDeVerificationDeSession: session,
    adaptateurDeVerificationDeCGU: cgu,
    busEvenement,
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
            consentementAnnuaire: aidant.consentementAnnuaire,
            identifiantConnexion: aidant.identifiantConnexion,
            ...constructeurActionsHATEOAS().accedeAuProfil().construis(),
          });
        })
        .catch((erreur) => suite(ErreurMAC.cree('Accède au profil', erreur)));
    }
  );

  routes.patch(
    '/',
    express.json(),
    session.verifie('Modifie le profil Aidant'),
    cgu.verifie(),
    body('consentementAnnuaire')
      .isBoolean()
      .withMessage(
        "Une erreur est survenue, vos modifications n'ont pas été prises en compte. Veuillez recharger la page et vérifier vos informations."
      ),
    async (
      requete: RequeteUtilisateur<CorpsRequeteModifieProfilAidant>,
      reponse: Response,
      suite
    ) => {
      const resultatValidation: Result<FieldValidationError> = validationResult(
        requete
      ) as Result<FieldValidationError>;
      if (resultatValidation.isEmpty()) {
        return new ServiceProfilAidant(entrepots.aidants(), busEvenement)
          .modifie(requete.identifiantUtilisateurCourant!, {
            consentementAnnuaire: requete.body.consentementAnnuaire,
          })
          .then(() => reponse.status(204).send())
          .catch((erreur) =>
            suite(ErreurMAC.cree('Modifie le profil Aidant', erreur))
          );
      }
      const erreursValidation = resultatValidation
        .array()
        .map((resultat) => resultat.msg)
        .filter((erreur): erreur is string => !!erreur)
        .join('\n');
      return suite(
        ErreurMAC.cree(
          'Modifie le profil Aidant',
          new ErreurModificationProfil(erreursValidation)
        )
      );
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
      requete: RequeteUtilisateur<CorpsRequeteChangementMotDerPasse>,
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
        const changementnMotDePasse = requete.body;
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

export class ErreurModificationProfil extends Error {
  constructor(message: string) {
    super(message);
  }
}
