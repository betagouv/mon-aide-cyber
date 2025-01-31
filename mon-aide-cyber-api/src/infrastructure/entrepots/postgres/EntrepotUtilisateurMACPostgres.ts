import { DTO, EntrepotPostgres } from './EntrepotPostgres';
import {
  EntrepotUtilisateursMAC,
  UtilisateurMAC,
} from '../../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import crypto from 'crypto';
import { estSiretGendarmerie } from '../../../espace-aidant/Aidant';
import { AggregatNonTrouve } from '../../../domaine/Aggregat';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';

type UtilisateurMACDTO = DTO & {
  type: 'AIDANT' | 'UTILISATEUR_INSCRIT';
  siret?: string;
  date_validation_cgu?: string;
  nom_prenom: string;
  email: string;
};

type Parametre<T> = T;

export class EntrepotUtilisateurMACPostgres
  extends EntrepotPostgres<UtilisateurMAC, UtilisateurMACDTO>
  implements EntrepotUtilisateursMAC
{
  private readonly REQUETE_UTILISATEUR_MAC = `
      SELECT id,
             type,
             donnees ->> 'siret' as siret,
             donnees ->> 'dateSignatureCGU' as date_validation_cgu,
             donnees ->> 'nomPrenom' as nom_prenom,
             donnees ->> 'email' as email
      FROM utilisateurs_mac
  `;

  constructor(private readonly serviceDeChiffrement: ServiceDeChiffrement) {
    super();
  }

  rechercheParMail(email: string): Promise<UtilisateurMAC> {
    return this.tous().then((utilisateurs) => {
      const utilisateursTrouves = utilisateurs.filter(
        (utilisateur) => utilisateur.email === email
      );
      if (utilisateursTrouves.length > 0) {
        return utilisateursTrouves[0];
      }
      throw new AggregatNonTrouve('utilisateur MAC');
    });
  }

  async tous(): Promise<UtilisateurMAC[]> {
    return this.knex
      .raw(this.REQUETE_UTILISATEUR_MAC)
      .then(({ rows }: { rows: UtilisateurMACDTO[] }) => {
        return rows;
      })
      .then((dtos) => {
        if (!dtos) {
          throw new AggregatNonTrouve('utilisateur MAC');
        }
        return dtos.map((dto) => this.deDTOAEntite(dto));
      });
  }

  rechercheParIdentifiant(identifiant: crypto.UUID): Promise<UtilisateurMAC> {
    return this.rechercheParCritere(`WHERE id = ?`, identifiant);
  }

  private rechercheParCritere<T>(critere: string, parametre: Parametre<T>) {
    return this.knex
      .raw(
        `
            ${this.REQUETE_UTILISATEUR_MAC} ${critere}
        `,
        [parametre]
      )
      .then(({ rows }: { rows: UtilisateurMACDTO[] }) => {
        return rows[0];
      })
      .then((dtos) => {
        if (!dtos) {
          throw new AggregatNonTrouve('utilisateur MAC');
        }
        return this.deDTOAEntite(dtos);
      });
  }

  protected deDTOAEntite(dto: UtilisateurMACDTO): UtilisateurMAC {
    const profil =
      dto.type === 'UTILISATEUR_INSCRIT'
        ? 'UtilisateurInscrit'
        : estSiretGendarmerie(dto.siret)
          ? 'Gendarme'
          : 'Aidant';
    return {
      identifiant: dto.id,
      profil,
      email: this.serviceDeChiffrement.dechiffre(dto.email),
      nomPrenom: this.serviceDeChiffrement.dechiffre(dto.nom_prenom),
      ...(dto.date_validation_cgu && {
        dateValidationCGU: FournisseurHorloge.enDate(dto.date_validation_cgu),
      }),
    };
  }

  protected champsAMettreAJour(
    _entiteDTO: UtilisateurMACDTO
  ): Partial<UtilisateurMACDTO> {
    throw new Error('Method not implemented.');
  }

  protected nomTable(): string {
    return 'utilisateurs_mac';
  }

  protected deEntiteADTO(_entite: UtilisateurMAC): UtilisateurMACDTO {
    throw new Error('Method not implemented.');
  }
}
