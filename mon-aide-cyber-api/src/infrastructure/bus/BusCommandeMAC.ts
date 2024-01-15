import { BusCommande, CapteurCommande, Commande } from '../../domaine/commande';
import { Entrepots } from '../../domaine/Entrepots';
import { BusEvenement } from '../../domaine/BusEvenement';
import { CapteurSagaAjoutReponse } from '../../diagnostic/CapteurSagaAjoutReponse';

const capteurs: Map<
  string,
  (
    entrepots: Entrepots,
    consomateursEvenements: BusEvenement,
  ) => CapteurCommande<Commande, any>
> = new Map([
  [
    'SagaAjoutReponse',
    (entrepots, busEvenement) =>
      new CapteurSagaAjoutReponse(entrepots, busEvenement),
  ],
]);
export class BusCommandeMAC implements BusCommande {
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busEvenement: BusEvenement,
  ) {}

  publie<C extends Commande>(commande: C): Promise<void> {
    const capteur = capteurs.get(commande.type);
    // La vérification ci-dessous est remontée par codeql https://github.com/github/codeql/blob/d540fc0794dcb2a6c10648b8925403788612e976/javascript/ql/src/Security/CWE-754/UnvalidatedDynamicMethodCall.ql
    if (typeof capteur === 'function') {
      return capteur(this.entrepots, this.busEvenement).execute(commande);
    }
    throw new Error(`Impossible d'exécuter la demande '${commande.type}'`);
  }
}
