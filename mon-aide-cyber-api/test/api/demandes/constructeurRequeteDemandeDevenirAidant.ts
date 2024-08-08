import { Constructeur } from '../../constructeurs/constructeur';
import { fakerFR } from '@faker-js/faker';
import { departements } from '../../../src/gestion-demandes/departements';

type RequeteDemandeDevenirAidant = {
  nom: string;
  prenom: string;
  mail: string;
  departement: string;
  cguValidees: boolean;
};

class ConstructeurRequeteDemandeDevenirAidant
  implements Constructeur<RequeteDemandeDevenirAidant>
{
  private cguValidees = true;
  private mail: string = fakerFR.internet.email();
  private nom: string = fakerFR.person.lastName();
  private prenom: string = fakerFR.person.firstName();
  private departement: string =
    departements[fakerFR.number.int({ min: 0, max: departements.length - 1 })]
      .nom;

  dansLeDepartement(
    departement: string
  ): ConstructeurRequeteDemandeDevenirAidant {
    this.departement = departement;
    return this;
  }

  avecUnMail(mail: string): ConstructeurRequeteDemandeDevenirAidant {
    this.mail = mail;
    return this;
  }

  avecUnNomVide(): ConstructeurRequeteDemandeDevenirAidant {
    this.nom = '';
    return this;
  }

  construis(): RequeteDemandeDevenirAidant {
    return {
      cguValidees: this.cguValidees,
      departement: this.departement,
      mail: this.mail,
      nom: this.nom,
      prenom: this.prenom,
    };
  }
}

export const uneRequeteDemandeDevenirAidant = () =>
  new ConstructeurRequeteDemandeDevenirAidant();
