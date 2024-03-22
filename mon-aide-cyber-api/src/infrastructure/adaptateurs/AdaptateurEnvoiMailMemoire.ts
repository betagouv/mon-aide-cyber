import {
  AdaptateurEnvoiMail,
  Email,
} from '../../adaptateurs/AdaptateurEnvoiMail';

export class AdaptateurEnvoiMailMemoire implements AdaptateurEnvoiMail {
  private message?: Email;
  private _genereErreur = false;

  envoie(message: Email): Promise<void> {
    if (this._genereErreur) {
      return Promise.reject('Erreur');
    }
    this.message = message;
    return Promise.resolve();
  }

  aEteEnvoye(email: string, message: string, nom?: string): boolean {
    return (
      (this.message &&
        (nom !== undefined ? this.message.corps.includes(nom) : true) &&
        this.message.corps.includes(email) &&
        this.message.corps.includes(message)) ||
      false
    );
  }

  aEteEnvoyeA(email: string, message: string): boolean {
    return (
      (this.message &&
        this.message.destinataire.email === email &&
        this.message.corps === message) ||
      false
    );
  }

  genereErreur() {
    this._genereErreur = true;
  }
}
