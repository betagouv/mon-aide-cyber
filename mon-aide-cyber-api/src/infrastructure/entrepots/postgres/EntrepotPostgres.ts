import crypto from "crypto";
import { Aggregat, AggregatNonTrouve } from '../../../domaine/Aggregat'
import { Entrepot } from "../../../domaine/Entrepot";
import { knex, Knex } from "knex";
import knexfile from "./knexfile";

export abstract class EntrepotPostgres<T extends Aggregat>
  implements Entrepot<T>
{
  private knex: Knex;

  constructor() {
    this.knex = knex(knexfile);
  }

  lis(identifiant: string): Promise<T> {
    return this.knex
      .from(this.nomTable())
      .where("id", identifiant)
      .first()
      .then((ligne: { id: crypto.UUID; donnees: object }) =>
        this.deDTOAEntite(ligne.donnees as DTO),
      )
      .catch(() => {
        throw new AggregatNonTrouve(this.typeAggregat());
      });
  }

  async persiste(entite: T): Promise<void> {
    const entiteDTO = this.deEntiteADTO(entite);
    const entiteExistante = await this.knex
      .from(this.nomTable())
      .where("id", entiteDTO.identifiant)
      .first();
    if (!entiteExistante) {
      await this.knex(this.nomTable()).insert({
        id: entiteDTO.identifiant,
        donnees: entiteDTO,
      });
    } else {
      await this.knex(this.nomTable())
        .where("id", entiteDTO.identifiant)
        .update({ donnees: entiteDTO });
    }
  }

  async tous(): Promise<T[]> {
    const lignes = await this.knex.from(this.nomTable());
    return lignes.map((ligne) => ligne.donnees as T);
  }

  typeAggregat(): string {
    throw new Error("Non implémenté");
  }

  protected abstract nomTable(): string;

  protected abstract deEntiteADTO<D extends DTO>(entite: T): D;

  protected abstract deDTOAEntite<D extends DTO>(dto: D): T;
}

export type DTO = { identifiant: crypto.UUID };
