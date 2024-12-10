import { adaptateurEnvironnement } from '../adaptateurEnvironnement';
import { Request } from 'express';
import { BaseClient, generators, Issuer } from 'openid-client';

const configurationOidc = adaptateurEnvironnement.proConnect();

const recupereConfiguration = async (): Promise<BaseClient> => {
  const agentConnect = await Issuer.discover(
    configurationOidc.urlBase().toString()
  );
  return new agentConnect.Client({
    client_id: configurationOidc.clientId(),
    client_secret: configurationOidc.clientSecret(),
    redirect_uris: [configurationOidc.urlRedirectionApresAuthentification()],
    response_types: ['code'],
    id_token_signed_response_alg: 'RS256',
    userinfo_signed_response_alg: 'RS256',
  });
};

export type DemandeAutorisation = {
  url: URL;
  nonce: string;
  state: string;
};
const genereDemandeAutorisation = async (): Promise<DemandeAutorisation> => {
  const client = await recupereConfiguration();
  const nonce = generators.nonce(32);
  const state = generators.state(32);
  const url = client.authorizationUrl({
    scope: 'openid email given_name usual_name siret',
    nonce,
    state,
  });

  return {
    url: new URL(url),
    nonce,
    state,
  };
};

export type DemandeDeconnexion = {
  url: URL;
  state: string;
};

const genereDemandeDeconnexion = async (
  idToken: string
): Promise<DemandeDeconnexion> => {
  const state = generators.state(32);
  const client = await recupereConfiguration();
  const url = client.endSessionUrl({
    post_logout_redirect_uri:
      configurationOidc.urlRedirectionApresDeconnexion(),
    id_token_hint: idToken,
    state,
  });

  return {
    url: new URL(url),
    state,
  };
};

export type Jeton = {
  idToken?: string | undefined;
  accessToken?: string | undefined;
};
const recupereJeton = async (requete: Request): Promise<Jeton> => {
  const client = await recupereConfiguration();
  const params = client.callbackParams(requete);

  const { nonce, state } = requete.cookies.AgentConnectInfo;
  const token = await client.callback(
    configurationOidc.urlRedirectionApresAuthentification(),
    params,
    { nonce, state }
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
  const client = await recupereConfiguration();
  const {
    given_name: prenom,
    usual_name: nom,
    email,
    siret,
  } = await client.userinfo(accessToken);
  return { prenom, nom, email, siret } as InformationsUtilisateur;
};

export type AdaptateurProConnect = {
  genereDemandeAutorisation: () => Promise<DemandeAutorisation>;
  genereDemandeDeconnexion: (idToken: string) => Promise<DemandeDeconnexion>;
  recupereInformationsUtilisateur: (
    accessToken: string
  ) => Promise<InformationsUtilisateur>;
  recupereJeton: (requete: Request) => Promise<Jeton>;
};

export const adaptateurProConnect: AdaptateurProConnect = {
  genereDemandeAutorisation,
  genereDemandeDeconnexion,
  recupereInformationsUtilisateur,
  recupereJeton,
};
