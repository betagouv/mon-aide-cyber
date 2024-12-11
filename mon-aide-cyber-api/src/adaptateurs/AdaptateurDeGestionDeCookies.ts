import { RequestHandler } from 'express';

export interface AdaptateurDeGestionDeCookies {
  supprime(): RequestHandler;
}
