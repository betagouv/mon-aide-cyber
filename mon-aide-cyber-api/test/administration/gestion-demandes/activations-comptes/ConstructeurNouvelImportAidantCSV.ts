import { Constructeur } from '../../../constructeurs/constructeur';
import { fakerFR } from '@faker-js/faker';
import { AidantCSV } from '../../../../src/administration/gestion-demandes/activations-comptes/activationsComptesAidants';

class ConstructeurAidantCSV implements Constructeur<AidantCSV> {
  private email: string = fakerFR.internet.email().toLowerCase();
  private nomPrenom: string = fakerFR.person.fullName();

  avecUnEmail(email: string): ConstructeurAidantCSV {
    this.email = email;
    return this;
  }

  avecLeNom(nomPrenom: string): ConstructeurAidantCSV {
    this.nomPrenom = nomPrenom;
    return this;
  }

  construis(): AidantCSV {
    return {
      nom: this.nomPrenom,
      email: this.email,
    };
  }
}

class ConstructeurFichierAidantCSV implements Constructeur<string> {
  private aidants: AidantCSV[] = [];
  private readonly enTeteCsv = 'Nom;mail\n';

  avecLesAidants(aidants: AidantCSV[]): ConstructeurFichierAidantCSV {
    this.aidants = aidants;
    return this;
  }

  construis(): string {
    const ligne = this.aidants.map(
      (aidantCsv) => `${aidantCsv.nom};${aidantCsv.email}`
    );
    return `${this.enTeteCsv}${ligne.join('\n')}`;
  }
}

export const unConstructeurAidantCSV = () => new ConstructeurAidantCSV();

export const unConstructeurFichierAidantCSV = () =>
  new ConstructeurFichierAidantCSV();
