import { DTO, EntrepotPostgres } from './EntrepotPostgres';
import {
  Aidant,
  EntrepotAnnuaireAidants,
} from '../../../annuaire-aidants/annuaireAidants';
import { UUID } from 'crypto';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { CriteresDeRecherche } from '../../../annuaire-aidants/ServiceAnnuaireAidants';
import { rechercheParNomDepartement } from '../../../gestion-demandes/departements';

type AidantDTO = DTO & {
  identifiant: UUID;
  nomPrenom: string;
  departements: string[];
};

export class EntrepotAnnuaireAidantsPostgres
  extends EntrepotPostgres<Aidant, AidantDTO>
  implements EntrepotAnnuaireAidants
{
  constructor(private readonly chiffrement: ServiceDeChiffrement) {
    super();
  }

  async tous(): Promise<Aidant[]> {
    throw new Error(
      'La méthode pour récupérer tous les Aidants n’est pas disponible sur l’annuaire des Aidants.'
    );
  }

  async rechercheParCriteres(
    criteresDeRecherche?: CriteresDeRecherche | undefined
  ): Promise<Aidant[]> {
    let requete = `
        SELECT id as identifiant,
               donnees ->> 'nomPrenom' as "nomPrenom", donnees -> 'preferences' -> 'departements' as "departements"
        FROM utilisateurs
        WHERE type = 'AIDANT'
          AND (donnees ->> 'consentementAnnuaire')::bool is TRUE`;
    const parametres = criteresDeRecherche && {
      departements: '["' + criteresDeRecherche?.departement + '"]',
    };
    requete = criteresDeRecherche?.departement
      ? `${requete} AND donnees -> 'preferences' -> 'departements' @> :departements`
      : requete;

    return await this.knex
      .raw(requete, parametres || {})
      .then(({ rows }: { rows: AidantDTO[] }) =>
        rows.map((r) => this.deDTOAEntite(r))
      );
  }

  protected nomTable(): string {
    return 'utilisateurs';
  }

  protected deDTOAEntite(dto: AidantDTO): Aidant {
    return {
      identifiant: dto.identifiant,
      nomPrenom: this.chiffrement.dechiffre(dto.nomPrenom),
      departements: dto.departements.map((d) => rechercheParNomDepartement(d)),
    };
  }

  async persiste(_entite: Aidant): Promise<void> {
    throw new Error('Pas de persistence pour l’entrepôt Annuaire Aidant');
  }

  protected champsAMettreAJour(_entiteDTO: AidantDTO): Partial<AidantDTO> {
    throw new Error('Pas de persistence pour l’entrepôt Annuaire Aidant');
  }

  protected deEntiteADTO(_entite: Aidant): AidantDTO {
    throw new Error('Pas de persistence pour l’entrepôt Annuaire Aidant');
  }
}
