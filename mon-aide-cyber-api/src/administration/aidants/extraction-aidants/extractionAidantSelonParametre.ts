import { ParametreExtraction } from './commande';

import {
  Aidant,
  EntrepotStatistiquesAidant,
} from '../../../statistiques/aidant/StastistiquesAidant';

export class ExtractionAidantSelonParametre {
  private readonly exports: Map<ParametreExtraction, () => Promise<Aidant[]>>;

  constructor(
    private readonly entrepotAidantPostgres: EntrepotStatistiquesAidant
  ) {
    this.exports = new Map([
      [
        'EXACTEMENT_UN_DIAGNOSTIC',
        () =>
          this.entrepotAidantPostgres.rechercheAidantAyantExactementNDiagnostics(
            1
          ),
      ],
      [
        'AU_MOINS_DEUX_DIAGNOSTICS',
        () =>
          this.entrepotAidantPostgres.rechercheAidantAyantAuMoinsNDiagnostics(
            2
          ),
      ],
      [
        'AU_MOINS_CINQ_DIAGNOSTICS',
        () =>
          this.entrepotAidantPostgres.rechercheAidantAyantAuMoinsNDiagnostics(
            5
          ),
      ],
      [
        'SANS_DIAGNOSTIC',
        () => this.entrepotAidantPostgres.rechercheAidantSansDiagnostic(),
      ],
      [
        'NOMBRE_DIAGNOSTICS',
        () =>
          this.entrepotAidantPostgres.rechercheAidantAvecNombreDeDiagnostics(),
      ],
    ]);
  }

  extrais(typeExportSouhaite: ParametreExtraction): Promise<Aidant[]> {
    return this.exports.get(typeExportSouhaite)?.() || Promise.resolve([]);
  }
}
