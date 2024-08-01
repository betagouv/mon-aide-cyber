import { CapteurCommande, Commande } from '../../domaine/commande';
import { DemandeDevenirAidant } from './DemandeDevenirAidant';
import { Entrepots } from '../../domaine/Entrepots';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

export type CommandeDevenirAidant = Omit<Commande, 'type'> & {
  type: 'CommandeDevenirAidant';
  departement: string;
  mail: string;
  prenom: string;
  nom: string;
};

export class CapteurCommandeDevenirAidant
  implements CapteurCommande<CommandeDevenirAidant, DemandeDevenirAidant>
{
  constructor(private readonly entrepots: Entrepots) {}

  async execute(
    commande: CommandeDevenirAidant
  ): Promise<DemandeDevenirAidant> {
    const demandeDevenirAidant = {
      date: FournisseurHorloge.maintenant(),
      departement: commande.departement,
      identifiant: crypto.randomUUID(),
      mail: commande.mail,
      nom: commande.nom,
      prenom: commande.prenom,
    };

    await this.entrepots.demandesDevenirAidant().persiste(demandeDevenirAidant);

    return Promise.resolve(demandeDevenirAidant);
  }
}
