import { BusCommande, Commande } from '../../../src/domaine/commande';

export class BusCommandeTests implements BusCommande {
  private commandesRecues: string[] = [];

  publie<C extends Commande, R>(commande: C): Promise<R> {
    this.commandesRecues.push(commande.type);
    return Promise.resolve(undefined as R);
  }

  aRecu(typeCommande: string): boolean {
    return this.commandesRecues.includes(typeCommande);
  }
}
