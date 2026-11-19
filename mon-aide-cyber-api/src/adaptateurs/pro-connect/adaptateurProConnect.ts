import * as client from 'openid-client';
import { adaptateurEnvironnement } from '../adaptateurEnvironnement';
import { Request } from 'express';

const configurationOidc = adaptateurEnvironnement.proConnect();

const recupereConfiguration = async (): Promise<client.Configuration> =>
  client.discovery(configurationOidc.urlBase(), configurationOidc.clientId(), {
    client_secret: configurationOidc.clientSecret(),
    id_token_signed_response_alg: 'RS256',
    userinfo_signed_response_alg: 'RS256',
  });

export type DemandeAutorisation = {
  url: URL;
  nonce: string;
  state: string;
};
const genereDemandeAutorisation = async (): Promise<DemandeAutorisation> => {
  const configuration = await recupereConfiguration();
  const nonce = client.randomNonce();
  const state = client.randomState();
  const url = client.buildAuthorizationUrl(configuration, {
    redirect_uri: configurationOidc.urlRedirectionApresAuthentification(),
    scope: 'openid email given_name usual_name siret',
    nonce,
    state,
  });

  return { url, nonce, state };
};

export type DemandeDeconnexion = {
  url: URL;
  state: string;
};

const genereDemandeDeconnexion = async (
  idToken: string
): Promise<DemandeDeconnexion> => {
  const state = client.randomState();
  const configuration = await recupereConfiguration();
  const url = client.buildEndSessionUrl(configuration, {
    post_logout_redirect_uri:
      configurationOidc.urlRedirectionApresDeconnexion(),
    id_token_hint: idToken,
    state,
  });

  return { url, state };
};

export type Jeton = {
  idToken?: string | undefined;
  accessToken?: string | undefined;
};
const recupereJeton = async (
  requete: Request,
  cookie: { nonce: string; state: string }
): Promise<Jeton> => {
  const configuration = await recupereConfiguration();
  const urlCourante = new URL(
    requete.originalUrl,
    configurationOidc.urlRedirectionApresAuthentification()
  );
  const { nonce, state } = cookie;

  const token = await client.authorizationCodeGrant(
    configuration,
    urlCourante,
    { expectedNonce: nonce, expectedState: state }
  );

  return {
    idToken: token.id_token,
    accessToken: token.access_token,
  };
};

export type InformationsUtilisateur = {
  prenom?: string | undefined;
  nom?: string | undefined;
  email?: string | undefined;
  siret?: string | undefined;
};

const recupereInformationsUtilisateur = async (
  accessToken: string
): Promise<InformationsUtilisateur> => {
  const configuration = await recupereConfiguration();
  const {
    given_name: prenom,
    usual_name: nom,
    email,
    siret,
  } = await client.fetchUserInfo(
    configuration,
    accessToken,
    client.skipSubjectCheck
  );
  return { prenom, nom, email, siret } as InformationsUtilisateur;
};

export type AdaptateurProConnect = {
  genereDemandeAutorisation: () => Promise<DemandeAutorisation>;
  genereDemandeDeconnexion: (idToken: string) => Promise<DemandeDeconnexion>;
  recupereInformationsUtilisateur: (
    accessToken: string
  ) => Promise<InformationsUtilisateur>;
  recupereJeton: (
    requete: Request,
    cookie: { state: string; nonce: string }
  ) => Promise<Jeton>;
};

export const adaptateurProConnect: AdaptateurProConnect = {
  genereDemandeAutorisation,
  genereDemandeDeconnexion,
  recupereInformationsUtilisateur,
  recupereJeton,
};
