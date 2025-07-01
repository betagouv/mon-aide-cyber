import { ConfigurationServeur } from '../serveur';
import express, { RequestHandler, Response } from 'express';
import crypto, { UUID } from 'crypto';
import { ServiceDiagnostic } from '../diagnostic/ServiceDiagnostic';
import { representeLeDiagnosticPourLeClient } from './representateurs/representateurDiagnostic';
import { NextFunction } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import {
  CorpsReponse,
  SagaAjoutReponse,
} from '../diagnostic/CapteurSagaAjoutReponse';
import { ErreurMAC } from '../domaine/erreurMAC';
import { Restitution } from '../restitution/Restitution';
import { RequeteUtilisateur } from './routesAPI';
import { CommandeLanceDiagnostic } from '../diagnostic/CapteurCommandeLanceDiagnostic';
import { Diagnostic } from '../diagnostic/Diagnostic';
import { constructeurActionsHATEOAS, ReponseHATEOAS } from './hateoas/hateoas';
import { RepresentationDiagnostic } from './representateurs/types';
import { RestitutionHTML } from '../infrastructure/adaptateurs/AdaptateurDeRestitutionHTML';
import {
  DefinitionAidantInitieDiagnostic,
  definitionAidantInitieDiagnostic,
  definitionUtilisateurInscritInitieDiagnostic,
  DefinitionUtilisateurInscritInitieDiagnostic,
} from '../diagnostic/tuples';
import { AdaptateurDeVerificationDesAcces } from '../adaptateurs/AdaptateurDeVerificationDesAcces';
import { Entrepots } from '../domaine/Entrepots';
import { uneRechercheUtilisateursMAC } from '../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { body } from 'express-validator';
import { Evenement } from '../domaine/BusEvenement';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

export type ReponseDiagnostic = ReponseHATEOAS & RepresentationDiagnostic;

const verifieRelations = (
  relations: AdaptateurDeVerificationDesAcces,
  entrepots: Entrepots
): RequestHandler => {
  return async (
    requete: RequeteUtilisateur,
    reponse: Response,
    suite: NextFunction
  ) => {
    uneRechercheUtilisateursMAC(entrepots.utilisateursMAC())
      .rechercheParIdentifiant(requete.identifiantUtilisateurCourant!)
      .then((utilisateur) => {
        if (utilisateur?.profil === 'UtilisateurInscrit') {
          return relations.verifie<DefinitionUtilisateurInscritInitieDiagnostic>(
            definitionUtilisateurInscritInitieDiagnostic.definition
          )(requete, reponse, suite);
        }
        return relations.verifie<DefinitionAidantInitieDiagnostic>(
          definitionAidantInitieDiagnostic.definition
        )(requete, reponse, suite);
      });
  };
};

export type CorpsRequeteLanceDiagnostic = {
  emailEntiteAidee: string;
};

