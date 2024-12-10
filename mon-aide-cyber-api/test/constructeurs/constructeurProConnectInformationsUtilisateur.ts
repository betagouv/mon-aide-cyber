import { Constructeur } from './constructeur';
import { InformationsUtilisateur } from '../../src/adaptateurs/pro-connect/adaptateurProConnect';
import { Aidant } from '../../src/espace-aidant/Aidant';
import { fakerFR } from '@faker-js/faker';

class ConstructeurProConnectInformationsUtilisateur
  implements Constructeur<InformationsUtilisateur>
{
  private prenom = fakerFR.person.firstName();
  private nom = fakerFR.person.lastName();
  private email = fakerFR.internet.email();
  private siret: string = fakerFR.string.numeric(10);

  pourUnAidant(aidant: Aidant): ConstructeurProConnectInformationsUtilisateur {
    const [prenom, nom] = aidant.nomPrenom.split(' ');
    this.prenom = prenom;
    this.nom = nom;
    this.email = aidant.email;
    return this;
  }

  construis(): InformationsUtilisateur {
    return {
      prenom: this.prenom,
      nom: this.nom,
      email: this.email,
      siret: this.siret,
    };
  }
}

export const desInformationsUtilisateur = () =>
  new ConstructeurProConnectInformationsUtilisateur();
