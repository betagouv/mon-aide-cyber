import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { Departement } from '../departements';
import {
  DonneesMiseEnRelation,
  envoieConfirmationDemandeAide,
  envoieRecapitulatifDemandeAide,
  MiseEnRelation,
} from './miseEnRelation';

export class MiseEnRelationParCriteres implements MiseEnRelation {
  constructor(
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly annuaireCOT: {
      rechercheEmailParDepartement: (departement: Departement) => string;
    }
  ) {}

  async execute(donneesMiseEnRelation: DonneesMiseEnRelation): Promise<void> {
    await envoieRecapitulatifDemandeAide(
      this.adaptateurEnvoiMail,
      donneesMiseEnRelation.demandeAide,
      undefined,
      this.annuaireCOT
    );
    await envoieConfirmationDemandeAide(
      this.adaptateurEnvoiMail,
      donneesMiseEnRelation.demandeAide,
      undefined
    );
  }
}
