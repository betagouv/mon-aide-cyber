import { DTO, EntrepotPostgres } from './EntrepotPostgres';
import {
  EntrepotUtilisateursMAC,
  UtilisateurMAC,
} from '../../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import crypto from 'crypto';
import { estSiretGendarmerie } from '../../../espace-aidant/Aidant';
import { AggregatNonTrouve } from '../../../domaine/Aggregat';

type UtilisateurMACDTO = DTO & {
  type: 'AIDANT' | 'UTILISATEUR_INSCRIT';
  siret?: string;
};

export class EntrepotUtilisateurMACPostgres
  extends EntrepotPostgres<UtilisateurMAC, UtilisateurMACDTO>
  implements EntrepotUtilisateursMAC
{
  rechercheParIdentifiant(identifiant: crypto.UUID): Promise<UtilisateurMAC> {
    return this.knex
      .raw(
        `
        SELECT id, type, donnees ->> 'siret' as siret FROM utilisateurs_mac WHERE id = ?
      `,
        [identifiant]
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
    return {
      identifiant: dto.id,
      profil: estSiretGendarmerie(dto.siret) ? 'Gendarme' : 'Aidant',
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
