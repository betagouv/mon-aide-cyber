import { Aidant } from './Types';
import { Knex, knex } from 'knex';
import knexfile from '../../../infrastructure/entrepots/postgres/knexfile';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import crypto from 'crypto';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';
import { ParametreAidantsSelonNombreDiagnostics } from './commande';

type UtilisateurDTO = {
  id: crypto.UUID;
  donnees: {
    nomPrenom: string;
    identifiantConnexion: string;
    dateSignatureCGU?: string;
  };
};

type AidantDTO = {
  id: crypto.UUID;
  donnees: {
    nomPrenom: string;
    email: string;
  };
};

export interface EntrepotAidant {
  rechercheAidantSansDiagnostic(): Promise<Aidant[]>;

  rechercheAidantAyantAuMoinsNDiagnostics(
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

  async rechercheAidantSansDiagnostic(): Promise<Aidant[]> {
    const aidantsTrouves = await this.knex
      .raw(
        `
          SELECT *
          FROM utilisateurs
                   LEFT JOIN (SELECT donnees -> 'utilisateur' ->> 'identifiant' as aidant_diag
                              FROM relations
                              WHERE donnees -> 'utilisateur' ->> 'type' = 'aidant') as diags
                             ON diags.aidant_diag::uuid = id
          WHERE diags.aidant_diag IS NULL`
      )
      .then(({ rows }: { rows: UtilisateurDTO[] }) => {
        return rows;
      });
    return aidantsTrouves.map((aidant) => ({
      identifiant: aidant.id,
      nomPrenom: this.serviceDeChiffrement.dechiffre(aidant.donnees.nomPrenom),
      email: this.serviceDeChiffrement.dechiffre(
        aidant.donnees.identifiantConnexion
      ),
      ...(aidant.donnees.dateSignatureCGU && {
        compteCree: FournisseurHorloge.enDate(aidant.donnees.dateSignatureCGU),
      }),
    }));
  }

  async rechercheAidantAyantAuMoinsNDiagnostics(
    nombreMinimumDeDiagnostics: number
  ): Promise<Aidant[]> {
    const aidantsTrouves = await this.knex
      .raw(
        `
          SELECT *
          FROM utilisateurs_mac
                   JOIN (SELECT count(*) as nb,
                                donnees -> 'utilisateur' ->> 'identifiant' as aidant_diag
                         FROM relations
                         WHERE donnees -> 'utilisateur' ->> 'type' = 'aidant'
                         GROUP BY donnees -> 'utilisateur' ->> 'identifiant') as diags
                        ON diags.aidant_diag::uuid = id
          WHERE diags.nb >= ${nombreMinimumDeDiagnostics}`
      )
      .then(({ rows }: { rows: AidantDTO[] }) => {
        return rows;
      });
    return aidantsTrouves.map((aidant) => ({
      identifiant: aidant.id,
      nomPrenom: this.serviceDeChiffrement.dechiffre(aidant.donnees.nomPrenom),
      email: this.serviceDeChiffrement.dechiffre(aidant.donnees.email),
    }));
  }
}

export class ExtractionAidantSelonNombreDiagnostics {
  constructor(private readonly entrepotAidantPostgres: EntrepotAidant) {}

  extrais(
    typeExportSouhaite: ParametreAidantsSelonNombreDiagnostics
  ): Promise<Aidant[]> {
    switch (typeExportSouhaite) {
      case 'AU_MOINS_DEUX_DIAGNOSTICS':
        return this.entrepotAidantPostgres.rechercheAidantAyantAuMoinsNDiagnostics(
          2
        );
      case 'AU_MOINS_CINQ_DIAGNOSTICS':
        return this.entrepotAidantPostgres.rechercheAidantAyantAuMoinsNDiagnostics(
          5
        );
      case 'SANS_DIAGNOSTIC':
        return this.entrepotAidantPostgres.rechercheAidantSansDiagnostic();
    }
  }
}
