import { DTO, EntrepotPostgres, Predicat } from './EntrepotPostgres';

import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { AggregatNonTrouve } from '../../../domaine/Aggregat';
import { departements } from '../../../gestion-demandes/departements';
import { secteursActivite } from '../../../espace-aidant/preferences/secteursActivite';
import {
  Aidant,
  EntiteAidant,
  EntrepotAidant,
  TypeEntite,
  typesEntites,
} from '../../../espace-aidant/Aidant';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';

type PreferencesDTO = {
  nomAffichageAnnuaire: string;
  secteursActivite: string[];
  departements: string[];
  typesEntites: string[];
};

type EntiteDTO = {
  nom?: string;
  siret?: string;
  type: string;
};

type DonneesAidant = {
  email: string;
  nomPrenom: string;
  preferences: PreferencesDTO;
  consentementAnnuaire: boolean;
  dateSignatureCGU?: string;
  dateSignatureCharte?: string;
  siret?: string;
  entite?: EntiteDTO;
};

type AidantDTO = DTO & {
  type: 'AIDANT';
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
        nomAffichageAnnuaire: this.chiffrement.dechiffre(
          dto.donnees.preferences.nomAffichageAnnuaire
        ),
      },
      consentementAnnuaire: dto.donnees.consentementAnnuaire,
      ...(dto.donnees.dateSignatureCGU && {
        dateSignatureCGU: FournisseurHorloge.enDate(
          dto.donnees.dateSignatureCGU
        ),
      }),
      ...(dto.donnees.siret && { siret: dto.donnees.siret }),
      ...(dto.donnees.dateSignatureCharte && {
        dateSignatureCharte: FournisseurHorloge.enDate(
          dto.donnees.dateSignatureCharte
        ),
      }),
      ...(dto.donnees.entite && {
        entite: this.entiteAidantEnEntite(dto.donnees.entite),
      }),
    };
  }

  protected deEntiteADTO(entite: Aidant): AidantDTO {
    return {
      id: entite.identifiant,
      type: 'AIDANT',
      donnees: {
        email: this.chiffrement.chiffre(entite.email),
        nomPrenom: this.chiffrement.chiffre(entite.nomPrenom),
        preferences: {
          secteursActivite: entite.preferences.secteursActivite.map(
            (s) => s.nom
          ),
          departements: entite.preferences.departements.map((d) => d.nom),
          typesEntites: entite.preferences.typesEntites.map((t) => t.nom),
          nomAffichageAnnuaire: this.chiffrement.chiffre(
            entite.preferences.nomAffichageAnnuaire
          ),
        },
        consentementAnnuaire: entite.consentementAnnuaire,
        ...(entite.dateSignatureCGU && {
          dateSignatureCGU: entite.dateSignatureCGU.toISOString(),
        }),
        ...(entite.siret && { siret: entite.siret }),
        ...(entite.dateSignatureCharte && {
          dateSignatureCharte: entite.dateSignatureCharte.toISOString(),
        }),
        ...(entite.entite && { entite: this.entiteAidantEnDTO(entite.entite) }),
      },
    };
  }

  private entiteAidantEnDTO(entite: EntiteAidant): EntiteDTO {
    return {
      ...(!!entite.nom && { nom: this.chiffrement.chiffre(entite.nom) }),
      ...(!!entite.siret && { siret: this.chiffrement.chiffre(entite.siret) }),
      type: this.chiffrement.chiffre(entite.type),
    };
  }

  private entiteAidantEnEntite(entite: EntiteDTO): EntiteAidant {
    return {
      ...(!!entite.nom && { nom: this.chiffrement.dechiffre(entite.nom) }),
      ...(!!entite.siret && {
        siret: this.chiffrement.dechiffre(entite.siret),
      }),
      type: this.chiffrement.dechiffre(entite.type) as TypeEntite,
    };
  }

  protected nomTable(): string {
    return 'utilisateurs_mac';
  }

  protected predicat(): Predicat | undefined {
    return { colonne: 'type', valeur: 'AIDANT' };
  }

  typeAggregat(): string {
    return 'aidant';
  }

  rechercheParEmail(email: string): Promise<Aidant> {
    return this.knex
      .from(`${this.nomTable()}`)
      .where('type', 'AIDANT')
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
