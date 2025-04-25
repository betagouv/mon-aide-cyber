import { Constructeur } from './constructeur';
import { UtilisateurMACDTO } from '../../src/recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { Aidant } from '../../src/espace-aidant/Aidant';
import { fakerFR } from '@faker-js/faker';
import crypto, { UUID } from 'crypto';
import { UtilisateurInscrit } from '../../src/espace-utilisateur-inscrit/UtilisateurInscrit';

class ConstructeurUtilisateurMAC implements Constructeur<UtilisateurMACDTO> {
  private doitValiderLesCGU = false;
  private email: string = fakerFR.internet.email();
  private identifiant: UUID = crypto.randomUUID();
  private nomComplet: string = fakerFR.person.fullName();
  private nomUsage: string = fakerFR.person.lastName();
  private profil: 'Aidant' | 'UtilisateurInscrit' | 'Gendarme' = 'Aidant';

  depuisUnAidant(aidant: Aidant): ConstructeurUtilisateurMAC {
    this.email = aidant.email;
    this.identifiant = aidant.identifiant;
    this.nomComplet = aidant.nomPrenom;
    this.nomUsage = aidant.preferences.nomAffichageAnnuaire;
    this.profil = 'Aidant';
    return this;
  }

  depuisUnUtilisateurInscrit(
    utilisateurInscrit: UtilisateurInscrit
  ): ConstructeurUtilisateurMAC {
    this.email = utilisateurInscrit.email;
    this.identifiant = utilisateurInscrit.identifiant;
    this.nomComplet = utilisateurInscrit.nomPrenom;
    this.nomUsage = utilisateurInscrit.nomPrenom;
    this.profil = 'UtilisateurInscrit';
    return this;
  }

  construis(): UtilisateurMACDTO {
    return {
      doitValiderLesCGU: this.doitValiderLesCGU,
      email: this.email,
      identifiant: this.identifiant,
      nomComplet: this.nomComplet,
      nomUsage: this.nomUsage,
      profil: this.profil,
    };
  }
}

export const unUtilisateurMAC = () => new ConstructeurUtilisateurMAC();
