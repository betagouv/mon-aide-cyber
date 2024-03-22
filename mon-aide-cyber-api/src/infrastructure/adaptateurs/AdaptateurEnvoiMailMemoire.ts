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

  aEteEnvoye(nom: string, email: string, message: string): boolean {
    return (
      (this.message &&
        this.message.corps.includes(nom) &&
        this.message.corps.includes(email) &&
        this.message.corps.includes(message)) ||
      false
    );
  }

  genereErreur() {
    this._genereErreur = true;
  }
}
