import {
  Evenement,
  RepertoireDeContacts,
} from '../../contacts/RepertoireDeContacts';

export class AdaptateurRepertoireDeContactsMemoire implements RepertoireDeContacts {
  public aidants: string[] = [];
  public aides: string[] = [];
  public utilisateursInscrits: string[] = [];
  public evenements: Evenement[] = [];
  private _creeAidantAppeleAvecPixelDeSuiviAutorise: boolean = false;
  private _creeUtilisateurInscritAppeleAvecPixelDeSuiviAutorise: boolean = false;

  async creeAidant(
    email: string,
    pixelDeSuiviAutorise: boolean
  ): Promise<void> {
    this._creeAidantAppeleAvecPixelDeSuiviAutorise = pixelDeSuiviAutorise;
    this.aidants.push(email);
  }

  async creeAide(email: string): Promise<void> {
    this.aides.push(email);
  }

  async creeUtilisateurInscrit(
    email: string,
    pixelDeSuiviAutorise: boolean
  ): Promise<void> {
    this._creeUtilisateurInscritAppeleAvecPixelDeSuiviAutorise = pixelDeSuiviAutorise;
    this.utilisateursInscrits.push(email);
  }

  async emetsEvenement(evenement: Evenement): Promise<void> {
    this.evenements.push(evenement);
  }

  async modifieEmail(
    __ancienEmail: string,
    __nouvelEmail: string
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  creeAidantAppeleAvecPixelDeSuiviAutorise() {
    return this._creeAidantAppeleAvecPixelDeSuiviAutorise;
  }

  creeUtilisateurInscritAppeleAvecPixelDeSuiviAutorise() {
    return this._creeUtilisateurInscritAppeleAvecPixelDeSuiviAutorise;
  }
}
