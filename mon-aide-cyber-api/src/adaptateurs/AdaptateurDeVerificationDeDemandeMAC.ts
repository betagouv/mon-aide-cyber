import { RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { AdaptateurDeVerificationDeDemande } from './AdaptateurDeVerificationDeDemande';

export class AdaptateurDeVerificationDeDemandeMAC
  implements AdaptateurDeVerificationDeDemande
{
  verifie(): RequestHandler<
    ParamsDictionary,
    any,
    any,
    ParsedQs,
    Record<string, any>
  > {
    throw new Error('Method not implemented.');
  }
}