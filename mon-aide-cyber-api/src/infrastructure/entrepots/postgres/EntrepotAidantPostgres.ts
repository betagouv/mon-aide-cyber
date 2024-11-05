import { DTO, EntrepotPostgres } from './EntrepotPostgres';

import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { AggregatNonTrouve } from '../../../domaine/Aggregat';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';
import { departements } from '../../../gestion-demandes/departements';
import { secteursActivite } from '../../../espace-aidant/preferences/secteursActivite';
import {
  Aidant,
  EntrepotAidant,
  typesEntites,
} from '../../../espace-aidant/Aidant';

type PreferencesDTO = {
  secteursActivite: string[];
  departements: string[];
  typesEntites: string[];
};

export type DonneesUtilisateur = {
  dateSignatureCharte?: string;
  dateSignatureCGU?: string;
  identifiantConnexion: string;
  nomPrenom: string;
  motDePasse: string;
  preferences: PreferencesDTO;
  consentementAnnuaire: boolean;
};

type AidantDTO = DTO & {
  type: 'AIDANT';
  donnees: DonneesUtilisateur;
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
      identifiantConnexion: this.chiffrement.dechiffre(
        dto.donnees.identifiantConnexion
      ),
      motDePasse: this.chiffrement.dechiffre(dto.donnees.motDePasse),
      nomPrenom: this.chiffrement.dechiffre(dto.donnees.nomPrenom),
      ...(dto.donnees.dateSignatureCGU && {
        dateSignatureCGU: FournisseurHorloge.enDate(
          dto.donnees.dateSignatureCGU
        ),
      }),
      ...(dto.donnees.dateSignatureCharte && {
        dateSignatureCharte: FournisseurHorloge.enDate(
          dto.donnees.dateSignatureCharte
        ),
      }),
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
    };
  }

  protected deEntiteADTO(entite: Aidant): AidantDTO {
    return {
      id: entite.identifiant,
      type: 'AIDANT',
      donnees: {
        identifiantConnexion: this.chiffrement.chiffre(
          entite.identifiantConnexion
        ),
        motDePasse: this.chiffrement.chiffre(entite.motDePasse),
        nomPrenom: this.chiffrement.chiffre(entite.nomPrenom),
        ...(entite.dateSignatureCGU && {
          dateSignatureCGU: entite.dateSignatureCGU.toISOString(),
        }),
        ...(entite.dateSignatureCharte && {
          dateSignatureCharte: entite.dateSignatureCharte.toISOString(),
        }),
        preferences: {
          secteursActivite: entite.preferences.secteursActivite.map(
            (s) => s.nom
          ),
          departements: entite.preferences.departements.map((d) => d.nom),
          typesEntites: entite.preferences.typesEntites.map((t) => t.nom),
        },
        consentementAnnuaire: entite.consentementAnnuaire,
      },
    };
  }

  protected nomTable(): string {
    return 'utilisateurs';
  }

  typeAggregat(): string {
    return 'aidant';
  }

  rechercheParIdentifiantDeConnexion(
    identifiantConnexion: string
  ): Promise<Aidant> {
    return this.knex
      .from(`${this.nomTable()}`)
      .where({ type: 'AIDANT' })
      .then((aidants: AidantDTO[]) =>
        aidants.find(
          (a) =>
            this.chiffrement.dechiffre(a.donnees.identifiantConnexion) ===
            identifiantConnexion
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
