import { AdaptateurDeGestionDeCookies } from '../../src/adaptateurs/AdaptateurDeGestionDeCookies';
import { Request, Response } from 'express';

export class AdaptateurDeGestionDeCookiesDeTest
  implements AdaptateurDeGestionDeCookies
{
  aSupprime = false;

  supprime(_requete: Request, _response: Response): void {
    this.aSupprime = true;
  }
}
