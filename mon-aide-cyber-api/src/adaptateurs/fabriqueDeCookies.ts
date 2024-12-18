import { Request, Response } from 'express';
import Cookies, { Option } from 'cookies';
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

export type ParametresCookies = {
  clef?: {
    keys: string[];
  };
  nom: string;
  signed?: boolean;
};

export const recuperateurDeCookies = (
  requete: Request,
  reponse: Response,
  parametres: ParametresCookies = {
    clef: {
      keys: [process.env.SECRET_COOKIE || ''],
    },
    nom: 'session',
    signed: true,
  }
): string | undefined => {
  const options: Option | undefined = parametres.clef
    ? { keys: parametres.clef.keys }
    : undefined;
  return new Cookies(requete, reponse, options).get(
    parametres.nom,
    parametres.signed ? { signed: true } : undefined
  );
};

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
