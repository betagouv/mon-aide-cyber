import { Request, RequestHandler, Response } from 'express';
import { isArray } from 'lodash';
import { NextFunction } from 'express-serve-static-core';

type ChampsImbriques = { nom: string; champs?: ChampsImbriques[] };
type ChampsAutorises = {
  champs: ChampsImbriques[];
};

export const valideLaConsistence = (
  champs: ChampsAutorises
): RequestHandler => {
  const valideLaConsistenceDesChamps = (
    lesChampsRecus: any,
    lesChampsAttendus: ChampsImbriques[]
  ): boolean => {
    const champsAutorises = lesChampsAttendus.map((ch) => ch.nom);
    const champsInconnus = Object.entries(lesChampsRecus).filter(
      ([clef, valeur]) => {
        if (
          !isArray(valeur) &&
          typeof valeur === 'object' &&
          champsAutorises.includes(clef)
        ) {
          return valideLaConsistenceDesChamps(
            valeur,
            lesChampsAttendus.find((c) => c.nom === clef)?.champs || []
          );
        }
        return !champsAutorises.includes(clef);
      }
    );
    return champsInconnus.length > 0;
  };

  return async (requete: Request, reponse: Response, suite: NextFunction) => {
    const lesChampsAttendus = champs.champs;
    const lesChampsRecus = requete.body;
    if (valideLaConsistenceDesChamps(lesChampsRecus, lesChampsAttendus)) {
      return reponse
        .status(400)
        .json({ message: 'Votre demande ne peut être acceptée.' });
    }
    return suite();
  };
};
