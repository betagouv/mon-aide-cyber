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

    const formateZoneGeographique = (
      region: string | undefined,
      departement: string | undefined,
    ) => {
      return ''
        .concat(!departement && !region ? 'non renseigné' : '')
        .concat(region || '')
        .concat(
          region && departement
            ? ' / '.concat(departement || '')
            : departement || '',
        );
    };

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
          zoneGeographique: formateZoneGeographique(
            contexte.region,
            contexte.departement,
          ),
        };
      }),
    );
  }
}
