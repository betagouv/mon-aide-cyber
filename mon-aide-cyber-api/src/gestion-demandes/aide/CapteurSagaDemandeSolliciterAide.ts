import { BusCommande, CapteurSaga, Saga } from '../../domaine/commande';
import { Entrepots } from '../../domaine/Entrepots';
import { CommandeCreerAide } from '../../aide/CapteurCommandeCreerAide';

export type SagaDemandeSolliciterAide = Omit<Saga, 'type'> & {
  dateSignatureCGU: Date;
  email: string;
  departement: string;
  type: 'SagaDemandeSolliciterAide';
};

export class CapteurSagaDemandeSolliciterAide
  implements CapteurSaga<SagaDemandeSolliciterAide, void>
{
  constructor(
    _entrepots: Entrepots,
    private readonly busCommande: BusCommande
  ) {}

  execute(saga: SagaDemandeSolliciterAide): Promise<void> {
    const commande: CommandeCreerAide = {
      type: 'CommandeCreerAide',
      departement: saga.departement,
      email: saga.email,
    };
    return this.busCommande.publie<CommandeCreerAide, void>(commande);
  }
}
