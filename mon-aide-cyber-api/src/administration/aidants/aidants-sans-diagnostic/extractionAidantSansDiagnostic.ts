import { Aidant } from './Types';
import { Knex, knex } from 'knex';
import knexfile from '../../../infrastructure/entrepots/postgres/knexfile';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import crypto from 'crypto';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';

type AidantDTO = {
  identifiant: crypto.UUID;
  donnees: {
    nomPrenom: string;
    identifiantConnexion: string;
    dateSignatureCGU?: string;
  };
};

export interface EntrepotAidant {
  rechercheAidantSansDiagnostic(): Promise<Aidant[]>;
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
      .then(({ rows }: { rows: AidantDTO[] }) => {
        return rows;
      });
    return aidantsTrouves.map((aidant) => ({
      identifiant: aidant.identifiant,
      nomPrenom: this.serviceDeChiffrement.dechiffre(aidant.donnees.nomPrenom),
      email: this.serviceDeChiffrement.dechiffre(
        aidant.donnees.identifiantConnexion
      ),
      ...(aidant.donnees.dateSignatureCGU && {
        compteCree: FournisseurHorloge.enDate(aidant.donnees.dateSignatureCGU),
      }),
    }));
  }
}

export class ExtractionAidantSansDiagnostic {
  constructor(private readonly entrepotAidantPostgres: EntrepotAidant) {}

  extrais(): Promise<Aidant[]> {
    return this.entrepotAidantPostgres.rechercheAidantSansDiagnostic();
  }
}
