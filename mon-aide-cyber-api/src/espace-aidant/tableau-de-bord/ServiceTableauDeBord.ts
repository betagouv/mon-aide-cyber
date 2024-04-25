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

    return Promise.all(
      identifiantDiagnosticsLie.map(async (identifiantDiagnostic) => {
        const contexte = await this.serviceDiagnostic.contexte(
          identifiantDiagnostic as crypto.UUID,
        );

        return {
          dateCreation: FournisseurHorloge.formateDate(contexte.dateCreation)
            .date,
          identifiant: identifiantDiagnostic,
          secteurActivite: contexte.secteurActivite || 'non renseigné',
          zoneGeographique: contexte.departement
            ? contexte.departement
            : 'non renseigné',
        };
      }),
    );
  }
}
