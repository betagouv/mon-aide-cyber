import { Request, Response } from 'express';
import { AdaptateurDeGestionDeCookies } from './AdaptateurDeGestionDeCookies';
import Cookies from 'cookies';

export class AdaptateurDeGestionDeCookiesMAC implements AdaptateurDeGestionDeCookies {
  supprime(requete: Request, reponse: Response): void {
    const cookies = new Cookies(requete, reponse, {
      keys: [process.env.SECRET_COOKIE || ''],
    });
    cookies.set('session');
  }
}
