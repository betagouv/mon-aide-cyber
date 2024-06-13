import { Aggregat, AggregatNonTrouve } from '../../../domaine/Aggregat';
import { Entrepot } from '../../../domaine/Entrepot';
import { knex, Knex } from 'knex';
import knexfile from './knexfile';
import crypto from 'crypto';

export type DTO = { id: crypto.UUID };

export abstract class EntrepotPostgres<T extends Aggregat, D extends DTO>
  implements Entrepot<T>
{
  protected readonly knex: Knex;

  constructor(configuration: Knex.Config = knexfile) {
    this.knex = knex(configuration);
  }

  lis(identifiant: string): Promise<T> {
    return this.knex
      .from(this.nomTable())
      .where('id', identifiant)
      .first()
      .then((ligne: D) =>
        ligne !== undefined
          ? this.deDTOAEntite(ligne)
          : Promise.reject(new AggregatNonTrouve(this.typeAggregat()))
      );
  }

  async persiste(entite: T): Promise<void> {
    const entiteDTO = this.deEntiteADTO(entite);
    const entiteExistante = await this.knex
      .from(this.nomTable())
      .where('id', entiteDTO.id)
      .first();
    if (!entiteExistante) {
      await this.knex.insert(entiteDTO).into(this.nomTable());
    } else {
      await this.knex(this.nomTable())
        .where('id', entiteDTO.id)
        .update(this.champsAMettreAJour(entiteDTO));
    }
  }

  async tous(): Promise<T[]> {
    const lignes = await this.knex.from(this.nomTable());
    return lignes.map((ligne) => this.deDTOAEntite(ligne));
  }

  typeAggregat(): string {
    throw new Error('Non implémenté');
  }

  protected abstract champsAMettreAJour(entiteDTO: D): Partial<D>;

  protected abstract nomTable(): string;

  protected abstract deEntiteADTO(entite: T): D;

  protected abstract deDTOAEntite(dto: D): T;
}
