import {
  EntrepotStatistiquesUtilisateurInscrit,
  StatistiquesUtilisateurInscrit,
} from '../../../statistiques/utilisateur-inscrit/StatistiquesUtilisateurInscrit';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import knexfile from './knexfile';
import knex, { Knex } from 'knex';
import crypto from 'crypto';

type UtilisateurInscritDTO = {
  id: crypto.UUID;
  donnees: {
    nomPrenom: string;
    email: string;
  };
  nb: string;
};

export class EntrepotStatistiquesUtilisateursInscritsPostgres
  implements EntrepotStatistiquesUtilisateurInscrit
{
  protected readonly knex: Knex;

  constructor(
    private readonly serviceDeChiffrement: ServiceDeChiffrement,
    configuration: Knex.Config = knexfile
  ) {
    this.knex = knex(configuration);
  }

  async rechercheUtilisateursInscritsAvecNombreDeDiagnostics(): Promise<
    StatistiquesUtilisateurInscrit[]
  > {
    const utilisateursTrouves = await this.knex
      .raw(
        `
            SELECT *
            FROM utilisateurs_mac
                     LEFT JOIN (SELECT count(*)                                   as nb,
                                       donnees -> 'utilisateur' ->> 'identifiant' as aidant_diag
                                FROM relations
                                WHERE donnees -> 'utilisateur' ->> 'type' = 'utilisateurInscrit'
                                GROUP BY donnees -> 'utilisateur' ->> 'identifiant') as diags
                               ON diags.aidant_diag::uuid = id
            WHERE type = 'UTILISATEUR_INSCRIT'`
      )
      .then(({ rows }: { rows: UtilisateurInscritDTO[] }) => {
        return rows;
      })
      .then((dtos) =>
        dtos.map((utilisateur) => ({
          identifiant: utilisateur.id,
          nomPrenom: this.serviceDeChiffrement.dechiffre(
            utilisateur.donnees.nomPrenom
          ),
          email: this.serviceDeChiffrement.dechiffre(utilisateur.donnees.email),
          nombreDiagnostics: parseInt(utilisateur.nb) || 0,
        }))
      );
    return utilisateursTrouves.map((utilisateur) => ({
      identifiant: utilisateur.identifiant,
      nombreDiagnostics: utilisateur.nombreDiagnostics,
      nomPrenom: utilisateur.nomPrenom,
      email: utilisateur.email,
    }));
  }
}
