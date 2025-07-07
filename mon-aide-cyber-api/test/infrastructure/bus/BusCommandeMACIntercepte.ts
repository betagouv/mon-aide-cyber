import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { Commande } from '../../../src/domaine/commande';

export class BusCommandeMACIntercepte extends BusCommandeMAC {
  public commandesRecues: Map<string, any> = new Map();

  publie<C extends Commande, R>(commande: C): Promise<R> {
    this.commandesRecues.set(commande.type, commande);
    return super.publie(commande);
  }

  laCommande(nomCommande: string) {
    return this.commandesRecues.get(nomCommande);
  }
}
