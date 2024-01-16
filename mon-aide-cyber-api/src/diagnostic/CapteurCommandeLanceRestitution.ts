import { CapteurCommande, Commande } from '../domaine/commande';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement } from '../domaine/BusEvenement';

export type CommandeLanceRestitution = Omit<Commande, 'type'> & {
  type: 'CommandeLanceRestitution';
  idDiagnostic: string;
};

export class CapteurCommandeLanceRestitution
  implements CapteurCommande<CommandeLanceRestitution, void>
{
  constructor(
    public readonly entrepots: Entrepots,
    public readonly busEvenement: BusEvenement,
  ) {}

  execute(_: CommandeLanceRestitution): Promise<void> {
    return Promise.resolve(undefined);
  }
}
