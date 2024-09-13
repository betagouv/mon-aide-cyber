import { Constructeur } from '../../../constructeurs/constructeur';
import { AidantTranscris } from '../../../../src/administration/aidants/importe/importeAidants';
import { fakerFR } from '@faker-js/faker';

class ConstructeurAidantTranscris implements Constructeur<AidantTranscris> {
  private charte: 'OK' | 'NOK' = 'NOK';
  private telephone: string = fakerFR.phone.number();
  private email: string = fakerFR.internet.email();
  private nomPrenom: string = fakerFR.person.fullName();
  private region = 'BFC';
  private commentaires = '';
  private compteCree = '';
  private messageAvecMDP = '';
  private qui = '';
  private todo = '';

  charteOK(): ConstructeurAidantTranscris {
    this.charte = 'OK';
    return this;
  }

  avecUnTelephone(telephone: string): ConstructeurAidantTranscris {
    this.telephone = telephone;
    return this;
  }

  avecUnEmail(email: string): ConstructeurAidantTranscris {
    this.email = email;
    return this;
  }

  avecLeNom(nomPrenom: string): ConstructeurAidantTranscris {
    this.nomPrenom = nomPrenom;
    return this;
  }

  enRegion(region: string): ConstructeurAidantTranscris {
    this.region = region;
    return this;
  }

  dejaImporte(): ConstructeurAidantTranscris {
    this.commentaires = `importé le 2024-01-05`;
    this.compteCree = 'oui';
    this.messageAvecMDP = 'Message';
    this.qui = 'FC';
    this.todo = 'en attente de réponse';
    return this;
  }

  construis(): AidantTranscris {
    return {
      charte: this.charte,
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

export const unConstructeurAidantTranscris = () =>
  new ConstructeurAidantTranscris();
