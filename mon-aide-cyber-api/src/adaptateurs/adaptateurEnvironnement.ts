const sentry = () => ({
  dsn: () => process.env.SENTRY_DSN,
  environnement: () => process.env.SENTRY_ENVIRONNEMENT,
  tracesSampleRate: () => Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0,
});

const mattermost = () => ({
  clefWebhook: () => process.env.WEBHOOK_MATTERMOST_AIDANT_CREE_INCONNU || '',
});

const messagerie = () => ({
  clefAPI: () => process.env.BREVO_CLEF_API || '',
  emailMAC: () => process.env.EMAIL_CONTACT_MAC_DESTINATAIRE || '',
  copieMAC: () => process.env.EMAIL_CONTACT_MAC_COPIE || '',
  expediteurMAC: () => process.env.EMAIL_CONTACT_MAC_EXPEDITEUR || '',
  expediteurInfoMAC: () => process.env.EMAIL_INFO_MAC_EXPEDITEUR || '',
});

const brevo = () => {
  return {
    templateConfirmationAide: () =>
      Number(process.env.BREVO_TEMPLATE_CONFIRMATION_AIDE) || 0,
    templateConfirmationAideEnRelationAvecUnUtilisateurMAC: () =>
      Number(
        process.env
          .BREVO_TEMPLATE_CONFIRMATION_AIDE_EN_RELATION_AVEC_UN_UTILISATEUR_MAC
      ) || 0,
    templateAidantDemandeAideAttribuee: () =>
      Number(process.env.BREVO_TEMPLATE_AIDANT_DEMANDE_AIDE_ATTRIBUEE),
    templateMiseEnRelation: () =>
      Number(process.env.BREVO_TEMPLATE_AIDANT_MISE_EN_RELATION),
    templateRestitutionPDF: () =>
      Number(process.env.BREVO_TEMPLATE_RESTITUTION_PDF),
    templateActivationCompteAidant: () =>
      Number(process.env.BREVO_TEMPLATE_ACTIVATION_COMPTE_AIDANT),
    templateParticipationAtelierAidant: () =>
      Number(process.env.BREVO_TEMPLATE_PARTICIPATION_ATELIER_AIDANT),
    templateMiseAJourParticipationAtelierAidant: () =>
      Number(
        process.env.BREVO_TEMPLATE_MISE_A_JOUR_PARTICIPATION_ATELIER_AIDANT
      ),
    templateConfirmationUtilisateurInscritCree: () =>
      Number(process.env.BREVO_TEMPLATE_CONFIRMATION_UTILISATEUR_INSCRIT_CREE),
    templateReinitialisationMotDePasse: () =>
      Number(process.env.BREVO_TEMPLATE_REINITIALISATION_MOT_DE_PASSE),
  };
};

const mac = () => ({
  urlMAC: () => process.env.URL_MAC || '',
  urlAideMAC: () => process.env.URL_AIDE_MAC || '',
});

const mesServicesCyber = () => ({
  urlMesServicesCyber: (): URL | string =>
    process.env.URL_MSC ? new URL(process.env.URL_MSC) : '',
  urlCyberDepart: (): URL | string =>
    process.env.URL_MSC ? new URL('/cyberdepart', process.env.URL_MSC) : '',
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
  relaisAssociatifs: string;
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
    relaisAssociatifs: process.env.CRISP_ID_RELAIS_ASSOCIATIFS || '',
  };
};

type SignaturesHTTP = {
  tally: () => {
    suiviDiagnostic: string;
  };
  livestorm: () => {
    finAtelier: string | undefined;
  };
};

const signatures = (): SignaturesHTTP => {
  return {
    livestorm: () => ({
      finAtelier: process.env.SIGNATURE_LIVESTORM_FIN_ATELIER || undefined,
    }),
    tally: () => ({
      suiviDiagnostic:
        process.env.SIGNATURE_TALLY_FORMULAIRE_SUIVI_DIAGNOSTIC || '',
    }),
  };
};

const ipAutorisees = (): false | string[] =>
  process.env.RESEAU_ADRESSES_IP_AUTORISEES?.split(',') ?? false;

const metabase = (): {
  identifiantQuestionNombreDiagnostics: number;
  url: string;
  clefApi: string;
  identifiantQuestionNombreAidants: number;
  repartitionDesDiagnosticsParTerritoire: number;
  identifiantQuestionNiveauSatifactionDiagnostic: number;
} => {
  return {
    url: process.env.METABASE_URL || '',
    clefApi: process.env.METABASE_CLEF_API || '',
    repartitionDesDiagnosticsParTerritoire: Number(
      process.env.METABASE_DASHBOARD_REPARTITION_DIAGNOSTICS_PAR_TERRITOIRE
    ),
    identifiantQuestionNombreAidants: Number(
      process.env.METABASE_IDENTIFIANT_QUESTION_NOMBRE_AIDANTS
    ),
    identifiantQuestionNombreDiagnostics: Number(
      process.env.METABASE_IDENTIFIANT_QUESTION_NOMBRE_DIAGNOSTICS
    ),
    identifiantQuestionNiveauSatifactionDiagnostic: Number(
      process.env.METABASE_IDENTIFIANT_QUESTION_NIVEAU_SATISFACTION_DIAGNOSTIC
    ),
  };
};

const adaptateurEnvironnement = {
  messagerie,
  mattermost,
  mac,
  mesServicesCyber,
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
  signatures,
  metabase,
};

export { sentry, adaptateurEnvironnement };
