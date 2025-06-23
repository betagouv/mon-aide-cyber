import { rechercheParNomDepartement } from '../../../gestion-demandes/departements';
import {
  DemandeDevenirAidant,
  EntrepotDemandeDevenirAidant,
  StatutDemande,
  TypeEntite,
} from '../../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';
import { DTO, EntrepotEcriturePostgres } from './EntrepotPostgres';

type EntiteDTO = {
  nom?: string;
  siret?: string;
  type: string;
};
export type DonneesDemandeDevenirAidant = {
  date: string;
  nom: string;
  prenom: string;
  mail: string;
  nomDepartement: string;
  entite?: EntiteDTO;
};

export type DemandeDevenirAidantDTO = DTO & {
  donnees: DonneesDemandeDevenirAidant;
  statut: StatutDemande;
};

export class EntrepotDemandeDevenirAidantPostgres
  extends EntrepotEcriturePostgres<
    DemandeDevenirAidant,
    DemandeDevenirAidantDTO
  >
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

  rechercheDemandeEnCoursParMail(
    mail: string
  ): Promise<DemandeDevenirAidant | undefined> {
    return this.tous().then((demandes) =>
      demandes.find(
        (demande) =>
          demande.mail === mail && demande.statut === StatutDemande.EN_COURS
      )
    );
  }

  protected nomTable(): string {
    return 'demandes-devenir-aidant';
  }

  protected champsAMettreAJour(
    demandeDTO: DemandeDevenirAidantDTO
  ): Partial<DemandeDevenirAidantDTO> {
    return { donnees: demandeDTO.donnees, statut: demandeDTO.statut };
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
        entite: {
          type: this.chiffrement.chiffre(entite.entite.type),
          nom: this.chiffrement.chiffre(entite.entite.nom),
          siret: this.chiffrement.chiffre(entite.entite.siret),
        },
      },
      statut: entite.statut,
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
      statut: dto.statut,
      ...((dto.donnees.entite && {
        entite: {
          type: this.chiffrement.dechiffre(
            dto.donnees.entite.type
          ) as TypeEntite,
          ...((dto.donnees.entite.nom && {
            nom: this.chiffrement.dechiffre(dto.donnees.entite.nom),
          }) || { nom: '' }),
          ...((dto.donnees.entite.siret && {
            siret: this.chiffrement.dechiffre(dto.donnees.entite.siret),
          }) || { siret: '' }),
        },
      }) || { entite: { type: 'Association', nom: '', siret: '' } }),
    };
  }
}
