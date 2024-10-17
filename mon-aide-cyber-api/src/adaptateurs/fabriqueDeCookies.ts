import { Request, Response } from 'express';
import Cookies from 'cookies';
import { Contexte, ErreurMAC } from '../domaine/erreurMAC';
import {
  ErreurAccesRefuse,
  InformationsContexte,
} from './AdaptateurDeVerificationDeSession';
import {
  GestionnaireDeJeton,
  JwtMACPayload,
} from '../authentification/GestionnaireDeJeton';

export type MACCookies = { session: string };

export const recuperateurDeCookies = (
  requete: Request,
  reponse: Response
): string | undefined =>
  new Cookies(requete, reponse, {
    keys: [process.env.SECRET_COOKIE || ''],
  }).get('session', { signed: true });

export const fabriqueDeCookies = (
  contexte: Contexte,
  requete: Request,
  reponse: Response
): MACCookies => {
  const cookies = recuperateurDeCookies(requete, reponse);
  if (!cookies) {
    throw ErreurMAC.cree(
      contexte,
      new ErreurAccesRefuse(
        'Cookie invalide.',
        requete.query as InformationsContexte
      )
    );
  }
  return {
    session: cookies,
  };
};
export const jwtPayload = (
  cookies: MACCookies,
  gestionnaireDeJeton: GestionnaireDeJeton
): JwtMACPayload => {
  const sessionDecodee = JSON.parse(
    Buffer.from(cookies.session, 'base64').toString()
  );
  return gestionnaireDeJeton.verifie(sessionDecodee.token);
};
