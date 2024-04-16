const sentry = () => ({
  dsn: () => process.env.SENTRY_DSN,
  environnement: () => process.env.SENTRY_ENVIRONNEMENT,
});

const messagerie = () => ({
  emailMAC: () => process.env.EMAIL_CONTACT_MAC_DESTINATAIRE || '',
});

const estProduction = () => process.env.MAC_PRODUCTION === 'true';

const adaptateurEnvironnement = {
  messagerie,
  estProduction,
};

export { sentry, adaptateurEnvironnement };
