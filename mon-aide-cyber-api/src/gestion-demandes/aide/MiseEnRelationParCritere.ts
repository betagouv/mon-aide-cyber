import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { Departement } from '../departements';
import { DemandeAide } from './DemandeAide';
import {
  envoieConfirmationDemandeAide,
  envoieRecapitulatifDemandeAide,
  MiseEnRelation,
} from './miseEnRelation';

export class MiseEnRelationParCritere implements MiseEnRelation {
  constructor(
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly annuaireCOT: {
      rechercheEmailParDepartement: (departement: Departement) => string;
    }
  ) {}

  async execute(demandeAide: DemandeAide): Promise<void> {
    await envoieRecapitulatifDemandeAide(
      this.adaptateurEnvoiMail,
      demandeAide,
      undefined,
      this.annuaireCOT
    );
    await envoieConfirmationDemandeAide(
      this.adaptateurEnvoiMail,
      demandeAide,
      undefined
    );
  }
}
