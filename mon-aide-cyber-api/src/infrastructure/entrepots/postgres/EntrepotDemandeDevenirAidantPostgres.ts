import { rechercheParNomDepartement } from '../../../gestion-demandes/departements';
import {
  DemandeDevenirAidant,
  EntrepotDemandeDevenirAidant,
} from '../../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';
import { DTO, EntrepotPostgres } from './EntrepotPostgres';

export type DonneesDemandeDevenirAidant = {
  date: string;
  nom: string;
  prenom: string;
  mail: string;
  nomDepartement: string;
};

export type DemandeDevenirAidantDTO = DTO & {
  donnees: DonneesDemandeDevenirAidant;
};

export class EntrepotDemandeDevenirAidantPostgres
  extends EntrepotPostgres<DemandeDevenirAidant, DemandeDevenirAidantDTO>
  implements EntrepotDemandeDevenirAidant
{
  constructor(private readonly chiffrement: ServiceDeChiffrement) {
    super();
  }

  demandeExiste(mail: string): Promise<boolean> {
    return this.tous().then((demandes) =>
      demandes.some((demande) => demande.mail === mail)
    );
  }

  rechercheParMail(mail: string): Promise<DemandeDevenirAidant | undefined> {
    return this.tous().then((demandes) =>
      demandes.find((demande) => demande.mail === mail)
    );
  }
  protected nomTable(): string {
    return 'demandes-devenir-aidant';
  }

  protected champsAMettreAJour(
    _entiteDTO: DemandeDevenirAidantDTO
  ): Partial<DemandeDevenirAidantDTO> {
    throw new Error('Method not implemented.');
  }

  protected deEntiteADTO(
    entite: DemandeDevenirAidant
  ): DemandeDevenirAidantDTO {
    return {
      id: entite.identifiant,
      donnees: {
        date: entite.date.toISOString(),
        nom: this.chiffrement.chiffre(entite.nom),
        prenom: this.chiffrement.chiffre(entite.prenom),
        mail: this.chiffrement.chiffre(entite.mail),
        nomDepartement: this.chiffrement.chiffre(entite.departement.nom),
      },
    };
  }

  protected deDTOAEntite(dto: DemandeDevenirAidantDTO): DemandeDevenirAidant {
    const departementDechiffre = rechercheParNomDepartement(
      this.chiffrement.dechiffre(dto.donnees.nomDepartement)
    );

    if (!departementDechiffre) {
      throw new Error(
        `Le département ${dto.donnees.nomDepartement} n'a pu être trouvé.`
      );
    }

    return {
      identifiant: dto.id,
      date: FournisseurHorloge.enDate(dto.donnees.date),
      nom: this.chiffrement.dechiffre(dto.donnees.nom),
      prenom: this.chiffrement.dechiffre(dto.donnees.prenom),
      mail: this.chiffrement.dechiffre(dto.donnees.mail),
      departement: departementDechiffre,
    };
  }
}
