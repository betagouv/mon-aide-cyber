import { BusCommande, CapteurSaga, Saga } from '../domaine/commande';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement } from '../domaine/BusEvenement';
import { CommandeRechercheAideParEmail } from '../aide/CapteurCommandeRechercheAideParEmail';
import { CommandeCreerAide } from '../aide/CapteurCommandeCreerAide';

export type SagaDemandeValidationCGUAide = Saga & {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
};

export class CapteurSagaDemandeValidationCGUAide
  implements CapteurSaga<SagaDemandeValidationCGUAide, void>
{
  constructor(
    _entrepots: Entrepots,
    private readonly busCommande: BusCommande,
    _busEvenement: BusEvenement
  ) {}

  async execute(saga: SagaDemandeValidationCGUAide): Promise<void> {
    const commandeRechercheAideParEmail: CommandeRechercheAideParEmail = {
      type: 'CommandeRechercheAideParEmail',
      email: saga.email,
    };

    const aide = await this.busCommande.publie(commandeRechercheAideParEmail);

    if (aide) {
      return Promise.resolve();
    }

    const commandeCreerAide: CommandeCreerAide = {
      type: 'CommandeCreerAide',
      departement: saga.departement,
      email: saga.email,
      ...(saga.raisonSociale && { raisonSociale: saga.raisonSociale }),
    };

    return this.busCommande.publie(commandeCreerAide);
  }
}
