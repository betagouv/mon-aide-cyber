import { DTO, EntrepotPostgres } from './EntrepotPostgres';

import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { AggregatNonTrouve } from '../../../domaine/Aggregat';
import { departements } from '../../../gestion-demandes/departements';
import { secteursActivite } from '../../../espace-aidant/preferences/secteursActivite';
import {
  Aidant,
  EntrepotAidant,
  typesEntites,
} from '../../../espace-aidant/Aidant';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';

type PreferencesDTO = {
  secteursActivite: string[];
  departements: string[];
  typesEntites: string[];
};

type DonneesAidant = {
  email: string;
  nomPrenom: string;
  preferences: PreferencesDTO;
  consentementAnnuaire: boolean;
  dateSignatureCGU?: string;
};

type AidantDTO = DTO & {
  donnees: DonneesAidant;
};

export class EntrepotAidantPostgres
  extends EntrepotPostgres<Aidant, AidantDTO>
  implements EntrepotAidant
{
  constructor(private readonly chiffrement: ServiceDeChiffrement) {
    super();
  }

  protected champsAMettreAJour(aidantDTO: AidantDTO): Partial<AidantDTO> {
    return { donnees: aidantDTO.donnees };
  }

  protected deDTOAEntite(dto: AidantDTO): Aidant {
    return {
      identifiant: dto.id,
      email: this.chiffrement.dechiffre(dto.donnees.email),
      nomPrenom: this.chiffrement.dechiffre(dto.donnees.nomPrenom),
      preferences: {
        secteursActivite: secteursActivite.filter(
          (s) =>
            dto.donnees.preferences.secteursActivite.filter((d) => d === s.nom)
              .length > 0
        ),
        departements: departements.filter(
          (dep) =>
            dto.donnees.preferences.departements.filter((d) => d === dep.nom)
              .length > 0
        ),
        typesEntites: typesEntites.filter(
          (t) =>
            dto.donnees.preferences.typesEntites.filter((d) => d === t.nom)
              .length > 0
        ),
      },
      consentementAnnuaire: dto.donnees.consentementAnnuaire,
      ...(dto.donnees.dateSignatureCGU && {
        dateSignatureCGU: FournisseurHorloge.enDate(
          dto.donnees.dateSignatureCGU
        ),
      }),
    };
  }

  protected deEntiteADTO(entite: Aidant): AidantDTO {
    return {
      id: entite.identifiant,
      donnees: {
        email: this.chiffrement.chiffre(entite.email),
        nomPrenom: this.chiffrement.chiffre(entite.nomPrenom),
        preferences: {
          secteursActivite: entite.preferences.secteursActivite.map(
            (s) => s.nom
          ),
          departements: entite.preferences.departements.map((d) => d.nom),
          typesEntites: entite.preferences.typesEntites.map((t) => t.nom),
        },
        consentementAnnuaire: entite.consentementAnnuaire,
        ...(entite.dateSignatureCGU && {
          dateSignatureCGU: entite.dateSignatureCGU.toISOString(),
        }),
      },
    };
  }

  protected nomTable(): string {
    return 'utilisateurs_mac';
  }

  typeAggregat(): string {
    return 'aidant';
  }

  rechercheParEmail(email: string): Promise<Aidant> {
    return this.knex
      .from(`${this.nomTable()}`)
      .then((aidants: AidantDTO[]) =>
        aidants.find(
          (a) => this.chiffrement.dechiffre(a.donnees.email) === email
        )
      )
      .then((ligne) => {
        if (!ligne) {
          return Promise.reject(new AggregatNonTrouve(this.typeAggregat()));
        }
        return this.deDTOAEntite(ligne);
      });
  }
}
