import { Constructeur } from './constructeur';
import {
  EntiteUtilisateurInscrit,
  UtilisateurInscrit,
} from '../../src/espace-utilisateur-inscrit/UtilisateurInscrit';
import crypto from 'crypto';
import { fakerFR } from '@faker-js/faker';

class ConstructeurUtilisateurInscrit
  implements Constructeur<UtilisateurInscrit>
{
  private dateSignatureCGU: Date = fakerFR.date.anytime();
  private email: string = fakerFR.internet.email();
  private entite: EntiteUtilisateurInscrit = {};
  private identifiant: crypto.UUID = crypto.randomUUID();
  private nomPrenom: string = fakerFR.person.fullName();

  construis(): UtilisateurInscrit {
    return {
      dateSignatureCGU: this.dateSignatureCGU,
      email: this.email,
      entite: this.entite,
      identifiant: this.identifiant,
      nomPrenom: this.nomPrenom,
    };
  }
}

export const unUtilisateurInscrit = () => new ConstructeurUtilisateurInscrit();
