import {
  EntrepotProfilAidant,
  ProfilAidant,
} from '../../../espace-aidant/profil/profilAidant';
import { AggregatNonTrouve } from '../../../domaine/Aggregat';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { DTO } from './EntrepotPostgres';
import { DonneesUtilisateur } from './EntrepotAidantPostgres';
import { Knex, knex } from 'knex';
import knexfile from './knexfile';

type ProfilAidantDTO = DTO & {
  type: 'AIDANT';
  donnees: DonneesUtilisateur;
};

export class EntrepotProfilAidantPostgres implements EntrepotProfilAidant {
  private readonly knex: Knex;

  constructor(
    private readonly chiffrement: ServiceDeChiffrement,
    configuration: Knex.Config = knexfile
  ) {
    this.knex = knex(configuration);
  }

  protected deDTOAEntite(dto: ProfilAidantDTO): ProfilAidant {
    return {
      identifiant: dto.id,
      nomPrenom: this.chiffrement.dechiffre(dto.donnees.nomPrenom),
      ...(dto.donnees.dateSignatureCGU && {
        dateSignatureCGU: FournisseurHorloge.enDate(
          dto.donnees.dateSignatureCGU
        ),
      }),
      consentementAnnuaire: dto.donnees.consentementAnnuaire,
      email: this.chiffrement.dechiffre(dto.donnees.identifiantConnexion),
    };
  }

  lis(identifiant: string): Promise<ProfilAidant> {
    return this.knex
      .from('utilisateurs')
      .where('id', identifiant)
      .first()
      .then((ligne) =>
        ligne !== undefined
          ? this.deDTOAEntite(ligne)
          : Promise.reject(new AggregatNonTrouve('profil Aidant'))
      );
  }
}
