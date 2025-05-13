import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { Departement } from '../departements';
import { UtilisateurMACDTO } from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  DirecteAidant,
  DonneesMiseEnRelation,
  envoieAuCotRecapitulatifDemandeAideDirecteAidant,
  envoieConfirmationDemandeAide,
  MiseEnRelation,
  ResultatMiseEnRelation,
} from './miseEnRelation';

export class MiseEnRelationDirecteAidant implements MiseEnRelation {
  constructor(
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly annuaireCOT: {
      rechercheEmailParDepartement: (departement: Departement) => string;
    },
    private readonly aidant: UtilisateurMACDTO
  ) {}

  async execute(
    donneesMiseEnRelation: DonneesMiseEnRelation
  ): Promise<ResultatMiseEnRelation<DirecteAidant>> {
    await envoieAuCotRecapitulatifDemandeAideDirecteAidant(
      this.adaptateurEnvoiMail,
      donneesMiseEnRelation,
      this.aidant.email,
      this.annuaireCOT
    );
    await envoieConfirmationDemandeAide(
      this.adaptateurEnvoiMail,
      donneesMiseEnRelation.demandeAide,
      this.aidant
    );
    return {
      type: 'DIRECTE_AIDANT',
      resultat: {
        idAidant: this.aidant.identifiant,
        typeEntite: donneesMiseEnRelation.typeEntite.nom,
        secteursActivite: donneesMiseEnRelation.secteursActivite.map(
          (s) => s.nom
        ),
        departement: donneesMiseEnRelation.demandeAide.departement.code,
      },
    };
  }
}
