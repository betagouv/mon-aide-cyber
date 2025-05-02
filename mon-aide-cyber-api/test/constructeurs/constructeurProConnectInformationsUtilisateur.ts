import { Constructeur } from './constructeur';
import { InformationsUtilisateur } from '../../src/adaptateurs/pro-connect/adaptateurProConnect';
import { Aidant } from '../../src/espace-aidant/Aidant';
import { fakerFR } from '@faker-js/faker';
import { UtilisateurInscrit } from '../../src/espace-utilisateur-inscrit/UtilisateurInscrit';

class ConstructeurProConnectInformationsUtilisateur
  implements Constructeur<InformationsUtilisateur>
{
  private prenom = fakerFR.person.firstName();
  private nom = fakerFR.person.lastName();
  private email = fakerFR.internet.email();
  private siret: string = fakerFR.string.numeric(10);

  pourUnAidant(aidant: Aidant): ConstructeurProConnectInformationsUtilisateur {
    this.extraisInformationsUtilisateurs(aidant);
    return this;
  }

  avecUnSiret(siret: string): ConstructeurProConnectInformationsUtilisateur {
    this.siret = siret;
    return this;
  }

  pourUnUtilisateurInscrit(
    utilisateurInscrit: UtilisateurInscrit
  ): ConstructeurProConnectInformationsUtilisateur {
    this.extraisInformationsUtilisateurs(utilisateurInscrit);
    return this;
  }

  avecLeMail(email: string): ConstructeurProConnectInformationsUtilisateur {
    this.email = email;
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

  private extraisInformationsUtilisateurs(
    utilisateur: UtilisateurInscrit | Aidant
  ) {
    const [prenom, nom] = utilisateur.nomPrenom.split(' ');
    this.prenom = prenom;
    this.nom = nom;
    this.email = utilisateur.email;
  }
}

export const desInformationsUtilisateur = () =>
  new ConstructeurProConnectInformationsUtilisateur();
