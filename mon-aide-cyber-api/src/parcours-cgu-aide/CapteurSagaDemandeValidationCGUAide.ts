import { BusCommande, CapteurSaga, Saga } from '../domaine/commande';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement } from '../domaine/BusEvenement';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

export type SagaDemandeValidationCGUAide = Saga & {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale: string;
};

export class CapteurSagaDemandeValidationCGUAide implements CapteurSaga<SagaDemandeValidationCGUAide, void> {
  constructor(
    private readonly entrepots: Entrepots,
    _busCommande: BusCommande,
    _busEvenement: BusEvenement,
  ) {}

  execute(_saga: SagaDemandeValidationCGUAide): Promise<void> {
    return this.entrepots.aides().persiste({
      identifiant: crypto.randomUUID(),
      dateSignatureCGU: FournisseurHorloge.maintenant(),
    });
  }
}
