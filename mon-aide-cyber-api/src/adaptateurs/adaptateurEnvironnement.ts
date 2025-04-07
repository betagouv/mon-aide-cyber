const sentry = () => ({
  dsn: () => process.env.SENTRY_DSN,
  environnement: () => process.env.SENTRY_ENVIRONNEMENT,
  tracesSampleRate: () => Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0,
});

const messagerie = () => ({
  clefAPI: () => process.env.BREVO_CLEF_API || '',
  emailMAC: () => process.env.EMAIL_CONTACT_MAC_DESTINATAIRE || '',
  copieMAC: () => process.env.EMAIL_CONTACT_MAC_COPIE || '',
  expediteurMAC: () => process.env.EMAIL_CONTACT_MAC_EXPEDITEUR || '',
  expediteurInfoMAC: () => process.env.EMAIL_INFO_MAC_EXPEDITEUR || '',
});

const mac = () => ({
  urlMAC: () => process.env.URL_MAC || '',
});

type ConfigurationProConnect = {
  urlRedirectionApresAuthentification: () => string;
  urlRedirectionApresDeconnexion: () => string;
  urlBase: () => URL;
  clientId: () => string;
  clientSecret: () => string;
};
const proConnect = (): ConfigurationProConnect => ({
  urlRedirectionApresAuthentification: () =>
    `${process.env.URL_MAC}/pro-connect/apres-authentification`,
  urlRedirectionApresDeconnexion: () =>
    `${process.env.URL_MAC}/pro-connect/apres-deconnexion`,
  urlBase: () => new URL(process.env.PRO_CONNECT_URL_BASE || ''),
  clientId: () => process.env.PRO_CONNECT_CLIENT_ID || '',
  clientSecret: () => process.env.PRO_CONNECT_CLIENT_SECRET || '',
});

const modeMaintenance = () => ({
  estActif: () => process.env.MAINTENANCE_EST_ACTIVE === 'true',
});

const siretsEntreprise = () => ({
  gendarmerie: () => process.env.SIRET_GENDARMERIE,
});

const apiRechercheEntreprise = () => ({
  url: () => process.env.URL_API_RECHERCHE_ENTREPRISE || '',
});

const nouveauParcoursDevenirAidant = () =>
  process.env.DATE_NOUVEAU_PARCOURS_DEMANDE_DEVENIR_AIDANT ||
  '2025-01-31T00:00:00';

const parametresDeHash = () => ({
  sel: () => process.env.HASH_SEL || '',
});

const http = () => ({
  csp: (): string => process.env.MAC_CSP || '',
});

const trustProxy = (): number | string => {
  const trustProxyEnChaine = process.env.RESEAU_TRUST_PROXY || '0';
  const trustProxyEnNombre = Number(trustProxyEnChaine);
  if (isNaN(trustProxyEnNombre)) {
    console.warn(
      `Attention ! RESEAU_TRUST_PROXY positionné à ${trustProxyEnChaine}`
    );
    return trustProxyEnChaine;
  } else {
    return trustProxyEnNombre;
  }
};

const ipAutorisees = (): false | string[] =>
  process.env.RESEAU_ADRESSES_IP_AUTORISEES?.split(',') ?? false;

const adaptateurEnvironnement = {
  messagerie,
  mac,
  proConnect,
  modeMaintenance,
  siretsEntreprise,
  apiRechercheEntreprise,
  nouveauParcoursDevenirAidant,
  parametresDeHash,
  http,
  reseauTrustProxy: trustProxy,
  ipAutorisees,
};

export { sentry, adaptateurEnvironnement };
