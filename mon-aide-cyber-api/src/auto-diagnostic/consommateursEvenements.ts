import { AdaptateurRelations } from '../relation/AdaptateurRelations';
import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import { AutoDiagnosticLance } from './CapteurSagaLanceAutoDiagnostic';
import crypto from 'crypto';
import { DefinitionTuple, Tuple, unTuple } from '../relation/Tuple';
import { AdaptateurEnvoiMail } from '../adaptateurs/AdaptateurEnvoiMail';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

export const demandeInitieAutoDiagnostic = (
  adaptateurRelations: AdaptateurRelations
) =>
  new (class implements ConsommateurEvenement {
    async consomme<E extends Evenement<unknown> = AutoDiagnosticLance>(
      evenement: E
    ): Promise<void> {
      const diagnosticLance = evenement as AutoDiagnosticLance;
      const tuple = unTupleEntiteInitieAutoDiagnostic(
        diagnosticLance.corps.idDemande,
        diagnosticLance.corps.idDiagnostic
      );

      return adaptateurRelations.creeTuple(tuple);
    }
  })();

const unTupleEntiteInitieAutoDiagnostic = (
  identifiantDemande: crypto.UUID,
  identifiantDiagnostic: crypto.UUID
): Tuple =>
  unTuple<DefinitionEntiteInitieAutoDiagnostic>(
    definitionEntiteInitieAutoDiagnostic
  )
    .avecUtilisateur(identifiantDemande)
    .avecObjet(identifiantDiagnostic)
    .construis();

type DefinitionEntiteInitieAutoDiagnostic = DefinitionTuple & {
  relation: 'initiateur';
  typeObjet: 'auto-diagnostic';
  typeUtilisateur: 'entité';
};

const definitionEntiteInitieAutoDiagnostic: {
  definition: DefinitionEntiteInitieAutoDiagnostic;
} = {
  definition: {
    relation: 'initiateur',
    typeObjet: 'auto-diagnostic',
    typeUtilisateur: 'entité',
  },
};

export const envoiMailAutoDiagnostic = (
  adaptateurEnvoiMail: AdaptateurEnvoiMail
): ConsommateurEvenement =>
  new (class implements ConsommateurEvenement {
    consomme<E extends Evenement<unknown> = AutoDiagnosticLance>(
      evenement: E
    ): Promise<void> {
      const diagnosticLance = evenement as AutoDiagnosticLance;
      adaptateurEnvoiMail.envoie({
        destinataire: { email: diagnosticLance.corps.email },
        corps: adaptateurCorpsMessage
          .autoDiagnostic(diagnosticLance.corps.dateSignatureCGU)
          .genereCorpsMessage(),
        objet: '[MonAideCyber] Réalisation d’un diagnostic en autonomie',
      });
      return Promise.resolve(undefined);
    }
  })();

export const adaptateurCorpsMessage = {
  autoDiagnostic: (dateSignatureCGU: Date) => {
    const dateFormatee = FournisseurHorloge.formateDate(dateSignatureCGU);
    return {
      genereCorpsMessage: () =>
        '<html lang="fr">' +
        '<body>' +
        'Bonjour,\n' +
        '\n' +
        'Vous pouvez réaliser votre diagnostic !\n' +
        '\n' +
        'Votre demande pour réaliser un diagnostic MonAideCyber en autonomie a été validée par nos équipes.\n' +
        '\n' +
        `<b>Vous avez signé les CGU le ${dateFormatee.date} à ${dateFormatee.heure}</b>\n` +
        '\n' +
        'Toute l’équipe MonAideCyber reste à votre disposition :\n' +
        '<a href="mailto:monaidecyber@ssi.gouv.fr">monaidecyber@ssi.gouv.fr</a>' +
        '\n' +
        '\n' +
        '<b>L’équipe MonAideCyber</b>' +
        '</body>' +
        '</html>',
    };
  },
};