export const routesAPIDiagnostic = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const {
    adaptateurDeVerificationDeSession: session,
    adaptateurDeVerificationDeCGU: cgu,
    adaptateurDeVerificationDeDemande: demandeAide,
    adaptateurDeVerificationDesAcces: relations,
    adaptateurAseptisation: aseptisation,
    busCommande,
    entrepots,
    adaptateurEnvoiMessage: envoiMessage,
    adaptateurRelations,
    busEvenement,
  } = configuration;

  routes.post(
    '/',
    bodyParser.json(),
    session.verifie('Lance le diagnostic'),
    aseptisation.aseptise('emailEntiteAidee'),
    body('emailEntiteAidee')
      .isEmail()
      .withMessage('Veuillez renseigner une adresse email valide.'),
    cgu.verifie('Lance le diagnostic'),
    demandeAide.verifie(),
    (
      requete: RequeteUtilisateur<CorpsRequeteLanceDiagnostic>,
      reponse: Response,
      suite: NextFunction
    ) => {
      const commande: CommandeLanceDiagnostic = {
        type: 'CommandeLanceDiagnostic',
        identifiantAidant: requete.identifiantUtilisateurCourant!,
        emailEntite: requete.body.emailEntiteAidee,
      };
      busCommande
        .publie<CommandeLanceDiagnostic, Diagnostic>(commande)
        .then((diagnostic) => {
          reponse.status(201);
          reponse.appendHeader(
            'Link',
            `${requete.originalUrl}/${diagnostic.identifiant}`
          );
          reponse.send();
        })
        .catch((erreur) => suite(erreur));
    }
  );

  routes.get(
    '/:id',
    session.verifie('Accès diagnostic'),
    cgu.verifie('Accès diagnostic'),
    verifieRelations(relations, entrepots),
    (requete: RequeteUtilisateur, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;
      new ServiceDiagnostic(configuration.entrepots)
        .diagnostic(id as crypto.UUID)
        .then((diagnostic) =>
          reponse.json({
            ...representeLeDiagnosticPourLeClient(
              diagnostic,
              configuration.adaptateurTranscripteurDonnees.transcripteur()
            ),
            ...constructeurActionsHATEOAS()
              .accesDiagnostic(diagnostic.identifiant)
              .construis(),
          })
        )
        .catch((erreur) => suite(erreur));
    }
  );

  routes.patch(
    '/:id',
    session.verifie('Ajout réponse au diagnostic'),
    cgu.verifie('Ajout réponse au diagnostic'),
    verifieRelations(relations, entrepots),
    bodyParser.json(),
    (
      requete: RequeteUtilisateur<CorpsReponse, { id: UUID }>,
      reponse: Response,
      suite: NextFunction
    ) => {
      const { id } = requete.params;
      const corpsReponse = requete.body;
      const commande: SagaAjoutReponse = {
        type: 'SagaAjoutReponse',
        idDiagnostic: id,
        ...corpsReponse,
      };
      busCommande
        .publie<SagaAjoutReponse, Diagnostic>(commande)
        .then((diagnostic) => {
          reponse.json({
            ...representeLeDiagnosticPourLeClient(
              diagnostic,
              configuration.adaptateurTranscripteurDonnees.transcripteur()
            ),
            ...constructeurActionsHATEOAS()
              .ajoutReponseAuDiagnostic(diagnostic.identifiant)
              .construis(),
          });
        })
        .catch((erreur) => suite(erreur));
    }
  );

  routes.get(
    '/:id/restitution',
    session.verifie('Demande la restitution'),
    cgu.verifie('Demande la restitution'),
    verifieRelations(relations, entrepots),
    (requete: RequeteUtilisateur, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;

      const genereRestitution = (
        restitution: Restitution
      ): Promise<Buffer | RestitutionHTML> => {
        if (requete.headers.accept === 'application/pdf') {
          return configuration.adaptateursRestitution
            .pdf()
            .genereRestitution(restitution);
        }
        return configuration.adaptateursRestitution
          .html()
          .genereRestitution(restitution);
      };

      const creerReponse = async (restitution: Buffer | RestitutionHTML) => {
        if (requete.headers.accept === 'application/pdf') {
          reponse.contentType('application/pdf').send(restitution);
        } else {
          const reponseHATEOAS = (
            await constructeurActionsHATEOAS().demandeLaRestitution(
              id,
              adaptateurRelations
            )
          )
            .pour({
              contexte: requete.estProConnect
                ? 'se-deconnecter-avec-pro-connect'
                : 'se-deconnecter',
            })
            .construis();
          const resultat: RepresentationRestitution = {
            ...reponseHATEOAS,
            ...(restitution as RestitutionHTML),
          };
          reponse.json(resultat);
        }
      };

      configuration.entrepots
        .restitution()
        .lis(id)
        .then((restitution) => genereRestitution(restitution))
        .then(async (pdf) => await creerReponse(pdf))
        .catch((erreur) =>
          suite(ErreurMAC.cree('Demande la restitution', erreur))
        );
    }
  );

  routes.post(
    '/:id/restitution/demande-envoi-mail-restitution',
    session.verifie('Envoi la restitution à l’entité Aidée'),
    verifieRelations(relations, entrepots),
    async (
      requete: RequeteUtilisateur,
      reponse: Response,
      suite: NextFunction
    ) => {
      try {
        const { id } = requete.params;
        const tuple = await configuration.adaptateurRelations.diagnosticDeLAide(
          id as crypto.UUID
        );
        const restitution = await configuration.entrepots.restitution().lis(id);
        const pdfRestitution = await configuration.adaptateursRestitution
          .pdf()
          .genereRestitution(restitution);
        await envoiMessage.envoieRestitutionEntiteAidee(
          [pdfRestitution],
          tuple.utilisateur.identifiant
        );
        await busEvenement.publie<RestitutionEnvoyee>({
          identifiant: crypto.randomUUID(),
          type: 'RESTITUTION_ENVOYEE',
          corps: {
            emailEntiteAidee: tuple.utilisateur.identifiant,
          },
          date: FournisseurHorloge.maintenant(),
        });
        return reponse.status(202).send();
      } catch (error: unknown | Error) {
        return suite(
          ErreurMAC.cree(
            'Envoi la restitution à l’entité Aidée',
            new ErreurDemandeEnvoiMailRestitution(error as Error)
          )
        );
      }
    }
  );

  return routes;
};

export class ErreurDemandeEnvoiMailRestitution extends Error {
  constructor(erreur: Error) {
    super('Erreur lors de l’envoi par mail de la restitution.', {
      cause: erreur,
    });
  }
}

export type RepresentationRestitution = ReponseHATEOAS & {
  autresMesures: string;
  contactsEtLiensUtiles: string;
  indicateurs: string;
  informations: string;
  mesuresPrioritaires: string;
  ressources: string;
};

export type RestitutionEnvoyee = Evenement<{
  emailEntiteAidee: string;
}>;
