import { Request, RequestHandler, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { AdaptateurDeVerificationDeDemande } from './AdaptateurDeVerificationDeDemande';
import { EntrepotDemandeAide } from '../gestion-demandes/aide/DemandeAide';

export class AdaptateurDeVerificationDeDemandeMAC
  implements AdaptateurDeVerificationDeDemande
{
  constructor(private readonly entrepotAide: EntrepotDemandeAide) {}

  verifie(): RequestHandler {
    return async (requete: Request, reponse: Response, suite: NextFunction) => {
      return this.entrepotAide
        .rechercheParEmail(requete.body.emailEntiteAidee)
        .then((rechercheDemande) => {
          switch (rechercheDemande.etat) {
            case 'COMPLET':
              return suite();
            case 'INCOMPLET':
              return reponse.status(422).json({
                message:
                  "Aucune demande d'aide ne correspond à cet email. Assurez-vous que l'entité a effectué une demande en ligne.",
              });
            case 'INEXISTANT':
              return reponse.status(422).json({
                message:
                  "Aucune demande d'aide ne correspond à cet email. Assurez-vous que l'entité a effectué une demande en ligne.",
              });
          }
        });
    };
  }
}
