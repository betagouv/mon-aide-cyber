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

const brevo = () => ({
  templateConfirmationAide: () =>
    Number(process.env.BREVO_TEMPLATE_CONFIRMATION_AIDE) || 0,
  templateConfirmationAideEnRelationAvecUnUtilisateurMAC: () =>
    Number(
      process.env
        .BREVO_TEMPLATE_CONFIRMATION_AIDE_EN_RELATION_AVEC_UN_UTILISATEUR_MAC
    ) || 0,
  templateAidantDemandeAideAttribuee: () =>
    Number(process.env.BREVO_TEMPLATE_AIDANT_DEMANDE_AIDE_ATTRIBUEE) || 0,
  templateMiseEnRelation: () =>
    Number(process.env.BREVO_TEMPLATE_AIDANT_MISE_EN_RELATION),
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

type ConfigurationCrisp = {
  idSite: string;
  clefAPI: string;
  guideAidantCyber: string;
  promouvoirDiagnosticCyber: string;
  promouvoirCommunauteAidantsCyber: string;
};
const crisp = (): ConfigurationCrisp | undefined => {
  if (!process.env.CRISP_ID_SITE || !process.env.CRISP_CLEF_API)
    return undefined;
  return {
    idSite: process.env.CRISP_ID_SITE,
    clefAPI: process.env.CRISP_CLEF_API,
    guideAidantCyber: process.env.CRISP_ID_GUIDE_AIDANT_CYBER || '',
    promouvoirDiagnosticCyber:
      process.env.CRISP_ID_PROMOUVOIR_DIAGNOSTIC_CYBER || '',
    promouvoirCommunauteAidantsCyber:
      process.env.CRISP_ID_PROMOUVOIR_COMMUNAUTE_AIDANTS_CYBER || '',
  };
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
  brevo,
  crisp,
};

export { sentry, adaptateurEnvironnement };
