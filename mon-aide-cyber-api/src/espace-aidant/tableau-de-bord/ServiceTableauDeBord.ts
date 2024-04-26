import { AdaptateurRelations } from '../../relation/AdaptateurRelations';
import crypto from 'crypto';
import { ServiceDiagnostic } from '../../diagnostic/ServiceDiagnostic';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

export type Diagnostic = {
  dateCreation: string;
  identifiant: string;
  secteurActivite: string | 'non renseigné';
  zoneGeographique: string | 'non renseigné';
};

export class ServiceTableauDeBord {
  constructor(
    private readonly adaptateurRelation: AdaptateurRelations,
    private readonly serviceDiagnostic: ServiceDiagnostic,
  ) {}

  async diagnosticsInitiesPar(
    identifiantAidant: crypto.UUID,
  ): Promise<Diagnostic[]> {
    const identifiantDiagnosticsLie =
      await this.adaptateurRelation.diagnosticsInitiePar(identifiantAidant);

    const contextes = identifiantDiagnosticsLie.map(
      async (identifiantDiagnostic) => {
        const contexte = await this.serviceDiagnostic.contexte(
          identifiantDiagnostic as crypto.UUID,
        );
        return { ...contexte, identifiantDiagnostic };
      },
    );

    return Promise.all(contextes)
      .then((contextes) =>
        contextes.sort((contexte1, contexte2) =>
          contexte1.dateCreation > contexte2.dateCreation ? -1 : 1,
        ),
      )
      .then((contextes) =>
        contextes.map(
          (contexte) =>
            ({
              dateCreation: FournisseurHorloge.formateDate(
                contexte.dateCreation,
              ).date,
              identifiant: contexte.identifiantDiagnostic,
              secteurActivite: contexte.secteurActivite || 'non renseigné',
              zoneGeographique: contexte.departement
                ? contexte.departement
                : 'non renseigné',
            }) as Diagnostic,
        ),
      );
  }
}
