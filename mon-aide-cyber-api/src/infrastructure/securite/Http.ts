import crypto from 'crypto';
import { Response } from 'express';

export const positionneLesCsp = (reponse: Response, csp: string) => {
  if (!csp) {
    reponse.setHeader('Content-Security-Policy', '*');
    return;
  }

  const resultats = [];
  for (let morceau of csp.split(';')) {
    if (morceau.trim().startsWith('style-src'))
      morceau = rajouteNonceAleatoire(morceau, reponse);

    resultats.push(morceau);
  }

  reponse.setHeader('Content-Security-Policy', resultats.join(';'));
};

const rajouteNonceAleatoire = (cspExistante: string, reponse: Response) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  reponse.locals.nonce = nonce;

  return `${cspExistante} 'nonce-${nonce}'`;
};
