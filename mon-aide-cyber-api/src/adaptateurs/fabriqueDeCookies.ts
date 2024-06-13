import { Request, Response } from 'express';
import Cookies from 'cookies';
import { Contexte, ErreurMAC } from '../domaine/erreurMAC';
import { ErreurAccesRefuse } from './AdaptateurDeVerificationDeSession';

export type MACCookies = { session: string };
export const fabriqueDeCookies = (
  contexte: Contexte,
  requete: Request,
  reponse: Response
): MACCookies => {
  const cookies = new Cookies(requete, reponse, {
    keys: [process.env.SECRET_COOKIE || ''],
  }).get('session', { signed: true });
  if (!cookies) {
    throw ErreurMAC.cree(contexte, new ErreurAccesRefuse('Cookie invalide.'));
  }
  return {
    session: cookies,
  };
};
