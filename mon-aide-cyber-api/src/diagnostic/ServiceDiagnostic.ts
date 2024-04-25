import { Diagnostic } from './Diagnostic';
import * as crypto from 'crypto';
import { Entrepots } from '../domaine/Entrepots';
import { ErreurMAC } from '../domaine/erreurMAC';

export type Contexte = {
  departement?: string;
  secteurActivite?: string;
  dateCreation: Date;
};

export class ServiceDiagnostic {
  constructor(private readonly entrepots: Entrepots) {}

  diagnostic = async (id: crypto.UUID): Promise<Diagnostic> =>
    await this.entrepots
      .diagnostic()
      .lis(id)
      .catch((erreur) =>
        Promise.reject(ErreurMAC.cree('Accès diagnostic', erreur)),
      );

  contexte = async (id: crypto.UUID): Promise<Contexte> => {
    const diagnostic = await this.diagnostic(id);

    const trouveLibelleReponseDonneeDansContexte = (
      identifiantQuestion: string,
    ) => {
      const question = diagnostic.referentiel['contexte'].questions.find(
        (question) => question.identifiant === identifiantQuestion,
      );

      return question?.reponsesPossibles.find(
        (reponsePossible) =>
          reponsePossible.identifiant === question.reponseDonnee.reponseUnique,
      )?.libelle;
    };

    const departement = trouveLibelleReponseDonneeDansContexte(
      'contexte-departement-tom-siege-social',
    );
    const secteurActivite = trouveLibelleReponseDonneeDansContexte(
      'contexte-secteur-activite',
    );

    return {
      ...(departement && { departement }),
      ...(secteurActivite && { secteurActivite }),
      dateCreation: diagnostic.dateCreation,
    };
  };
}
