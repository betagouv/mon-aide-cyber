import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import knexfile from './knexfile';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';
import crypto from 'crypto';
import { Knex, knex } from 'knex';
import {
  StatistiquesAidant,
  EntrepotStatistiquesAidant,
} from '../../../statistiques/aidant/StastistiquesAidant';
import { rechercheParNomDepartement } from '../../../gestion-demandes/departements';

type PreferencesDTO = {
  departements: string[];
};

type EntiteDTO = {
  nom?: string;
};

type AidantDTO = {
  id: crypto.UUID;
  donnees: {
    nomPrenom: string;
    email: string;
    dateSignatureCGU?: string;
    preferences: PreferencesDTO;
    entite?: EntiteDTO;
  };
  nb: string;
};

export class EntrepotStatistiquesAidantPostgres
  implements EntrepotStatistiquesAidant
{
  protected readonly knex: Knex;

  constructor(
    private readonly serviceDeChiffrement: ServiceDeChiffrement,
    configuration: Knex.Config = knexfile
  ) {
    this.knex = knex(configuration);
  }

  rechercheAidantAvecNombreDeDiagnostics(): Promise<StatistiquesAidant[]> {
    return this.rechercheAidantParCritere(() => `1 = 1`, true);
  }

  rechercheAidantAyantExactementNDiagnostics(
    nombreDeDiagnostics: number
  ): Promise<StatistiquesAidant[]> {
    return this.rechercheAidantParCritere(
      () => `diags.nb = ${nombreDeDiagnostics}`
    );
  }

  async rechercheAidantSansDiagnostic(): Promise<StatistiquesAidant[]> {
    const aidantsTrouves = await this.knex
      .raw(
        `
            SELECT *
            FROM utilisateurs_mac
                     LEFT JOIN (SELECT donnees -> 'utilisateur' ->> 'identifiant' as aidant_diag
                                FROM relations
                                WHERE donnees -> 'utilisateur' ->> 'type' = 'aidant') as diags
                               ON diags.aidant_diag::uuid = id
            WHERE type = 'AIDANT' AND diags.aidant_diag IS NULL`
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
      entite: aidant.donnees.entite?.nom
        ? this.serviceDeChiffrement.dechiffre(aidant.donnees.entite.nom)
        : '',
      departements: aidant.donnees.preferences.departements.map((d) =>
        rechercheParNomDepartement(d)
      ),
    }));
  }

  async rechercheAidantAyantAuMoinsNDiagnostics(
    nombreMinimumDeDiagnostics: number
  ): Promise<StatistiquesAidant[]> {
    const critere: () => string = () =>
      `diags.nb >= ${nombreMinimumDeDiagnostics}`;
    return this.rechercheAidantParCritere(critere);
  }

  private async rechercheAidantParCritere(
    critere: () => string,
    afficherNombreDiagnostics = false
  ): Promise<StatistiquesAidant[]> {
    return await this.knex
      .raw(
        `
            SELECT *
            FROM utilisateurs_mac
                     LEFT JOIN (SELECT count(*)                                   as nb,
                                       donnees -> 'utilisateur' ->> 'identifiant' as aidant_diag
                                FROM relations
                                WHERE donnees -> 'utilisateur' ->> 'type' = 'aidant'
                                GROUP BY donnees -> 'utilisateur' ->> 'identifiant') as diags
                               ON diags.aidant_diag::uuid = id
            WHERE type = 'AIDANT' AND ${critere()}`
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
          ...(afficherNombreDiagnostics && {
            nombreDiagnostics: parseInt(aidant.nb) || 0,
          }),
          ...(aidant.donnees.dateSignatureCGU && {
            compteCree: FournisseurHorloge.enDate(
              aidant.donnees.dateSignatureCGU
            ),
          }),
          entite: aidant.donnees.entite?.nom
            ? this.serviceDeChiffrement.dechiffre(aidant.donnees.entite.nom)
            : '',
          departements: aidant.donnees.preferences.departements.map((d) =>
            rechercheParNomDepartement(d)
          ),
        }))
      );
  }
}
