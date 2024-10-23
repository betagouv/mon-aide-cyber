import { CapteurSaga, Saga } from '../../domaine/commande';
import { Entrepots } from '../../domaine/Entrepots';
import crypto from 'crypto';

export type SagaDemandeSolliciterAide = Omit<Saga, 'type'> & {
  dateSignatureCGU: Date;
  email: string;
  departement: string;
  type: 'SagaDemandeSolliciterAide';
};

export class CapteurSagaDemandeSolliciterAide
  implements CapteurSaga<SagaDemandeSolliciterAide, void>
{
  constructor(private readonly entrepots: Entrepots) {}

  execute(saga: SagaDemandeSolliciterAide): Promise<void> {
    return this.entrepots.aides().persiste({
      identifiant: crypto.randomUUID(),
      dateSignatureCGU: saga.dateSignatureCGU,
      email: saga.email,
      departement: saga.departement,
    });
  }
}
