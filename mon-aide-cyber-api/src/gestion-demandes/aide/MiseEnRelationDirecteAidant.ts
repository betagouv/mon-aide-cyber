import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { Departement } from '../departements';
import { UtilisateurMACDTO } from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  DonneesMiseEnRelation,
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

  async execute(donneesMiseEnRelation: DonneesMiseEnRelation): Promise<void> {
    await envoieRecapitulatifDemandeAide(
      this.adaptateurEnvoiMail,
      donneesMiseEnRelation.demandeAide,
      this.aidant.email,
      this.annuaireCOT
    );
    await envoieConfirmationDemandeAide(
      this.adaptateurEnvoiMail,
      donneesMiseEnRelation.demandeAide,
      this.aidant
    );
  }
}
