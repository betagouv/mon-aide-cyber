import { DTO, EntrepotPostgres } from './EntrepotPostgres';
import { Aidant, EntrepotAidant } from '../../../authentification/Aidant';

import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { AggregatNonTrouve } from '../../../domaine/Aggregat';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';

export type DonneesUtilisateur = {
  dateSignatureCharte: string;
  dateSignatureCGU: string;
  identifiantConnexion: string;
  nomPrenom: string;
  motDePasse: string;
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

  protected champsAMettreAJour(__: AidantDTO): Partial<AidantDTO> {
    return {};
  }

  protected deDTOAEntite(dto: AidantDTO): Aidant {
    return {
      identifiant: dto.id,
      identifiantConnexion: this.chiffrement.dechiffre(
        dto.donnees.identifiantConnexion,
      ),
      motDePasse: this.chiffrement.dechiffre(dto.donnees.motDePasse),
      nomPrenom: this.chiffrement.dechiffre(dto.donnees.nomPrenom),
      dateSignatureCGU: FournisseurHorloge.enDate(dto.donnees.dateSignatureCGU),
      dateSignatureCharte: FournisseurHorloge.enDate(
        dto.donnees.dateSignatureCharte,
      ),
    };
  }

  protected deEntiteADTO(entite: Aidant): AidantDTO {
    return {
      id: entite.identifiant,
      type: 'AIDANT',
      donnees: {
        identifiantConnexion: this.chiffrement.chiffre(
          entite.identifiantConnexion,
        ),
        motDePasse: this.chiffrement.chiffre(entite.motDePasse),
        nomPrenom: this.chiffrement.chiffre(entite.nomPrenom),
        dateSignatureCGU: entite.dateSignatureCGU.toISOString(),
        dateSignatureCharte: entite.dateSignatureCharte.toISOString(),
      },
    };
  }

  protected nomTable(): string {
    return 'utilisateurs';
  }

  typeAggregat(): string {
    return 'aidant';
  }

  rechercheParIdentifiantConnexionEtMotDePasse(
    identifiantConnexion: string,
    motDePasse: string,
  ): Promise<Aidant> {
    return this.knex
      .from(`${this.nomTable()}`)
      .where({ type: 'AIDANT' })
      .then((aidants: AidantDTO[]) =>
        aidants.find(
          (a) =>
            this.chiffrement.dechiffre(a.donnees.identifiantConnexion) ===
              identifiantConnexion &&
            this.chiffrement.dechiffre(a.donnees.motDePasse) === motDePasse,
        ),
      )
      .then((ligne) => {
        if (!ligne) {
          return Promise.reject(new AggregatNonTrouve(this.typeAggregat()));
        }
        return this.deDTOAEntite(ligne);
      });
  }

  rechercheParIdentifiantDeConnexion(
    identifiantConnexion: string,
  ): Promise<Aidant> {
    return this.knex
      .from(`${this.nomTable()}`)
      .where({ type: 'AIDANT' })
      .then((aidants: AidantDTO[]) =>
        aidants.find(
          (a) =>
            this.chiffrement.dechiffre(a.donnees.identifiantConnexion) ===
            identifiantConnexion,
        ),
      )
      .then((ligne) => {
        if (!ligne) {
          return Promise.reject(new AggregatNonTrouve(this.typeAggregat()));
        }
        return this.deDTOAEntite(ligne);
      });
  }
}
