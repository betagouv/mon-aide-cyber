import { Aidant } from './Types';
import { Knex, knex } from 'knex';
import knexfile from '../../../infrastructure/entrepots/postgres/knexfile';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import crypto from 'crypto';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';
import { ParametreAidantsSelonNombreDiagnostics } from './commande';

type AidantDTO = {
  id: crypto.UUID;
  donnees: {
    nomPrenom: string;
    email: string;
    dateSignatureCGU?: string;
  };
};

export interface EntrepotAidant {
  rechercheAidantSansDiagnostic(): Promise<Aidant[]>;

  rechercheAidantAyantAuMoinsNDiagnostics(
    nombreDeDiagnostics: number
  ): Promise<Aidant[]>;

  rechercheAidantAyantExactementNDiagnostics(
    nombreDeDiagnostics: number
  ): Promise<Aidant[]>;
}

export class EntrepotAidantPostgres implements EntrepotAidant {
  protected readonly knex: Knex;

  constructor(
    private readonly serviceDeChiffrement: ServiceDeChiffrement,
    configuration: Knex.Config = knexfile
  ) {
    this.knex = knex(configuration);
  }

  rechercheAidantAyantExactementNDiagnostics(
    nombreDeDiagnostics: number
  ): Promise<Aidant[]> {
    return this.rechercheAidantParCritere(
      () => `diags.nb = ${nombreDeDiagnostics}`
    );
  }

  async rechercheAidantSansDiagnostic(): Promise<Aidant[]> {
    const aidantsTrouves = await this.knex
      .raw(
        `
            SELECT *
            FROM utilisateurs_mac
                     LEFT JOIN (SELECT donnees -> 'utilisateur' ->> 'identifiant' as aidant_diag
                                FROM relations
                                WHERE donnees -> 'utilisateur' ->> 'type' = 'aidant') as diags
                               ON diags.aidant_diag::uuid = id
            WHERE diags.aidant_diag IS NULL`
      )
      .then(({ rows }: { rows: AidantDTO[] }) => {
        return rows;
      });
    return aidantsTrouves.map((aidant) => ({
      identifiant: aidant.id,
      nomPrenom: this.serviceDeChiffrement.dechiffre(aidant.donnees.nomPrenom),
      email: this.serviceDeChiffrement.dechiffre(aidant.donnees.email),
      ...(aidant.donnees.dateSignatureCGU && {
        compteCree: FournisseurHorloge.enDate(aidant.donnees.dateSignatureCGU),
      }),
    }));
  }

  async rechercheAidantAyantAuMoinsNDiagnostics(
    nombreMinimumDeDiagnostics: number
  ): Promise<Aidant[]> {
    const critere: () => string = () =>
      `diags.nb >= ${nombreMinimumDeDiagnostics}`;
    return this.rechercheAidantParCritere(critere);
  }

  private async rechercheAidantParCritere(
    critere: () => string
  ): Promise<Aidant[]> {
    return await this.knex
      .raw(
        `
            SELECT *
            FROM utilisateurs_mac
                     JOIN (SELECT count(*)                                   as nb,
                                  donnees -> 'utilisateur' ->> 'identifiant' as aidant_diag
                           FROM relations
                           WHERE donnees -> 'utilisateur' ->> 'type' = 'aidant'
                           GROUP BY donnees -> 'utilisateur' ->> 'identifiant') as diags
                          ON diags.aidant_diag::uuid = id
            WHERE ${critere()}`
      )
      .then(({ rows }: { rows: AidantDTO[] }) => {
        return rows;
      })
      .then((dtos) =>
        dtos.map((aidant) => ({
          identifiant: aidant.id,
          nomPrenom: this.serviceDeChiffrement.dechiffre(
            aidant.donnees.nomPrenom
          ),
          email: this.serviceDeChiffrement.dechiffre(aidant.donnees.email),
          ...(aidant.donnees.dateSignatureCGU && {
            compteCree: FournisseurHorloge.enDate(
              aidant.donnees.dateSignatureCGU
            ),
          }),
        }))
      );
  }
}

export class ExtractionAidantSelonNombreDiagnostics {
  private readonly exports: Map<
    ParametreAidantsSelonNombreDiagnostics,
    () => Promise<Aidant[]>
  >;

  constructor(private readonly entrepotAidantPostgres: EntrepotAidant) {
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
    ]);
  }

  extrais(
    typeExportSouhaite: ParametreAidantsSelonNombreDiagnostics
  ): Promise<Aidant[]> {
    return this.exports.get(typeExportSouhaite)?.() || Promise.resolve([]);
  }
}
