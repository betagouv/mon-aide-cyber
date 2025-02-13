import { Aggregat, AggregatNonTrouve } from '../../../domaine/Aggregat';
import { EntrepotEcriture, EntrepotLecture } from '../../../domaine/Entrepot';
import { knex, Knex } from 'knex';
import knexfile from './knexfile';
import crypto from 'crypto';

export type DTO = { id: crypto.UUID };

export type Predicat = {
  colonne: string;
  valeur: string;
};

export abstract class EntrepotLecturePostgres<T extends Aggregat, D extends DTO>
  implements EntrepotLecture<T>
{
  protected readonly knex: Knex;

  constructor(configuration: Knex.Config = knexfile) {
    this.knex = knex(configuration);
  }

  lis(identifiant: string): Promise<T> {
    const requete = this.knex.from(this.nomTable()).where('id', identifiant);
    const predicat = this.predicat();
    if (predicat) {
      requete.andWhere(predicat.colonne, predicat.valeur);
    }
    return requete
      .first()
      .then((ligne: D) =>
        ligne !== undefined
          ? this.deDTOAEntite(ligne)
          : Promise.reject(new AggregatNonTrouve(this.typeAggregat()))
      );
  }

  async tous(): Promise<T[]> {
    const requete = this.knex.from(this.nomTable());
    const predicat = this.predicat();
    if (predicat) {
      requete.andWhere(predicat.colonne, predicat.valeur);
    }
    return (await requete).map((ligne) => this.deDTOAEntite(ligne));
  }

  typeAggregat(): string {
    throw new Error('Non implémenté');
  }

  protected abstract nomTable(): string;

  protected abstract deDTOAEntite(dto: D): T;

  protected predicat(): Predicat | undefined {
    return undefined;
  }
}

export abstract class EntrepotEcriturePostgres<
    T extends Aggregat,
    D extends DTO,
  >
  extends EntrepotLecturePostgres<T, D>
  implements EntrepotEcriture<T>
{
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

  protected abstract champsAMettreAJour(entiteDTO: D): Partial<D>;

  protected abstract deEntiteADTO(entite: T): D;
}
