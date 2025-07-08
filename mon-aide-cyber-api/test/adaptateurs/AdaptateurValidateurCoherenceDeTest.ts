import { RequestHandler } from 'express';
import {
  AdaptateurValidateurCoherence,
  ChampsAutorises,
} from '../../src/adaptateurs/AdaptateurValidateurCoherence';

export class AdaptateurValidateurCoherenceDeTest
  implements AdaptateurValidateurCoherence
{
  public champsAutorises: ChampsAutorises | undefined = undefined;
  valide(champs: ChampsAutorises): RequestHandler {
    this.champsAutorises = champs;
    return (__requete, __reponse, suite) => {
      return suite();
    };
  }
}
