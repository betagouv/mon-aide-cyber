const sentry = () => ({
  dsn: () => process.env.SENTRY_DSN,
  environnement: () => process.env.SENTRY_ENVIRONNEMENT,
});

const messagerie = () => ({
  clefAPI: () => process.env.BREVO_CLEF_API || '',
  emailMAC: () => process.env.EMAIL_CONTACT_MAC_DESTINATAIRE || '',
  expediteurMAC: () => process.env.EMAIL_CONTACT_MAC_EXPEDITEUR || '',
  expediteurInfoMAC: () => process.env.EMAIL_INFO_MAC_EXPEDITEUR || '',
});

const mac = () => ({
  urlMAC: () => process.env.URL_MAC || '',
});

type ConfigurationOIDC = {
  urlRedirectionApresAuthentification: () => string;
  urlRedirectionApresDeconnexion: () => string;
  urlBase: () => URL;
  clientId: () => string;
  clientSecret: () => string;
};
const proConnect = (): ConfigurationOIDC => ({
  urlRedirectionApresAuthentification: () =>
    `${process.env.URL_MAC}/pro-connect/apres-authentification`,
  urlRedirectionApresDeconnexion: () =>
    `${process.env.URL_MAC}/pro-connect/apres-deconnexion`,
  urlBase: () => new URL(process.env.PRO_CONNECT_URL_BASE || ''),
  clientId: () => process.env.PRO_CONNECT_CLIENT_ID || '',
  clientSecret: () => process.env.PRO_CONNECT_CLIENT_SECRET || '',
});

const adaptateurEnvironnement = {
  messagerie,
  mac,
  proConnect,
};

export { sentry, adaptateurEnvironnement };
