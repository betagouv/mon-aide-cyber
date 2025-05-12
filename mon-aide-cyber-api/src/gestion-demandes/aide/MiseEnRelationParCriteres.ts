import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { Departement } from '../departements';
import {
  DonneesMiseEnRelation,
  envoieAuCOTAucunAidantPourLaDemandeAide,
  envoieConfirmationDemandeAide,
  envoieRecapitulatifDemandeAide,
  MiseEnRelation,
  ParCriteres,
  ResultatMiseEnRelation,
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

  async execute(
    donneesMiseEnRelation: DonneesMiseEnRelation
  ): Promise<ResultatMiseEnRelation<ParCriteres>> {
    const aidants = await this.entrepots.aidants().rechercheParPreferences({
      departement: donneesMiseEnRelation.demandeAide.departement,
      secteursActivite: donneesMiseEnRelation.secteursActivite,
      typeEntite: donneesMiseEnRelation.typeEntite,
    });
    const aucunAidantMatche = aidants.length === 0;
    if (aucunAidantMatche) {
      await envoieAuCOTAucunAidantPourLaDemandeAide(
        this.adaptateurEnvoiMail,
        donneesMiseEnRelation,
        this.annuaireCOT
      );
    } else {
      await envoieRecapitulatifDemandeAide(
        this.adaptateurEnvoiMail,
        donneesMiseEnRelation.demandeAide,
        aidants,
        undefined,
        this.annuaireCOT
      );
    }
    await envoieConfirmationDemandeAide(
      this.adaptateurEnvoiMail,
      donneesMiseEnRelation.demandeAide,
      undefined
    );
    return {
      type: 'PAR_CRITERES',
      resultat: {
        nombreAidants: aidants.length,
        typeEntite: donneesMiseEnRelation.typeEntite.nom,
        secteursActivite: donneesMiseEnRelation.secteursActivite.map(
          (s) => s.nom
        ),
        departement: donneesMiseEnRelation.demandeAide.departement.code,
      },
    };
  }
}
