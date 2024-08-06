import { CapteurCommande, Commande } from '../../domaine/commande';
import { DemandeDevenirAidant } from './DemandeDevenirAidant';
import { Entrepots } from '../../domaine/Entrepots';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { ErreurMAC } from '../../domaine/erreurMAC';
import { Departement } from '../departements';

export type CommandeDevenirAidant = Omit<Commande, 'type'> & {
  type: 'CommandeDevenirAidant';
  departement: Departement;
  mail: string;
  prenom: string;
  nom: string;
};

class ErreurDemandeDevenirAidant extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}

export class CapteurCommandeDevenirAidant
  implements CapteurCommande<CommandeDevenirAidant, DemandeDevenirAidant>
{
  constructor(private readonly entrepots: Entrepots) {}

  async execute(
    commande: CommandeDevenirAidant
  ): Promise<DemandeDevenirAidant> {
    const demandeExiste = await this.entrepots
      .demandesDevenirAidant()
      .demandeExiste(commande.mail);

    if (demandeExiste) {
      return Promise.reject(
        ErreurMAC.cree(
          'Demande devenir Aidant',
          new ErreurDemandeDevenirAidant(
            'Une demande pour ce compte existe déjà'
          )
        )
      );
    }

    const demandeDevenirAidant: DemandeDevenirAidant = {
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
