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
    return (__requete, __reponse, suite) => {
      this.champsAutorises = champs;
      return suite();
    };
  }
}
