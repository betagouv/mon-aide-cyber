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
import { DemandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';

export class AdaptateurEnvoiMailMemoire implements AdaptateurEnvoiMail {
  private messages: Email[] = [];
  private _genereErreur = false;
  private expediteurs: Expediteur[] = ['MONAIDECYBER'];
  private destinataires: string[] = [];
  private confirmation: ConfirmationDemandeAideAttribuee | undefined =
    undefined;
  private _envoiRestitutionEntiteAideeEffectue:
    | { pdfs: Buffer[]; emailEntiteAidee: string }
    | undefined = undefined;
  private _envoieMailParticipationAUnAtelier = false;

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

  async envoieMailParticipationAUnAtelier(
    demande: DemandeDevenirAidant,
    emailCOT: string,
    emailMAC: string
  ): Promise<void> {
    this._envoieMailParticipationAUnAtelier = true;
    if (this._genereErreur) {
      throw new Error('Erreur');
    }
    this.destinataires.push(...[demande.mail, emailCOT, emailMAC]);
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

  async envoiToutesLesMisesEnRelation(
    matchingAidants: AidantMisEnRelation[],
    __informations: InformationEntitePourMiseEnRelation
  ): Promise<void> {
    this.destinataires.push(...matchingAidants.map((a) => a.email));
  }
  envoieRestitutionEntiteAidee(
    pdfsRestitution: Buffer[],
    emailEntiteAidee: string
  ): Promise<void> {
    this._envoiRestitutionEntiteAideeEffectue = {
      pdfs: pdfsRestitution,
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
    pdfEnvoyes: Buffer[],
    emailEntiteAidee: string
  ): boolean {
    const tousPresents =
      pdfEnvoyes.every(
        (val, index) =>
          val === this._envoiRestitutionEntiteAideeEffectue?.pdfs[index]
      ) || false;

    return (
      tousPresents &&
      this._envoiRestitutionEntiteAideeEffectue?.emailEntiteAidee ===
        emailEntiteAidee
    );
  }

  mailDeParticipationAUnAtelierEnvoye(emailAidant: string): boolean {
    return (
      this._envoieMailParticipationAUnAtelier &&
      this.destinataires.includes(emailAidant)
    );
  }
}
