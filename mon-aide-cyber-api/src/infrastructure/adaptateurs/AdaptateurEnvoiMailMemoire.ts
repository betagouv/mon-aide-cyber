import {
  AdaptateurEnvoiMail,
  Destinataire,
  Email,
  Expediteur,
  UtilisateurMACEnRelation,
} from '../../adaptateurs/AdaptateurEnvoiMail';

export class AdaptateurEnvoiMailMemoire implements AdaptateurEnvoiMail {
  private messages: Email[] = [];
  private _genereErreur = false;
  private expediteurs: Expediteur[] = ['MONAIDECYBER'];
  private destinataires: string[] = [];

  envoie(
    message: Email,
    expediteur: Expediteur = 'MONAIDECYBER'
  ): Promise<void> {
    if (this._genereErreur) {
      return Promise.reject('Erreur');
    }
    this.messages.push(message);
    this.expediteurs.push(expediteur);
    return Promise.resolve();
  }

  envoieConfirmationDemandeAide(
    email: string,
    utilisateurMACEnRelation: UtilisateurMACEnRelation | undefined
  ): Promise<void> {
    if (this._genereErreur) {
      return Promise.reject('Erreur');
    }
    this.destinataires.push(email);
    if (utilisateurMACEnRelation) {
      this.destinataires.push(utilisateurMACEnRelation.email);
    }
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

  aEteEnvoyePar(expediteur: Expediteur): boolean {
    return this.expediteurs.includes(expediteur);
  }

  aEteEnvoyeA(email: string, message: string): boolean {
    const messageTrouve = this.messages.find(
      (m) =>
        (m.destinataire as Destinataire).email === email && m.corps === message
    );
    return messageTrouve !== undefined || false;
  }

  aEteEnvoyeEnCopieA(email: string, message: string): boolean {
    const messageTrouve = this.messages.find(
      (m) => m.copie === email && m.corps === message
    );
    return messageTrouve !== undefined || false;
  }

  aEteEnvoyeEnCopieInvisibleA(email: string, message: string): boolean {
    const messageTrouve = this.messages.find(
      (m) => m.copieInvisible === email && m.corps === message
    );
    return messageTrouve !== undefined || false;
  }

  mailEnvoye(): boolean {
    return this.messages.length > 0;
  }

  genereErreur() {
    this._genereErreur = true;
  }

  mailNonEnvoye(): boolean {
    return !this.mailEnvoye();
  }

  confirmationDemandeAideAEteEnvoyeeA(
    emailEntiteeAidee: string,
    emailAidant?: string
  ): boolean {
    return (
      this.destinataires.includes(emailEntiteeAidee) &&
      (emailAidant === undefined || this.destinataires.includes(emailAidant))
    );
  }
}
