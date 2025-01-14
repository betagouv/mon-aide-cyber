import express, { NextFunction, Request, Response, Router } from 'express';
import {
  body,
  ExpressValidator,
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';
import { ConfigurationServeur } from '../../serveur';
import { CommandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/CapteurCommandeDevenirAidant';
import { validateurDeDepartement } from '../validateurs/departements';
import {
  nomsEtCodesDesDepartements,
  rechercheParNomDepartement,
} from '../../gestion-demandes/departements';
import { constructeurActionsHATEOAS } from '../hateoas/hateoas';
import { validateursDeCreationDeMotDePasse } from '../validateurs/motDePasse';
import { Entrepots } from '../../domaine/Entrepots';
import { ServiceDeChiffrement } from '../../securite/ServiceDeChiffrement';
import { SagaDemandeAidantCreeEspaceAidant } from '../../gestion-demandes/devenir-aidant/CapteurSagaDemandeAidantCreeEspaceAidant';
import { ErreurMAC } from '../../domaine/erreurMAC';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { isAfter } from 'date-fns';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';

export const validateurDemande = (
  entrepots: Entrepots,
  serviceDeChiffrement: ServiceDeChiffrement
) => {
  const { body } = new ExpressValidator({
    verifieCoherenceDeLaDemande: async (valeur: string) => {
      const tokenConverti: { demande: string; mail: string } = JSON.parse(
        atob(serviceDeChiffrement.dechiffre(valeur))
      );

      await entrepots.demandesDevenirAidant().lis(tokenConverti.demande);

      const demande = await entrepots
        .demandesDevenirAidant()
        .rechercheDemandeEnCoursParMail(tokenConverti.mail);
      if (demande === undefined) {
        throw new Error(
          `Le mail fourni dans le token de création d'Aidant ne correspond pas à la demande (${tokenConverti.mail}).`
        );
      }

      return true;
    },
  });

  return [
    body('token')
      .verifieCoherenceDeLaDemande()
      .withMessage('Aucune demande ne correspond.'),
  ];
};

const validateurNouveauParcoursDemandeDevenirAidant = () => {
  const dateNouveauParcoursDemandeDevenirAidant =
    adaptateurEnvironnement.nouveauParcoursDevenirAidant();
  if (dateNouveauParcoursDemandeDevenirAidant) {
    if (
      isAfter(
        FournisseurHorloge.maintenant(),
        FournisseurHorloge.enDate(dateNouveauParcoursDemandeDevenirAidant)
      )
    ) {
      const { body } = new ExpressValidator({
        typeEntite: async (valeur: string) => {
          if (valeur !== ('ServicePublic' && 'ServiceEtat' && 'Association')) {
            throw new Error(
              'Veuillez fournir l’une des valeurs suivantes pour le type d’entité ’ServicePublic’, ’ServiceEtat’, ’Association’'
            );
          }
          return true;
        },
      });
      return [
        body('signatureCharte')
          .custom((value: boolean) => value)
          .withMessage('Veuillez signer la Charte Aidant.'),
        body('entite.nom')
          .optional()
          .notEmpty()
          .withMessage('Veuillez renseigner un nom pour votre entité'),
        body('entite.siret')
          .optional()
          .notEmpty()
          .withMessage('Veuillez renseigner un SIRET pour votre entité'),
        body('entite.type').optional().typeEntite(),
      ];
    }
  }
  return [];
};

const validateurMotDePasse = () => {
  const dateNouveauParcoursDemandeDevenirAidant =
    adaptateurEnvironnement.nouveauParcoursDevenirAidant();
  if (
    dateNouveauParcoursDemandeDevenirAidant &&
    isAfter(
      FournisseurHorloge.maintenant(),
      FournisseurHorloge.enDate(dateNouveauParcoursDemandeDevenirAidant)
    )
  ) {
    return [];
  }
  return validateursDeCreationDeMotDePasse();
};

export const routesAPIDemandesDevenirAidant = (
  configuration: ConfigurationServeur
) => {
  const routes: Router = express.Router();

  const { entrepots, serviceDeChiffrement } = configuration;

  routes.get('/', async (_requete: Request, reponse: Response) => {
    return reponse.status(200).json({
      departements: nomsEtCodesDesDepartements(),
      ...constructeurActionsHATEOAS().demandeDevenirAidant().construis(),
    });
  });

  routes.post(
    '/',
    express.json(),
    body('nom').trim().notEmpty().withMessage('Veuillez renseigner votre nom'),
    body('prenom')
      .trim()
      .notEmpty()
      .withMessage('Veuillez renseigner votre prénom'),
    body('mail')
      .trim()
      .isEmail()
      .withMessage('Veuillez renseigner votre e-mail'),
    validateurDeDepartement(),
    body('cguValidees')
      .custom((value: boolean) => value)
      .withMessage('Veuillez valider les CGU'),
    validateurNouveauParcoursDemandeDevenirAidant(),
    async (requete: Request, reponse: Response, suite: NextFunction) => {
      try {
        const resultatsValidation: Result<FieldValidationError> =
          validationResult(requete) as Result<FieldValidationError>;
        if (!resultatsValidation.isEmpty()) {
          return reponse.status(422).json({
            message: resultatsValidation
              .array()
              .map((resultatValidation) => resultatValidation.msg)
              .join(', '),
          });
        }

        const commande: CommandeDevenirAidant = {
          type: 'CommandeDevenirAidant',
          departement: rechercheParNomDepartement(requete.body.departement),
          mail: requete.body.mail.toLowerCase(),
          nom: requete.body.nom,
          prenom: requete.body.prenom,
        };

        await configuration.busCommande.publie(commande);
        return reponse.status(200).send();
      } catch (error) {
        return suite(error);
      }
    }
  );

  routes.post(
    '/creation-espace-aidant',
    express.json(),
    body('cguSignees')
      .custom((value: boolean) => value)
      .withMessage('Veuillez signer les CGU.'),
    validateurMotDePasse(),
    validateurDemande(entrepots, serviceDeChiffrement),
    async (requete: Request, reponse: Response, suite: NextFunction) => {
      const resultatsValidation: Result<FieldValidationError> =
        validationResult(requete) as Result<FieldValidationError>;

      if (!resultatsValidation.isEmpty()) {
        return reponse.status(422).json({
          message: resultatsValidation
            .array()
            .map((resultatValidation) => resultatValidation.msg)
            .join(', '),
        });
      }

      const { demande } = JSON.parse(
        atob(serviceDeChiffrement.dechiffre(requete.body.token))
      );
      return configuration.busCommande
        .publie<SagaDemandeAidantCreeEspaceAidant, void>({
          type: 'SagaDemandeAidantEspaceAidant',
          idDemande: demande,
          motDePasse: requete.body.motDePasse,
        })
        .then(() =>
          reponse.status(201).json({
            ...constructeurActionsHATEOAS()
              .pour({ contexte: 'se-connecter' })
              .construis(),
          })
        )
        .catch((erreur) =>
          suite(
            ErreurMAC.cree(
              'Demande devenir Aidant - crée espace Aidant',
              erreur
            )
          )
        );
    }
  );

  return routes;
};
