import { CapteurCommande, Commande } from '../domaine/commande';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement } from '../domaine/BusEvenement';
import { AdaptateurEnvoiMail } from '../adaptateurs/AdaptateurEnvoiMail';

export type CommandeReinitialisationMotDePasse = Commande & {
  type: 'CommandeReinitialisationMotDePasse';
  email: string;
};

export class CapteurCommandeReinitialisationMotDePasse
  implements CapteurCommande<CommandeReinitialisationMotDePasse, void>
{
  constructor(
    private readonly entrepots: Entrepots,
    _busEvenement: BusEvenement,
    _adapteurEnvoiMail: AdaptateurEnvoiMail
  ) {}

  execute(commande: CommandeReinitialisationMotDePasse): Promise<void> {
    return this.entrepots
      .utilisateurs()
      .rechercheParIdentifiantDeConnexion(commande.email)
      .then(() => Promise.resolve());
  }
}
