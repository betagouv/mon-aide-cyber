import {
  ajouteLaReponseAuDiagnostic,
  Diagnostic,
  genereLesRecommandations,
  initialiseDiagnostic,
} from './Diagnostic';
import * as crypto from 'crypto';
import { Entrepots } from '../domaine/Entrepots';
import { Adaptateur } from '../adaptateurs/Adaptateur';
import { Referentiel } from './Referentiel';
import { TableauDeRecommandations } from './TableauDeRecommandations';
import { BusEvenement, Evenement } from '../domaine/BusEvenement';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { ErreurMAC } from '../domaine/erreurMAC';

export type CorpsReponseQuestionATiroir = {
  reponse: string;
  questions: { identifiant: string; reponses: string[] }[];
};
export type CorpsReponseLibre = {
  identifiant: string;
  valeur: string;
};
export type CorpsReponse = {
  chemin: string;
  identifiant: string;
  reponse: string | string[] | CorpsReponseQuestionATiroir | CorpsReponseLibre;
};

export class ServiceDiagnostic {
  constructor(
    private readonly adaptateurReferentiel: Adaptateur<Referentiel>,
    private readonly adaptateurTableauDeRecommandations: Adaptateur<TableauDeRecommandations>,
    private readonly entrepots: Entrepots,
    private readonly busEvenement?: BusEvenement,
  ) {}

  diagnostic = async (id: crypto.UUID): Promise<Diagnostic> =>
    await this.entrepots
      .diagnostic()
      .lis(id)
      .catch((erreur) =>
        Promise.reject(ErreurMAC.cree('Accès diagnostic', erreur)),
      );

  lance = async (): Promise<Diagnostic> => {
    return Promise.all([
      this.adaptateurReferentiel.lis(),
      this.adaptateurTableauDeRecommandations.lis(),
    ])
      .then(async ([ref, rec]) => {
        const diagnostic = initialiseDiagnostic(ref, rec);
        await this.entrepots.diagnostic().persiste(diagnostic);
        await this.busEvenement?.publie<DiagnosticLance>({
          identifiant: diagnostic.identifiant,
          type: 'DIAGNOSTIC_LANCE',
          date: FournisseurHorloge.maintenant(),
          corps: { identifiantDiagnostic: diagnostic.identifiant },
        });
        return diagnostic;
      })
      .catch((erreur) =>
        Promise.reject(ErreurMAC.cree('Lance le diagnostic', erreur)),
      );
  };

  ajouteLaReponse = async (
    id: crypto.UUID,
    corpsReponse: CorpsReponse,
  ): Promise<void> => {
    return this.entrepots
      .diagnostic()
      .lis(id)
      .then((diagnostic) => {
        ajouteLaReponseAuDiagnostic(diagnostic, corpsReponse);
        return diagnostic;
      })
      .then(async (diagnostic) => {
        await this.entrepots.diagnostic().persiste(diagnostic);
        return diagnostic;
      })
      .then(
        (diagnostic) =>
          this.busEvenement?.publie<ReponseAjoutee>({
            identifiant: diagnostic.identifiant,
            type: 'REPONSE_AJOUTEE',
            date: FournisseurHorloge.maintenant(),
            corps: {
              identifiantDiagnostic: diagnostic.identifiant,
              thematique: corpsReponse.chemin,
              identifiantQuestion: corpsReponse.identifiant,
              reponse: corpsReponse.reponse,
            },
          }),
      )
      .catch((erreur) =>
        Promise.reject(ErreurMAC.cree('Ajout réponse au diagnostic', erreur)),
      );
  };

  async termine(id: crypto.UUID) {
    return this.entrepots
      .diagnostic()
      .lis(id)
      .then((diagnostic) => {
        genereLesRecommandations(diagnostic);
        return diagnostic;
      })
      .then(async (diagnostic) => {
        await this.entrepots.diagnostic().persiste(diagnostic);
        return diagnostic;
      })
      .then(
        (diagnostic) =>
          this.busEvenement?.publie<DiagnosticTermine>({
            identifiant: diagnostic.identifiant,
            type: 'DIAGNOSTIC_TERMINE',
            date: FournisseurHorloge.maintenant(),
            corps: { identifiantDiagnostic: diagnostic.identifiant },
          }),
      )
      .catch((erreur) =>
        Promise.reject(ErreurMAC.cree('Termine le diagnostic', erreur)),
      );
  }
}

export type DiagnosticLance = Omit<Evenement, 'corps'> & {
  corps: {
    identifiantDiagnostic: crypto.UUID;
  };
};

type DiagnosticTermine = Omit<Evenement, 'corps'> & {
  corps: {
    identifiantDiagnostic: crypto.UUID;
  };
};

type ReponseAjoutee = Omit<Evenement, 'corps'> & {
  corps: {
    identifiantDiagnostic: crypto.UUID;
    thematique: string;
    identifiantQuestion: string;
    reponse:
      | string
      | string[]
      | CorpsReponseQuestionATiroir
      | CorpsReponseLibre;
  };
};
