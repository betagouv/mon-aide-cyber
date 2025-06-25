import {
  AdaptateurEnvoiMail,
  ConfirmationDemandeAideAttribuee,
  Destinataire,
  Email,
  Expediteur,
  InformationEntitePourMiseEnRelation,
  UtilisateurMACEnRelation,
} from '../../adaptateurs/AdaptateurEnvoiMail';
import { AidantMisEnRelation } from '../../gestion-demandes/aide/MiseEnRelationParCriteres';
import { Departement } from '../../gestion-demandes/departements';

export class AdaptateurEnvoiMailMemoire implements AdaptateurEnvoiMail {
  private messages: Email[] = [];
  private _genereErreur = false;
  private expediteurs: Expediteur[] = ['MONAIDECYBER'];
  private destinataires: string[] = [];
  private confirmation: ConfirmationDemandeAideAttribuee | undefined =
    undefined;
  private _envoiRestitutionEntiteAideeEffectue:
    | { pdf: Buffer; emailEntiteAidee: string }
    | undefined = undefined;

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

  async envoieActivationCompteAidantFaite(mail: string): Promise<void> {
    if (this._genereErreur) {
      return Promise.reject('Erreur');
    }
    this.destinataires.push(mail);
    return;
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

  envoieConfirmationDemandeAideAttribuee(
    confirmation: ConfirmationDemandeAideAttribuee
  ): Promise<void> {
    this.confirmation = confirmation;
    this.destinataires.push(confirmation.emailAidant);
    return Promise.resolve();
  }

  envoieMiseEnRelation(
    _informations: InformationEntitePourMiseEnRelation,
    aidant: AidantMisEnRelation
  ): Promise<void> {
    this.destinataires.push(aidant.email);
    return Promise.resolve();
  }

  envoieRestitutionEntiteAidee(
    pdfRestitution: Buffer,
    emailEntiteAidee: string
  ): Promise<void> {
    this._envoiRestitutionEntiteAideeEffectue = {
      pdf: pdfRestitution,
      emailEntiteAidee,
    };
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

  activationCompteAidantFaiteEnvoyee(mail: string): boolean {
    return this.destinataires.includes(mail);
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

  demandeAideAttribueeEnvoyee(confirmation: {
    nomPrenomAidant: string;
    departement: Departement;
    emailEntite: string;
    emailAidant: string;
  }): boolean {
    const confirmationCorrespond =
      this.confirmation !== undefined &&
      this.confirmation.departement.code === confirmation.departement.code &&
      this.confirmation.emailEntite === confirmation.emailEntite &&
      this.confirmation.nomPrenomAidant === confirmation.nomPrenomAidant;
    return (
      this.destinataires.includes(confirmation.emailAidant) &&
      confirmationCorrespond
    );
  }

  envoiRestitutionEntiteAideeEffectue(
    pdfEnvoye: Buffer,
    emailEntiteAidee: string
  ): boolean {
    return (
      this._envoiRestitutionEntiteAideeEffectue?.pdf === pdfEnvoye &&
      this._envoiRestitutionEntiteAideeEffectue.emailEntiteAidee ===
        emailEntiteAidee
    );
  }
}
