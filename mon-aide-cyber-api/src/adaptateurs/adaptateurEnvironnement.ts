const sentry = () => ({
  dsn: () => process.env.SENTRY_DSN,
  environnement: () => process.env.SENTRY_ENVIRONNEMENT,
});

const messagerie = () => ({
  clefAPI: () => process.env.BREVO_CLEF_API || '',
  emailMAC: () => process.env.EMAIL_CONTACT_MAC_DESTINATAIRE || '',
  expediteurMAC: () => process.env.EMAIL_CONTACT_MAC_EXPEDITEUR || '',
});

const adaptateurEnvironnement = {
  messagerie,
};

export { sentry, adaptateurEnvironnement };
