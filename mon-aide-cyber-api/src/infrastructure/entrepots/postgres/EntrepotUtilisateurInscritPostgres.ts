import { DTO, EntrepotPostgres, Predicat } from './EntrepotPostgres';
import {
  EntrepotUtilisateurInscrit,
  UtilisateurInscrit,
} from '../../../espace-utilisateur-inscrit/UtilisateurInscrit';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';

export type EntiteUtilisateurInscritDTO = {
  siret?: string;
};

type DonneesUtilisateurInscrit = {
  email: string;
  nomPrenom: string;
  dateSignatureCGU?: string;
  entite?: EntiteUtilisateurInscritDTO;
};

type UtilisateurInscritDTO = DTO & {
  type: 'UTILISATEUR_INSCRIT';
  donnees: DonneesUtilisateurInscrit;
};

export class EntrepotUtilisateurInscritPostgres
  extends EntrepotPostgres<UtilisateurInscrit, UtilisateurInscritDTO>
  implements EntrepotUtilisateurInscrit
{
  constructor(private readonly chiffrement: ServiceDeChiffrement) {
    super();
  }

  protected deEntiteADTO(entite: UtilisateurInscrit): UtilisateurInscritDTO {
    return {
      donnees: {
        email: this.chiffrement.chiffre(entite.email),
        nomPrenom: this.chiffrement.chiffre(entite.nomPrenom),
        ...(entite.dateSignatureCGU && {
          dateSignatureCGU: entite.dateSignatureCGU?.toISOString(),
        }),
        ...(entite.entite && {
          entite: {
            ...(entite.entite.siret && { siret: entite.entite.siret }),
          },
        }),
      },
      id: entite.identifiant,
      type: 'UTILISATEUR_INSCRIT',
    };
  }

  protected deDTOAEntite(dto: UtilisateurInscritDTO): UtilisateurInscrit {
    return {
      ...(dto.donnees.dateSignatureCGU && {
        dateSignatureCGU: FournisseurHorloge.enDate(
          dto.donnees.dateSignatureCGU
        ),
      }),
      email: this.chiffrement.dechiffre(dto.donnees.email),
      ...(dto.donnees.entite && {
        entite: {
          ...(dto.donnees.entite.siret && { siret: dto.donnees.entite.siret }),
        },
      }),
      identifiant: dto.id,
      nomPrenom: this.chiffrement.dechiffre(dto.donnees.nomPrenom),
    };
  }

  protected champsAMettreAJour(
    entiteDTO: UtilisateurInscritDTO
  ): Partial<UtilisateurInscritDTO> {
    return { donnees: entiteDTO.donnees, type: entiteDTO.type };
  }

  protected nomTable(): string {
    return 'utilisateurs_mac';
  }

  typeAggregat(): string {
    return 'utilisateur inscrit';
  }

  protected predicat(): Predicat | undefined {
    return { colonne: 'type', valeur: 'UTILISATEUR_INSCRIT' };
  }
}
