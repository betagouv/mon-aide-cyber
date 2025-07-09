import { Request, RequestHandler, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { z } from 'zod/v4';

export const valideLaCoherenceDuCorps = (objet: z.ZodType): RequestHandler => {
  return async (requete: Request, reponse: Response, suite: NextFunction) => {
    const resultat = objet.safeParse(requete.body);
    if (!resultat.success) {
      return reponse
        .status(400)
        .json({ message: 'Votre demande ne peut être acceptée.' });
    }
    return suite();
  };
};
