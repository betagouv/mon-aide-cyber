const sentry = () => ({
  dsn: () => process.env.SENTRY_DSN,
  environnement: () => process.env.SENTRY_ENVIRONNEMENT,
});

const messagerie = () => ({
  emailMAC: () => process.env.EMAIL_CONTACT_MAC_DESTINATAIRE || '',
});

const adaptateurEnvironnement = {
  messagerie,
};

export { sentry, adaptateurEnvironnement };
