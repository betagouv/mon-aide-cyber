import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { UtilisateurMACDTO } from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { DemandeAide } from './DemandeAide';
import {
  envoieConfirmationDemandeAide,
  MiseEnRelation,
} from './miseEnRelation';

export class MiseEnRelationDirecteUtilisateurInscrit implements MiseEnRelation {
  constructor(
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly utilisateurInscrit: UtilisateurMACDTO
  ) {}

  async execute(demandeAide: DemandeAide): Promise<void> {
    await envoieConfirmationDemandeAide(
      this.adaptateurEnvoiMail,
      demandeAide,
      this.utilisateurInscrit
    );
  }
}
