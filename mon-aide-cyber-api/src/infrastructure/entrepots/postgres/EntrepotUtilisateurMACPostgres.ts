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
};

type Parametre<T> = T;

export class EntrepotUtilisateurMACPostgres
  extends EntrepotPostgres<UtilisateurMAC, UtilisateurMACDTO>
  implements EntrepotUtilisateursMAC
{
  constructor(private readonly serviceDeChiffrement: ServiceDeChiffrement) {
    super();
  }
  rechercheParMail(email: string): Promise<UtilisateurMAC> {
    const critere = `WHERE donnees ->> 'email' = ?`;
    return this.rechercheParCritere(critere, email);
  }

  rechercheParIdentifiant(identifiant: crypto.UUID): Promise<UtilisateurMAC> {
    return this.rechercheParCritere(`WHERE id = ?`, identifiant);
  }

  private rechercheParCritere<T>(critere: string, parametre: Parametre<T>) {
    return this.knex
      .raw(
        `
        SELECT id, type, donnees ->> 'siret' as siret, donnees ->> 'dateSignatureCGU' as date_validation_cgu, donnees ->> 'nomPrenom' as nom_prenom FROM utilisateurs_mac ${critere}
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
      email: '',
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
    throw new Error('Method not implemented.');
  }
  protected deEntiteADTO(_entite: UtilisateurMAC): UtilisateurMACDTO {
    throw new Error('Method not implemented.');
  }
}
