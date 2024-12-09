import { AdaptateurRelations } from '../../relation/AdaptateurRelations';
import crypto, { UUID } from 'crypto';
import { ServiceDiagnostic } from '../../diagnostic/ServiceDiagnostic';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { isAfter } from 'date-fns';

export type Diagnostic = {
  dateCreation: string;
  identifiant: string;
  secteurActivite: string | 'non renseigné';
  secteurGeographique: string | 'non renseigné';
};

export class ServiceTableauDeBord {
  constructor(
    private readonly adaptateurRelation: AdaptateurRelations,
    private readonly serviceDiagnostic: ServiceDiagnostic
  ) {}

  async diagnosticsInitiesPar(
    identifiantAidant: crypto.UUID
  ): Promise<Diagnostic[]> {
    const identifiantDiagnosticsLie =
      await this.adaptateurRelation.identifiantsObjetsLiesAUtilisateur(
        identifiantAidant
      );

    return this.serviceDiagnostic
      .contextes(identifiantDiagnosticsLie as UUID[])
      .then((diagnostics) => {
        const resultat: Diagnostic[] = [];
        const tousLesDiagnostics = Object.entries(diagnostics);
        tousLesDiagnostics.sort(([, contexte1], [, contexte2]) =>
          isAfter(contexte1.dateCreation, contexte2.dateCreation) ? -1 : 1
        );
        for (const [id, contexte] of tousLesDiagnostics) {
          resultat.push({
            dateCreation: FournisseurHorloge.formateDate(contexte.dateCreation)
              .date,
            identifiant: id,
            secteurActivite: contexte.secteurActivite || 'non renseigné',
            secteurGeographique: contexte.departement || 'non renseigné',
          } as Diagnostic);
        }
        console.log('RES', resultat);
        return resultat;
      });
  }
}
