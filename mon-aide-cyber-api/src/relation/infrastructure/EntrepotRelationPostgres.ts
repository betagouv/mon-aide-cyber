import { Objet, Relation, Tuple, Utilisateur } from '../Tuple';
import { Entrepot, EntrepotRelation } from '../EntrepotRelation';
import crypto from 'crypto';
import { knex, Knex } from 'knex';
import { Aggregat } from '../Aggregat';
import knexfile from '../../infrastructure/entrepots/postgres/knexfile';

export type DonneesRelation = {
  objet: Objet;
  relation: Relation;
  utilisateur: Utilisateur;
};
export type TupleDTO = DTO & {
  donnees: DonneesRelation;
};

export type DTO = { id: crypto.UUID };

export abstract class EntrepotPostgres<T extends Aggregat, D extends DTO>
  implements Entrepot<T>
{
  protected readonly knex: Knex;

  constructor(configuration: Knex.Config = knexfile) {
    this.knex = knex(configuration);
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

  typeAggregat(): string {
    throw new Error('Non implémenté');
  }

  protected abstract champsAMettreAJour(entiteDTO: D): Partial<D>;

  protected abstract nomTable(): string;

  protected abstract deEntiteADTO(entite: T): D;
}

export class EntrepotRelationPostgres
  extends EntrepotPostgres<Tuple, TupleDTO>
  implements EntrepotRelation
{
  protected champsAMettreAJour(_: TupleDTO): Partial<TupleDTO> {
    throw new Error('non implémenté');
  }
  protected deDTOAEntite(dto: TupleDTO): Tuple {
    return {
      identifiant: dto.id,
      objet: dto.donnees.objet,
      relation: dto.donnees.relation,
      utilisateur: dto.donnees.utilisateur,
    };
  }

  protected deEntiteADTO(entite: Tuple): TupleDTO {
    return {
      id: entite.identifiant,
      donnees: {
        objet: entite.objet,
        relation: entite.relation,
        utilisateur: entite.utilisateur,
      },
    };
  }

  protected nomTable(): string {
    return 'relations';
  }

  trouveObjetsLiesAUtilisateur(identifiant: string): Promise<Tuple[]> {
    return this.knex
      .from(this.nomTable())
      .whereRaw(
        "(donnees->'utilisateur'->>'identifiant')::uuid = ?",
        identifiant
      )
      .select(`${this.nomTable()}.*`)
      .then((lignes: TupleDTO[]) =>
        lignes.map((ligne) => this.deDTOAEntite(ligne))
      );
  }

  typeRelationExiste(_relation: string, _objet: Objet): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  relationExiste(
    relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet
  ): Promise<boolean> {
    return this.knex
      .from(this.nomTable())
      .whereRaw("(donnees->'utilisateur') @> :utilisateur", { utilisateur })
      .andWhereRaw("(donnees->>'relation') = ?", relation)
      .andWhereRaw("(donnees->'objet') @> :objet", { objet })
      .select(`${this.nomTable()}.*`)
      .then((lignes) => lignes.length > 0);
  }
}
