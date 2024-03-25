import {
  BusCommande,
  CapteurCommande,
  Commande,
} from '../../../src/domaine/commande';

export class BusCommandeTest implements BusCommande {
  private commandesRecues: string[] = [];

  constructor(
    private readonly capteurs?: {
      [nomCommande: string]: CapteurCommande<any, any>;
    },
  ) {}

  publie<C extends Commande, R>(commande: C): Promise<R> {
    this.commandesRecues.push(commande.type);
    const capteurs = this.capteurs ? Object.entries(this.capteurs) : [];
    return capteurs.length > 0
      ? this.capteurs![commande.type].execute(commande)
      : Promise.resolve(undefined as R);
  }

  aRecu(typeCommande: string): boolean {
    return this.commandesRecues.includes(typeCommande);
  }
}
