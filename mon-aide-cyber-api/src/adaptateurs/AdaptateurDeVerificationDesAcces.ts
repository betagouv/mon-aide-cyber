import {
  ConstructeurUtilisateur,
  ConstructeurObjet,
} from '../definition-type/relations';
import { Relation } from '../relation/Tuple';
import { RequestHandler } from 'express';

export interface AdaptateurDeVerificationDesAcces {
  verifie(
    relation: Relation,
    utilisateur: typeof ConstructeurUtilisateur,
    objet: typeof ConstructeurObjet,
  ): RequestHandler;
}
