import { CapteurCommande, Commande } from '../domaine/commande';
import { Aide } from './Aide';
import { Entrepots } from '../domaine/Entrepots';

export type CommandeRechercheAideParEmail = Omit<Commande, 'type'> & {
  type: 'CommandeRechercheAideParEmail';
  email: string;
};

export class CapteurCommandeRechercheAideParEmail
  implements CapteurCommande<CommandeRechercheAideParEmail, Aide | undefined>
{
  constructor(private readonly entrepots: Entrepots) {}

  execute(commande: CommandeRechercheAideParEmail): Promise<Aide | undefined> {
    return this.entrepots.aides().rechercheParEmail(commande.email);
  }
}
