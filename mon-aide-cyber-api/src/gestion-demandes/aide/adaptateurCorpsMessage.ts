const genereCorpsNotificationAidantSollicitation = (
  nomPrenom: string,
  departement: string
): string => {
  return (
    '<html lang="fr">' +
    '<body>' +
    `Bonjour ${nomPrenom},\n` +
    '\n' +
    `Une entité vous a sélectionné sur l’annuaire des Aidants cyber car elle souhaite bénéficier avec vous d’un diagnostic MonAideCyber dans le département <b>${departement}</b>.\n` +
    '\n' +
    'Au cours de sa demande, l’entité a accepté les CGU.\n' +
    '\n' +
    'Vous avez reçu un email avec les coordonnées de cette entité afin de programmer ensemble la réalisation du prochain diagnostic.\n' +
    'Lors du rdv, vous pourrez créer le diagnostic sur votre espace aidant comme vous le faites actuellement.\n' +
    'Il est conseillé de réaliser le diagnostic en présentiel, la visioconférence est cependant tolérée.\n' +
    '\n' +
    'En cas d’empêchement de votre part, nous vous remercions d’envoyer un mail à l’adresse monaidecyber@ssi.gouv.fr afin que la demande soit attribuée à un autre Aidant cyber.\n' +
    '\n' +
    'Toute l’équipe reste à votre disposition,\n' +
    '\n' +
    '<b>L’équipe MonAideCyber</b>\n' +
    'monaidecyber@ssi.gouv.fr' +
    '</body>' +
    '</html>'
  );
};

const adaptateurCorpsMessage = {
  notificationAidantSollicitation: () => ({
    genereCorpsMessage: (nomPrenom: string, departement: string): string =>
      genereCorpsNotificationAidantSollicitation(nomPrenom, departement),
  }),
};

export { adaptateurCorpsMessage };
