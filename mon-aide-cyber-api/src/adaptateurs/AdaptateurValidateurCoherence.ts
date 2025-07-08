import { RequestHandler } from 'express';

export type ChampsImbriques = { nom: string; champs?: ChampsImbriques[] };
export type ChampsAutorises = {
  champs: ChampsImbriques[];
};

export interface AdaptateurValidateurCoherence {
  valide(champs: ChampsAutorises): RequestHandler;
}
