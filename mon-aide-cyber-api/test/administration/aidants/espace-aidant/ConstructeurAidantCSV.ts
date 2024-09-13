import { Constructeur } from '../../../constructeurs/constructeur';
import { AidantCSV } from '../../../../src/administration/aidants/espace-aidant/initialiseCreationEspacesAidants';
import { fakerFR } from '@faker-js/faker';

class ConstructeurAidantCSV implements Constructeur<AidantCSV> {
  private charte: 'OK' | 'NOK' = 'NOK';
  private formation: 'OK' | 'NOK' = 'NOK';
  private telephone: string = fakerFR.phone.number();
  private email: string = fakerFR.internet.email().toLowerCase();
  private nomPrenom: string = fakerFR.person.fullName();
  private region = 'BFC';
  private commentaires = '';
  private compteCree = '';
  private messageAvecMDP = '';
  private qui = '';
  private todo = '';

  charteOK(): ConstructeurAidantCSV {
    this.charte = 'OK';
    return this;
  }

  formationOK(): ConstructeurAidantCSV {
    this.formation = 'OK';
    return this;
  }

  avecUnTelephone(telephone: string): ConstructeurAidantCSV {
    this.telephone = telephone;
    return this;
  }

  avecUnEmail(email: string): ConstructeurAidantCSV {
    this.email = email;
    return this;
  }

  avecLeNom(nomPrenom: string): ConstructeurAidantCSV {
    this.nomPrenom = nomPrenom;
    return this;
  }

  enRegion(region: string): ConstructeurAidantCSV {
    this.region = region;
    return this;
  }

  dejaImporte(): ConstructeurAidantCSV {
    this.commentaires = `importé le 2024-01-05`;
    this.compteCree = 'oui';
    this.messageAvecMDP = 'Message';
    this.qui = 'FC';
    this.todo = 'en attente de réponse';
    return this;
  }

  construis(): AidantCSV {
    return {
      charte: this.charte,
      formation: this.formation,
      commentaires: this.commentaires,
      compteCree: this.compteCree,
      identifiantConnexion: this.email,
      messageAvecMDP: this.messageAvecMDP,
      nomPrenom: this.nomPrenom,
      numeroTelephone: this.telephone,
      qui: this.qui,
      region: this.region,
      todo: this.todo,
    };
  }
}

export const unConstructeurAidantCSV = () => new ConstructeurAidantCSV();
