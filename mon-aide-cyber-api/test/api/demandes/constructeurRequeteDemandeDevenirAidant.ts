import { Constructeur } from '../../constructeurs/constructeur';
import { fakerFR } from '@faker-js/faker';
import { departements } from '../../../src/gestion-demandes/departements';
import { UtilisateurInscrit } from '../../../src/espace-utilisateur-inscrit/UtilisateurInscrit';
import { TypeEntite } from '../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';

type RequeteDemandeDevenirAidant = {
  nom: string;
  prenom: string;
  mail: string;
  departement: string;
  cguValidees: boolean;
  signatureCharte?: boolean;
  entite: { type: TypeEntite; nom: string; siret: string };
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
  private signatureCharte: boolean | undefined = undefined;
  private entite: { type: TypeEntite; nom: string; siret: string } = {
    type: 'Association',
    nom: fakerFR.company.name(),
    siret: fakerFR.number.int(10).toString(),
  };

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

  sansCharteAidant(): ConstructeurRequeteDemandeDevenirAidant {
    this.signatureCharte = false;
    return this;
  }

  dansUneEntite = (
    nom: string,
    siret: string,
    type: TypeEntite
  ): ConstructeurRequeteDemandeDevenirAidant => {
    this.entite = {
      nom,
      siret,
      type,
    };
    return this;
  };

  ayantSigneLaCharte(): ConstructeurRequeteDemandeDevenirAidant {
    this.signatureCharte = true;
    return this;
  }

  depuisUnCompteUtilisateurInscrit(
    utilisateur: UtilisateurInscrit
  ): ConstructeurRequeteDemandeDevenirAidant {
    const [prenom, ...nom] = utilisateur.nomPrenom.split(' ');
    this.cguValidees = true;
    this.signatureCharte = true;
    this.mail = utilisateur.email;
    this.prenom = prenom;
    this.nom = nom.join(' ');
    return this;
  }

  construis(): RequeteDemandeDevenirAidant {
    return {
      cguValidees: this.cguValidees,
      departement: this.departement,
      mail: this.mail,
      nom: this.nom,
      prenom: this.prenom,
      ...(this.signatureCharte !== undefined && {
        signatureCharte: this.signatureCharte,
      }),
      entite: this.entite,
    };
  }
}

export const uneRequeteDemandeDevenirAidant = () =>
  new ConstructeurRequeteDemandeDevenirAidant();
