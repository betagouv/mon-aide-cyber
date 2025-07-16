import { EntrepotDemandeDevenirAidantMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { DemandeDevenirAidant } from '../../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';

export class EntrepotDemandeDevenirAidantMemoireGenerantErreur extends EntrepotDemandeDevenirAidantMemoire {
  private critereLeveErreur = '';

  rechercheDemandeEnCoursParMail(
    mail: string
  ): Promise<DemandeDevenirAidant | undefined> {
    if (this.critereLeveErreur === mail) {
      throw new Error('Erreur de recherche');
    }
    return super.rechercheDemandeEnCoursParMail(mail);
  }

  surRechercheParMail(
    critereLeveErreur: string
  ): EntrepotDemandeDevenirAidantMemoireGenerantErreur {
    this.critereLeveErreur = critereLeveErreur;
    return this;
  }
}
