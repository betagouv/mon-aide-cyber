import {
  AdaptateurEnvoiMail,
  Email,
} from '../../adaptateurs/AdaptateurEnvoiMail';

export class AdaptateurEnvoiMailMemoire implements AdaptateurEnvoiMail {
  private messages: Email[] = [];
  private _genereErreur = false;

  envoie(message: Email): Promise<void> {
    if (this._genereErreur) {
      return Promise.reject('Erreur');
    }
    this.messages.push(message);
    return Promise.resolve();
  }

  aEteEnvoye(email: string, message: string, nom?: string): boolean {
    const messageTrouve = this.messages.find(
      (m) =>
        (nom !== undefined ? m.corps.includes(nom) : true) &&
        m.corps.includes(email) &&
        m.corps.includes(message)
    );
    return (nom !== undefined && messageTrouve !== undefined) || false;
  }

  aEteEnvoyeA(email: string, message: string): boolean {
    const messageTrouve = this.messages.find(
      (m) => m.destinataire.email === email && m.corps === message
    );
    return messageTrouve !== undefined || false;
  }

  mailEnvoye() {
    return this.messages.length > 0;
  }

  genereErreur() {
    this._genereErreur = true;
  }
}
