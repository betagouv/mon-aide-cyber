import { CapteurCommande, Commande } from '../domaine/commande';
import crypto from 'crypto';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement, Evenement } from '../domaine/BusEvenement';
import { AdaptateurEnvoiMail } from '../adaptateurs/AdaptateurEnvoiMail';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { adaptateurCorpsMessage } from './tableau-de-bord/adaptateurCorpsMessage';

export type CommandeCreerEspaceUtilisateurInscrit = Omit<Commande, 'type'> & {
  identifiant: crypto.UUID;
  type: 'CommandeCreerEspaceUtilisateurInscrit';
  email: string;
  nomPrenom: string;
  siret?: string;
};

export type EspaceUtilisateurInscritCree = {
  identifiant: crypto.UUID;
  email: string;
  nomPrenom: string;
};

export class CapteurCommandeCreerEspaceUtilisateurInscrit
  implements
    CapteurCommande<
      CommandeCreerEspaceUtilisateurInscrit,
      EspaceUtilisateurInscritCree
    >
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busEvenement: BusEvenement,
    private readonly adaptateurEnvoiDeMail: AdaptateurEnvoiMail
  ) {}

  async execute(
    commande: CommandeCreerEspaceUtilisateurInscrit
  ): Promise<EspaceUtilisateurInscritCree> {
    const utilisateur = {
      identifiant: commande.identifiant,
      email: commande.email,
      nomPrenom: commande.nomPrenom,
      ...(commande.siret && { entite: { siret: commande.siret } }),
    };

    await this.entrepots.utilisateursInscrits().persiste(utilisateur);

    await this.adaptateurEnvoiDeMail.envoie({
      destinataire: { email: commande.email },
      corps: adaptateurCorpsMessage
        .confirmationUtilisateurInscritCree()
        .genereCorpsMessage(commande.nomPrenom),
      objet: 'MonAideCyber - Votre inscription au dispositif est confirmée',
    });

    await this.busEvenement.publie<UtilisateurInscritCree>({
      corps: {
        identifiant: utilisateur.identifiant,
        typeUtilisateur: 'UtilisateurInscrit',
      },
      identifiant: utilisateur.identifiant,
      type: 'UTILISATEUR_INSCRIT_CREE',
      date: FournisseurHorloge.maintenant(),
    });

    return {
      email: utilisateur.email,
      nomPrenom: utilisateur.nomPrenom,
      identifiant: utilisateur.identifiant,
    };
  }
}

export type UtilisateurInscritCree = Evenement<{
  identifiant: crypto.UUID;
  typeUtilisateur: 'UtilisateurInscrit';
}>;
