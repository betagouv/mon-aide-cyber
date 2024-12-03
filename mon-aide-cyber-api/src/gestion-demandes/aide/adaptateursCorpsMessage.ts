import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { Aide } from '../../aide/Aide';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { Departement } from '../departements';

export type ProprietesMessageAidant = {
  nomPrenom: string;
  departement: Departement;
  mailEntite: string;
  raisonSocialeEntite?: string;
};

const genereCorpsNotificationAidantSollicitation = (
  proprietesMessage: ProprietesMessageAidant
): string => {
  return (
    '<html lang="fr">' +
    '<body>' +
    `Bonjour ${proprietesMessage.nomPrenom},\n` +
    '\n' +
    `Une entité ${proprietesMessage.raisonSocialeEntite ? `(${proprietesMessage.raisonSocialeEntite})` : ''} vous a sollicité sur l’annuaire des Aidants cyber car elle souhaite bénéficier avec vous d’un diagnostic MonAideCyber dans le département <b>${proprietesMessage.departement.nom}</b>.\n` +
    '\n' +
    'Voici ses coordonnées afin de programmer ensemble la réalisation du prochain diagnostic :' +
    '\n' +
    `${proprietesMessage.mailEntite}` +
    '\n' +
    'Au cours de sa demande, l’entité a accepté les CGU.\n' +
    '\n' +
    'Lors du rendez-vous, vous pourrez créer le diagnostic sur votre espace aidant comme vous le faites actuellement.\n' +
    'Il est conseillé de réaliser le diagnostic en présentiel, la visioconférence est cependant tolérée.\n' +
    '\n' +
    `En cas d’empêchement de votre part, nous vous remercions d’envoyer un mail à l’adresse <a href="mailto:monaidecyber@ssi.gouv.fr?subject=[MonAideCyber] Indisponibilité réalisation diagnostic dans le département ${proprietesMessage.departement.nom}">monaidecyber@ssi.gouv.fr</a> afin que la demande soit attribuée à un autre Aidant cyber.\n` +
    '\n' +
    'Toute l’équipe reste à votre disposition,\n' +
    '\n' +
    '<b>L’équipe MonAideCyber</b>' +
    '</body>' +
    '</html>'
  );
};

export type ProprietesMessageRecapitulatifSollicitationAide = {
  nomPrenom: string;
  departement: Departement;
};

const genereRecapitulatifSollicitationAide = (
  proprietesMessage: ProprietesMessageRecapitulatifSollicitationAide
) =>
  '<html lang="fr">' +
  '<body>' +
  'Bonjour\n' +
  '\n' +
  `Vous avez sollicité l'Aidant cyber ${proprietesMessage.nomPrenom} référencé sur l’annuaire MonAideCyber pour la réalisation d’un diagnostic dans le département ${proprietesMessage.departement.nom}.\n` +
  '\n' +
  "Votre demande a bien été affectée à l'Aidant cyber qui prendra contact avec vous prochainement en vue de convenir d’un rendez-vous.\n" +
  '\n' +
  "En cas d’empêchement de l'Aidant cyber, nous allons automatiquement attribuer votre demande à un Aidant cyber disponible sur le même département.\n" +
  '\n' +
  'Vous serez informé de ce changement par mail.\n' +
  '\n' +
  '<h3>Quelques conseils pour préparer son rdv</h3>\n' +
  '\t - Prévoyez un <b>créneau d’1H30</b> en moyenne\n' +
  '\t - Il est fortement recommandé qu’un membre du comité de direction et votre prestataire informatique (si existant) soient également présents durant le diagnostic\n' +
  `\t - Consultez notre <a href="${adaptateurEnvironnement.mac().urlMAC()}/a-propos/kit-de-communication" target="_blank">kit de communication</a> pour mieux comprendre le dispositif MonAideCyber` +
  '\n' +
  'Toute l’équipe reste à votre disposition,\n' +
  '\n' +
  "<b>L'équipe MonAideCyber</b>" +
  '</body>' +
  '</html>';

export type ProprietesMessageRecapitulatif = {
  raisonSociale?: string;
  mailEntite: string;
  aidant: string;
  departement: Departement;
};

export type MessagesSollicitation = {
  notificationAidantSollicitation: () => {
    genereCorpsMessage: (proprietesMessage: ProprietesMessageAidant) => string;
  };
  recapitulatifMAC: () => {
    genereCorpsMessage: (
      proprietesMessage: ProprietesMessageRecapitulatif
    ) => string;
  };
  recapitulatifSollicitationAide: (
    proprietesMessage: ProprietesMessageRecapitulatifSollicitationAide
  ) => {
    genereCorpsMessage: () => string;
  };
};

