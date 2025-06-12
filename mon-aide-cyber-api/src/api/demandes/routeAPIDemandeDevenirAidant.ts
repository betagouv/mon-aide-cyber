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
import {
  constructeurActionsHATEOAS,
  ReponseHATEOAS,
  ReponseHATEOASEnErreur,
} from '../hateoas/hateoas';
import { validateursDeCreationDeMotDePasse } from '../validateurs/motDePasse';
import { Entrepots } from '../../domaine/Entrepots';
import { ServiceDeChiffrement } from '../../securite/ServiceDeChiffrement';
import { SagaDemandeAidantCreeEspaceAidant } from '../../gestion-demandes/devenir-aidant/CapteurSagaDemandeAidantCreeEspaceAidant';
import { ErreurMAC } from '../../domaine/erreurMAC';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { isAfter } from 'date-fns';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { estDateNouveauParcoursDemandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/nouveauParcours';
import {
  DemandeDevenirAidant,
  StatutDemande,
} from '../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { RequeteUtilisateur } from '../routesAPI';
import { uneRechercheUtilisateursMAC } from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { unServiceUtilisateurInscrit } from '../../espace-utilisateur-inscrit/ServiceUtilisateurInscritMAC';
import { unServiceAidant } from '../../espace-aidant/ServiceAidantMAC';

export const validateurDemande = (
  entrepots: Entrepots,
  serviceDeChiffrement: ServiceDeChiffrement
) => {
  const extraisToken = (valeur: string): { demande: string; mail: string } =>
    JSON.parse(atob(serviceDeChiffrement.dechiffre(valeur)));

  const { body } = new ExpressValidator({
    verifieCoherenceDeLaDemande: async (valeur: string) => {
      const tokenConverti = extraisToken(valeur);

      const demande = await entrepots
        .demandesDevenirAidant()
        .lis(tokenConverti.demande);
      if (
        demande === undefined ||
        (demande.mail !== tokenConverti.mail &&
          demande.statut === StatutDemande.EN_COURS)
      ) {
        throw new Error(
          `Le mail fourni dans le token de création d'Aidant ne correspond pas à la demande (${tokenConverti.mail}).`
        );
      }

      return true;
    },
    demandeDejaTraitee: async (valeur: string) => {
      const tokenConverti = extraisToken(valeur);
      let demande: DemandeDevenirAidant | undefined = undefined;
      try {
        demande = await entrepots
          .demandesDevenirAidant()
          .lis(tokenConverti.demande);
      } catch (error: unknown | Error) {
        console.error(
          'Les informations de la demande sont incohérentes.',
          (error as Error).message
        );
      }
      if (demande && demande.statut === StatutDemande.TRAITEE) {
        throw new Error('La demande a déjà été traitée.');
      }
    },
  });

  return [
    body('token')
      .demandeDejaTraitee()
      .withMessage(
        'Votre demande pour devenir Aidant a déjà été traitée. Votre espace Aidant est disponible, vous pouvez vous connecter à celui-ci.'
      )
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
          if (
            !['ServicePublic', 'ServiceEtat', 'Association'].includes(valeur)
          ) {
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
  if (estDateNouveauParcoursDemandeDevenirAidant()) {
    return [];
  }
  return validateursDeCreationDeMotDePasse();
};

const valideCGU = () => {
  if (estDateNouveauParcoursDemandeDevenirAidant()) {
    return [];
  }
  return [
    body('cguSignees')
      .custom((value: boolean) => value)
      .withMessage('Veuillez signer les CGU.'),
  ];
};

export type ReponseDemandeDevenirAidant = ReponseHATEOAS & {
  departements: { nom: string; code: string }[];
  donneesUtilisateur?: {
    nom: string;
    prenom: string;
    email: string;
  };
};

const estRequeteUtilisateur = (
  requete: Request | RequeteUtilisateur
): requete is RequeteUtilisateur => {
  return (
    (requete as RequeteUtilisateur).identifiantUtilisateurCourant !== undefined
  );
};
export const routesAPIDemandesDevenirAidant = (
  configuration: ConfigurationServeur
) => {
  const routes: Router = express.Router();

  const {
    entrepots,
    serviceDeChiffrement,
    adaptateurDeVerificationDeSession,
    repertoireDeContacts,
  } = configuration;

  routes.get(
    '/',
    adaptateurDeVerificationDeSession.recupereUtilisateurConnecte(
      'Demande devenir Aidant'
    ),
    async (
      requete: Request | RequeteUtilisateur,
      reponse: Response<ReponseDemandeDevenirAidant>
    ) => {
      const reponseDemande: ReponseDemandeDevenirAidant = {
        departements: nomsEtCodesDesDepartements(),
        ...constructeurActionsHATEOAS().demandeDevenirAidant().construis(),
      };
      if (estRequeteUtilisateur(requete)) {
        const utilisateur = await uneRechercheUtilisateursMAC(
          entrepots.utilisateursMAC()
        ).rechercheParIdentifiant(requete.identifiantUtilisateurCourant!);
        if (utilisateur) {
          const [prenom, ...nom] = utilisateur.nomComplet.split(' ');
          reponseDemande.donneesUtilisateur = {
            nom: nom.join(' '),
            prenom: prenom,
            email: utilisateur.email,
          };
        }
      }
      return reponse.status(200).json(reponseDemande);
    }
  );

  routes.post(
    '/',
    adaptateurDeVerificationDeSession.recupereUtilisateurConnecte(
      'Demande devenir Aidant'
    ),
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
    async (
      requete: Request | RequeteUtilisateur,
      reponse: Response<ReponseHATEOAS | ReponseHATEOASEnErreur>,
      suite: NextFunction
    ) => {
      const genereEntite = () => ({
        entite: {
          type: requete.body.entite.type,
          ...(requete.body.entite.nom && { nom: requete.body.entite.nom }),
          ...(requete.body.entite.siret && {
            siret: requete.body.entite.siret,
          }),
        },
      });

      const valideLesCGUDeLUtilisateurConnecte = async () => {
        if (estRequeteUtilisateur(requete)) {
          await unServiceUtilisateurInscrit(
            entrepots.utilisateursInscrits(),
            unServiceAidant(entrepots.aidants()),
            repertoireDeContacts
          ).valideLesCGU(requete.identifiantUtilisateurCourant!);
        }
      };

      try {
        let liens: ReponseHATEOAS | undefined = undefined;
        if (estRequeteUtilisateur(requete)) {
          liens = constructeurActionsHATEOAS()
            .pour({
              contexte: 'utilisateur-inscrit:pro-connect-acceder-au-profil',
            })
            .construis();
        } else {
          liens = constructeurActionsHATEOAS().actionsPubliques().construis();
        }

        const resultatsValidation: Result<FieldValidationError> =
          validationResult(requete) as Result<FieldValidationError>;
        if (!resultatsValidation.isEmpty()) {
          return reponse.status(422).json({
            message: resultatsValidation
              .array()
              .map((resultatValidation) => resultatValidation.msg)
              .join(', '),
            ...liens,
          });
        }

        const commande: CommandeDevenirAidant = {
          type: 'CommandeDevenirAidant',
          departement: rechercheParNomDepartement(requete.body.departement),
          mail: requete.body.mail.toLowerCase(),
          nom: requete.body.nom,
          prenom: requete.body.prenom,
          ...(requete.body.entite && genereEntite()),
        };

        await configuration.busCommande.publie(commande);

        await valideLesCGUDeLUtilisateurConnecte();

        return reponse.status(200).json(liens);
      } catch (error) {
        return suite(error);
      }
    }
  );

  routes.post(
    '/creation-espace-aidant',
    express.json(),
    valideCGU(),
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
