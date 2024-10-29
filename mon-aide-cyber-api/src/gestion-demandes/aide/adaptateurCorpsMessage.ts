export type ProprietesMessageAidant = {
  nomPrenom: string;
  departement: string;
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
    `Une entité ${proprietesMessage.raisonSocialeEntite ? `(${proprietesMessage.raisonSocialeEntite})` : ''} vous a sollicité sur l’annuaire des Aidants cyber car elle souhaite bénéficier avec vous d’un diagnostic MonAideCyber dans le département <b>${proprietesMessage.departement}</b>.\n` +
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
    `En cas d’empêchement de votre part, nous vous remercions d’envoyer un mail à l’adresse <a href="mailto:monaidecyber@ssi.gouv.fr?subject=[MonAideCyber] Indisponibilité réalisation diagnostic dans le département ${proprietesMessage.departement}">monaidecyber@ssi.gouv.fr</a> afin que la demande soit attribuée à un autre Aidant cyber.\n` +
    '\n' +
    'Toute l’équipe reste à votre disposition,\n' +
    '\n' +
    '<b>L’équipe MonAideCyber</b>' +
    '</body>' +
    '</html>'
  );
};

export type ProprietesMessageRecapitulatif = {
  raisonSociale?: string;
  mailEntite: string;
  aidant: string;
  departement: string;
};

const adaptateurCorpsMessage = {
  notificationAidantSollicitation: () => ({
    genereCorpsMessage: (proprietesMessage: ProprietesMessageAidant): string =>
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
};

export { adaptateurCorpsMessage };
