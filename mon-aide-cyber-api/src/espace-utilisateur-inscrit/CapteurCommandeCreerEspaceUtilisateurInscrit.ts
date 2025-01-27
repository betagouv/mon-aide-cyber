import { CapteurCommande, Commande } from '../domaine/commande';
import crypto from 'crypto';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement } from '../domaine/BusEvenement';
import { AdaptateurEnvoiMail } from '../adaptateurs/AdaptateurEnvoiMail';

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
    _busEvenement: BusEvenement,
    _adaptateurEnvoiDeMail: AdaptateurEnvoiMail
  ) {}

  execute(
    commande: CommandeCreerEspaceUtilisateurInscrit
  ): Promise<EspaceUtilisateurInscritCree> {
    const utilisateur = {
      identifiant: commande.identifiant,
      email: commande.email,
      nomPrenom: commande.nomPrenom,
      ...(commande.siret && { entite: { siret: commande.siret } }),
    };
    return this.entrepots
      .utilisateursInscrits()
      .persiste(utilisateur)
      .then(() => {
        return {
          email: utilisateur.email,
          nomPrenom: utilisateur.nomPrenom,
          identifiant: utilisateur.identifiant,
        };
      });
  }
}
