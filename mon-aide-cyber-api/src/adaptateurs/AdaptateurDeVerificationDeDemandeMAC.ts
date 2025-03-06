import { Request, RequestHandler, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { AdaptateurDeVerificationDeDemande } from './AdaptateurDeVerificationDeDemande';
import { EntrepotDemandeAide } from '../gestion-demandes/aide/DemandeAide';
import {
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';

export class AdaptateurDeVerificationDeDemandeMAC
  implements AdaptateurDeVerificationDeDemande
{
  constructor(private readonly entrepotAide: EntrepotDemandeAide) {}

  verifie(): RequestHandler {
    return async (requete: Request, reponse: Response, suite: NextFunction) => {
      const resultatsValidation: Result<FieldValidationError> =
        validationResult(requete) as Result<FieldValidationError>;

      if (!resultatsValidation.isEmpty()) {
        return reponse.status(400).json({
          message: resultatsValidation
            .array()
            .map((resultatValidation) => resultatValidation.msg)
            .join(', '),
        });
      }

      return this.entrepotAide
        .rechercheParEmail(requete.body.emailEntiteAidee)
        .then((rechercheDemande) => {
          switch (rechercheDemande.etat) {
            case 'COMPLET':
              return suite();
            case 'INCOMPLET':
              return this.reponseEnErreur(reponse);
            case 'INEXISTANT':
              return this.reponseEnErreur(reponse);
          }
        });
    };
  }

  private reponseEnErreur(reponse: Response): Response {
    return reponse.status(422).json({
      message:
        "Aucune demande d'aide ne correspond à cet email. Assurez-vous que l'entité a effectué une demande en ligne.",
    });
  }
}
