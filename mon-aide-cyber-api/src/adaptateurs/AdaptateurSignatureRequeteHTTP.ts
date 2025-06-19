import { RequestHandler } from 'express';
import { AdaptateurSignatureRequete } from './AdaptateurSignatureRequete';

export class AdaptateurSignatureRequeteHTTP
  implements AdaptateurSignatureRequete
{
  verifie(): RequestHandler {
    throw new Error('Method not implemented.');
  }
}
