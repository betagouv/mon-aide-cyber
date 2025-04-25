import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { Departement } from '../departements';
import { UtilisateurMACDTO } from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { DemandeAide } from './DemandeAide';
import {
  envoieConfirmationDemandeAide,
  envoieRecapitulatifDemandeAide,
  MiseEnRelation,
} from './miseEnRelation';

export class MiseEnRelationDirecteAidant implements MiseEnRelation {
  constructor(
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly annuaireCOT: {
      rechercheEmailParDepartement: (departement: Departement) => string;
    },
    private readonly aidant: UtilisateurMACDTO
  ) {}

  async execute(demandeAide: DemandeAide): Promise<void> {
    await envoieRecapitulatifDemandeAide(
      this.adaptateurEnvoiMail,
      demandeAide,
      this.aidant.email,
      this.annuaireCOT
    );
    await envoieConfirmationDemandeAide(
      this.adaptateurEnvoiMail,
      demandeAide,
      this.aidant
    );
  }
}
