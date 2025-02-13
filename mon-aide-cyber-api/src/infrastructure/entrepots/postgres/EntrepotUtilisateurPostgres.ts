import { DTO, EntrepotEcriturePostgres } from './EntrepotPostgres';
import {
  EntrepotUtilisateur,
  Utilisateur,
} from '../../../authentification/Utilisateur';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { AggregatNonTrouve } from '../../../domaine/Aggregat';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';

type DonneesUtilisateur = {
  dateSignatureCGU?: string;
  identifiantConnexion: string;
  nomPrenom: string;
  motDePasse: string;
};

type UtilisateurDTO = DTO & {
  donnees: DonneesUtilisateur;
};
export class EntrepotUtilisateurPostgres
  extends EntrepotEcriturePostgres<Utilisateur, UtilisateurDTO>
  implements EntrepotUtilisateur
{
  constructor(private readonly chiffrement: ServiceDeChiffrement) {
    super();
  }

  rechercheParIdentifiantDeConnexion(
    identifiantDeConnexion: string
  ): Promise<Utilisateur> {
    return this.knex
      .from(`${this.nomTable()}`)
      .then((utilisateurs: UtilisateurDTO[]) =>
        utilisateurs.find(
          (a) =>
            this.chiffrement.dechiffre(a.donnees.identifiantConnexion) ===
            identifiantDeConnexion
        )
      )
      .then((ligne) => {
        if (!ligne) {
          return Promise.reject(new AggregatNonTrouve(this.typeAggregat()));
        }
        return this.deDTOAEntite(ligne!);
      });
  }
  rechercheParIdentifiantConnexionEtMotDePasse(
    identifiantConnexion: string,
    motDePasse: string
  ): Promise<Utilisateur> {
    return this.knex
      .from(`${this.nomTable()}`)
      .then((utilisateurs: UtilisateurDTO[]) =>
        utilisateurs.find(
          (a) =>
            this.chiffrement.dechiffre(a.donnees.identifiantConnexion) ===
              identifiantConnexion &&
            this.chiffrement.dechiffre(a.donnees.motDePasse) === motDePasse
        )
      )
      .then((ligne) => {
        if (!ligne) {
          return Promise.reject(new AggregatNonTrouve(this.typeAggregat()));
        }
        return this.deDTOAEntite(ligne);
      });
  }

  typeAggregat(): string {
    return 'utilisateur';
  }

  protected champsAMettreAJour(
    entiteDTO: UtilisateurDTO
  ): Partial<UtilisateurDTO> {
    return { donnees: entiteDTO.donnees };
  }
  protected nomTable(): string {
    return 'utilisateurs';
  }
  protected deEntiteADTO(entite: Utilisateur): UtilisateurDTO {
    return {
      id: entite.identifiant,
      donnees: {
        identifiantConnexion: this.chiffrement.chiffre(
          entite.identifiantConnexion
        ),
        motDePasse: this.chiffrement.chiffre(entite.motDePasse),
        nomPrenom: this.chiffrement.chiffre(entite.nomPrenom),
        ...(entite.dateSignatureCGU && {
          dateSignatureCGU: entite.dateSignatureCGU.toISOString(),
        }),
      },
    };
  }
  protected deDTOAEntite(dto: UtilisateurDTO): Utilisateur {
    return {
      identifiant: dto.id,
      identifiantConnexion: this.chiffrement.dechiffre(
        dto.donnees.identifiantConnexion
      ),
      motDePasse: dto.donnees.motDePasse,
      nomPrenom: this.chiffrement.dechiffre(dto.donnees.nomPrenom),
      ...(dto.donnees.dateSignatureCGU && {
        dateSignatureCGU: FournisseurHorloge.enDate(
          dto.donnees.dateSignatureCGU
        ),
      }),
    };
  }
}
