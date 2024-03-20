import { AdaptateurEnvoiMail, Message } from '../../adaptateurs/AdaptateurEnvoiMail';

export class AdaptateurEnvoiMailMemoire implements AdaptateurEnvoiMail {
  private message?: Message;
  private _genereErreur = false;

  envoie(message: Message, _: string): Promise<void> {
    if (this._genereErreur) {
      return Promise.reject('Erreur');
    }
    this.message = message;
    return Promise.resolve();
  }

  aEteEnvoye(nom: string, email: string, message: string): boolean {
    return (
      (this.message && this.message.nom === nom && this.message.email === email && this.message.message === message) ||
      false
    );
  }

  genereErreur() {
    this._genereErreur = true;
  }
}
