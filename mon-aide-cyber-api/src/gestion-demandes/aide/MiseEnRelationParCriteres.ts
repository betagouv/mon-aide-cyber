import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { Departement } from '../departements';
import {
  DonneesMiseEnRelation,
  envoieConfirmationDemandeAide,
  envoieRecapitulatifDemandeAide,
  MiseEnRelation,
} from './miseEnRelation';
import { Entrepots } from '../../domaine/Entrepots';

export class MiseEnRelationParCriteres implements MiseEnRelation {
  constructor(
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly annuaireCOT: {
      rechercheEmailParDepartement: (departement: Departement) => string;
    },
    private readonly entrepots: Entrepots
  ) {}

  async execute(donneesMiseEnRelation: DonneesMiseEnRelation): Promise<void> {
    const aidants = await this.entrepots.aidants().rechercheParPreferences({
      departement: donneesMiseEnRelation.demandeAide.departement,
      secteursActivite: donneesMiseEnRelation.secteursActivite,
    });
    await envoieRecapitulatifDemandeAide(
      this.adaptateurEnvoiMail,
      donneesMiseEnRelation.demandeAide,
      aidants,
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
