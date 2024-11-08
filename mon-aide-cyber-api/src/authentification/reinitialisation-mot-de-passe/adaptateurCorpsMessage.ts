const genereCorpsReinitialiserMotDePasse = (nomPrenom: string, url: string) => {
  return (
    '<html lang="fr">' +
    '<body>' +
    `Bonjour ${nomPrenom}, \n` +
    '\n' +
    '<b>Réinitialisation de votre mot de passe</b> \n' +
    '\n' +
    'Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe. Si vous n’êtes pas à l’origine de la demande, vous pouvez ignorer cet e-mail.\n' +
    '\n' +
    `${url}\n` +
    '\n' +
    'Toute l’équipe MonAideCyber reste à votre disposition : <a href="mailto:monaidecyber@ssi.gouv.fr">monaidecyber@ssi.gouv.fr</a>' +
    '\n' +
    '</body>' +
    '</html>'
  );
};

const adaptateurCorpsMessage = {
  reinitialiserMotDePasse: () => ({
    genereCorpsMessage: (nomPrenom: string, url: string) =>
      genereCorpsReinitialiserMotDePasse(nomPrenom, url),
  }),
};

export { adaptateurCorpsMessage };
