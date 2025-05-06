import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { UtilisateurMACDTO } from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  DirecteUtilisateurInscrit,
  DonneesMiseEnRelation,
  envoieConfirmationDemandeAide,
  MiseEnRelation,
  ResultatMiseEnRelation,
} from './miseEnRelation';

export class MiseEnRelationDirecteUtilisateurInscrit implements MiseEnRelation {
  constructor(
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly utilisateurInscrit: UtilisateurMACDTO
  ) {}

  async execute(
    donneesMiseEnRelation: DonneesMiseEnRelation
  ): Promise<ResultatMiseEnRelation<DirecteUtilisateurInscrit>> {
    await envoieConfirmationDemandeAide(
      this.adaptateurEnvoiMail,
      donneesMiseEnRelation.demandeAide,
      this.utilisateurInscrit
    );
    return {
      resultat: {
        idUtilisateurInscrit: this.utilisateurInscrit.identifiant,
        typeEntite: donneesMiseEnRelation.typeEntite.nom,
        secteursActivite: donneesMiseEnRelation.secteursActivite.map(
          (s) => s.nom
        ),
        departement: donneesMiseEnRelation.demandeAide.departement.code,
      },
      type: 'DIRECTE_UTILISATEUR_INSCRIT',
    };
  }
}