export type MessagesDemande = {
  recapitulatifDemandeAide: () => {
    genereCorpsMessage: (aide: Aide, relationAidant: boolean) => string;
  };
  confirmationDemandeAide: () => {
    genereCorpsMessage: (aide: Aide, relationAidant: boolean) => string;
  };
};

export type AdaptateurCorpsDeMessageAide = {
  sollicitation: () => MessagesSollicitation;
  demande: () => MessagesDemande;
};

const genereCorpsConfirmationDemandeAide = (
  aide: Aide,
  relationAidant: boolean
) => {
  const formateDate = FournisseurHorloge.formateDate(
    FournisseurHorloge.maintenant()
  );
  const raisonSociale = aide.raisonSociale
    ? `- Raison sociale : ${aide.raisonSociale}\n`
    : '';
  const messageIntroduction = relationAidant
    ? 'Votre demande a bien été prise en compte.\n' +
      '\n' +
      'Votre Aidant va vous accompagner dans la suite de votre démarche MonAideCyber.\n' +
      'Voici les informations que vous avez renseignées :\n'
    : 'Votre demande pour bénéficier de MonAideCyber a été prise en compte.\n' +
      'Un Aidant de proximité vous contactera sur l’adresse email que vous nous avez communiquée dans les meilleurs délais.\n' +
      '\n' +
      'Voici les informations que vous avez renseignées :\n';
  return (
    'Bonjour,\n' +
    '\n' +
    messageIntroduction +
    `- Signature des CGU le ${formateDate.date} à ${formateDate.heure}\n` +
    `- Département : ${aide.departement}\n` +
    raisonSociale +
    '\n' +
    'Toute l’équipe reste à votre disposition,\n\n' +
    "L'équipe MonAideCyber\n" +
    'monaidecyber@ssi.gouv.fr\n'
  );
};
const genereCorpsRecapitulatifDemandeAide = (
  aide: Aide,
  relationAidant: boolean
) => {
  const formateDate = FournisseurHorloge.formateDate(
    FournisseurHorloge.maintenant()
  );
  const raisonSociale = aide.raisonSociale
    ? `- Raison sociale: ${aide.raisonSociale}\n`
    : '';
  const miseEnRelation = relationAidant
    ? '- Est déjà en relation avec un Aidant\n'
    : '';
  return (
    'Bonjour,\n' +
    '\n' +
    `Une demande d’aide a été faite par ${aide.email}\n` +
    '\n' +
    'Ci-dessous, les informations concernant cette demande :\n' +
    miseEnRelation +
    `- Date de la demande : ${formateDate.date} à ${formateDate.heure}\n` +
    `- Département: ${aide.departement}\n` +
    raisonSociale
  );
};
const adaptateursCorpsMessage: AdaptateurCorpsDeMessageAide = {
  sollicitation: (): MessagesSollicitation => ({
    notificationAidantSollicitation: () => ({
      genereCorpsMessage: (
        proprietesMessage: ProprietesMessageAidant
      ): string =>
        genereCorpsNotificationAidantSollicitation(proprietesMessage),
    }),
    recapitulatifMAC: () => ({
      genereCorpsMessage: (proprietes: ProprietesMessageRecapitulatif) => {
        return (
          '<html lang="fr">' +
          '<body>' +
          'Bonjour,\n' +
          '\n' +
          `Aujourd’hui, l’entité ${proprietes.raisonSociale ? `(${proprietes.raisonSociale})` : ''} sous l’adresse ${proprietes.mailEntite} a sollicité l’Aidant cyber ${proprietes.aidant} situé dans le département ${proprietes.departement}.\n` +
          '\n' +
          "L'équipe MonAideCyber" +
          '</body>' +
          '</html>'
        );
      },
    }),
    recapitulatifSollicitationAide: (
      proprietesMessage: ProprietesMessageRecapitulatifSollicitationAide
    ) => ({
      genereCorpsMessage: (): string =>
        genereRecapitulatifSollicitationAide(proprietesMessage),
    }),
  }),
  demande: (): MessagesDemande => ({
    confirmationDemandeAide: () => ({
      genereCorpsMessage: (aide, relationAidant): string =>
        genereCorpsConfirmationDemandeAide(aide, relationAidant),
    }),
    recapitulatifDemandeAide: () => ({
      genereCorpsMessage: (aide, relationAidant): string =>
        genereCorpsRecapitulatifDemandeAide(aide, relationAidant),
    }),
  }),
};

export { adaptateursCorpsMessage };
