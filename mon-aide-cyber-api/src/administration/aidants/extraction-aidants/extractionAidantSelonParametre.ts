import { ParametreExtraction } from './commande';

import {
  EntrepotStatistiquesAidant,
  StatistiquesAidant,
} from '../../../statistiques/aidant/StastistiquesAidant';
import crypto from 'crypto';

export type StatistiquesAidantDTO = {
  identifiant: crypto.UUID;
  email: string;
  nomPrenom: string;
  compteCree?: Date;
  nombreDiagnostics?: number;
};

export class ExtractionAidantSelonParametre {
  private readonly exports: Map<
    ParametreExtraction,
    () => Promise<StatistiquesAidantDTO[]>
  >;

  constructor(
    private readonly entrepotAidantPostgres: EntrepotStatistiquesAidant
  ) {
    const mappe = (
      statistiques: StatistiquesAidant[]
    ): StatistiquesAidantDTO[] =>
      statistiques.map((stat) => ({
        identifiant: stat.identifiant,
        ...(stat.compteCree && { compteCree: stat.compteCree }),
        email: stat.email,
        nomPrenom: stat.nomPrenom,
        ...(stat.nombreDiagnostics && {
          nombreDiagnostics: stat.nombreDiagnostics,
        }),
      }));
    const mappeAvecLeNombreDeDiagnostics = (
      statistiques: StatistiquesAidant[]
    ): StatistiquesAidantDTO[] =>
      statistiques.map((stat) => ({
        identifiant: stat.identifiant,
        ...(stat.compteCree && { compteCree: stat.compteCree }),
        email: stat.email,
        nomPrenom: stat.nomPrenom,
        nombreDiagnostics: stat.nombreDiagnostics || 0,
      }));

    this.exports = new Map([
      [
        'EXACTEMENT_UN_DIAGNOSTIC',
        () =>
          this.entrepotAidantPostgres
            .rechercheAidantAyantExactementNDiagnostics(1)
            .then((statistiques) => mappe(statistiques)),
      ],
      [
        'AU_MOINS_DEUX_DIAGNOSTICS',
        () =>
          this.entrepotAidantPostgres
            .rechercheAidantAyantAuMoinsNDiagnostics(2)
            .then((statistiques) => mappe(statistiques)),
      ],
      [
        'AU_MOINS_CINQ_DIAGNOSTICS',
        () =>
          this.entrepotAidantPostgres
            .rechercheAidantAyantAuMoinsNDiagnostics(5)
            .then((statistiques) => mappe(statistiques)),
      ],
      [
        'SANS_DIAGNOSTIC',
        () =>
          this.entrepotAidantPostgres
            .rechercheAidantSansDiagnostic()
            .then((statistiques) => mappe(statistiques)),
      ],
      [
        'NOMBRE_DIAGNOSTICS',
        () =>
          this.entrepotAidantPostgres
            .rechercheAidantAvecNombreDeDiagnostics()
            .then((statistiques) =>
              mappeAvecLeNombreDeDiagnostics(statistiques)
            ),
      ],
    ]);
  }

  extrais(
    typeExportSouhaite: ParametreExtraction
  ): Promise<StatistiquesAidantDTO[]> {
    return this.exports.get(typeExportSouhaite)?.() || Promise.resolve([]);
  }
}
