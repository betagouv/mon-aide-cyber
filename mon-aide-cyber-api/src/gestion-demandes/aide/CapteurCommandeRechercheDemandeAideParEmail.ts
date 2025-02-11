import { DemandeAide } from './DemandeAide';
import { CapteurCommande, Commande } from '../../domaine/commande';
import { Entrepots } from '../../domaine/Entrepots';

export type CommandeRechercheAideParEmail = Omit<Commande, 'type'> & {
  type: 'CommandeRechercheAideParEmail';
  email: string;
};

export class CapteurCommandeRechercheDemandeAideParEmail
  implements
    CapteurCommande<CommandeRechercheAideParEmail, DemandeAide | undefined>
{
  constructor(private readonly entrepots: Entrepots) {}

  execute(
    commande: CommandeRechercheAideParEmail
  ): Promise<DemandeAide | undefined> {
    return this.entrepots.demandesAides().rechercheParEmail(commande.email);
  }
}
