import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { UtilisateurMACDTO } from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  DonneesMiseEnRelation,
  envoieConfirmationDemandeAide,
  MiseEnRelation,
} from './miseEnRelation';

export class MiseEnRelationDirecteUtilisateurInscrit implements MiseEnRelation {
  constructor(
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly utilisateurInscrit: UtilisateurMACDTO
  ) {}

  async execute(donneesMiseEnRelation: DonneesMiseEnRelation): Promise<void> {
    await envoieConfirmationDemandeAide(
      this.adaptateurEnvoiMail,
      donneesMiseEnRelation.demandeAide,
      this.utilisateurInscrit
    );
  }
}
