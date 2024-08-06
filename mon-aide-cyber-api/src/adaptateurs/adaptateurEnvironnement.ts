const sentry = () => ({
  dsn: () => process.env.SENTRY_DSN,
  environnement: () => process.env.SENTRY_ENVIRONNEMENT,
});

const messagerie = () => ({
  clefAPI: () => process.env.BREVO_CLEF_API || '',
  emailMAC: () => process.env.EMAIL_CONTACT_MAC_DESTINATAIRE || '',
  expediteurMAC: () => process.env.EMAIL_CONTACT_MAC_EXPEDITEUR || '',
});

const mac = () => ({
  urlMAC: () => process.env.URL_MAC || '',
});

const adaptateurEnvironnement = {
  messagerie,
  mac,
};

export { sentry, adaptateurEnvironnement };
