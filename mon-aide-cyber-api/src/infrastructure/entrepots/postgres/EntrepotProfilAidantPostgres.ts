import {
  EntrepotProfilAidant,
  ProfilAidant,
} from '../../../espace-aidant/profil/profilAidant';
import { AggregatNonTrouve } from '../../../domaine/Aggregat';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { DTO } from './EntrepotPostgres';
import { Knex, knex } from 'knex';
import knexfile from './knexfile';

type PreferencesDTO = {
  secteursActivite: string[];
  departements: string[];
  typesEntites: string[];
};

type DonneesUtilisateur = {
  dateSignatureCGU?: string;
  email: string;
  nomPrenom: string;
  preferences: PreferencesDTO;
  consentementAnnuaire: boolean;
};

type ProfilAidantDTO = DTO & {
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

  private deDTOAEntite(dto: ProfilAidantDTO): ProfilAidant {
    return {
      identifiant: dto.id,
      nomPrenom: this.chiffrement.dechiffre(dto.donnees.nomPrenom),
      ...(dto.donnees.dateSignatureCGU && {
        dateSignatureCGU: FournisseurHorloge.enDate(
          dto.donnees.dateSignatureCGU
        ),
      }),
      consentementAnnuaire: dto.donnees.consentementAnnuaire,
      email: this.chiffrement.dechiffre(dto.donnees.email),
    };
  }

  lis(identifiant: string): Promise<ProfilAidant> {
    return this.knex
      .raw(
        `SELECT json_build_object('dateSignatureCGU', u.donnees -> 'dateSignatureCGU', 'email', a.donnees ->> 'email', 'nomPrenom', a.donnees ->> 'nomPrenom', 'preferences', a.donnees -> 'preferences', 'consentementAnnuaire', a.donnees -> 'consentementAnnuaire') as donnees
         FROM utilisateurs u, aidants a
         WHERE u.id = a.id AND u.id = ?;`,
        [identifiant]
      )
      .then(({ rows }: { rows: ProfilAidantDTO[] }) => {
        return rows !== undefined && rows.length > 0
          ? this.deDTOAEntite(rows[0])
          : Promise.reject(new AggregatNonTrouve('profil Aidant'));
      });
  }
}
