import { CapteurCommande, Commande } from '../domaine/commande';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement, Evenement } from '../domaine/BusEvenement';
import { genereLaRestitution } from './Diagnostic';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { ErreurMAC } from '../domaine/erreurMAC';
import crypto from 'crypto';

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

  execute(commande: CommandeLanceRestitution): Promise<void> {
    return this.entrepots
      .diagnostic()
      .lis(commande.idDiagnostic)
      .then((diagnostic) => {
        genereLaRestitution(diagnostic);
        return diagnostic;
      })
      .then(async (diagnostic) => {
        await this.entrepots.diagnostic().persiste(diagnostic);
        return diagnostic;
      })
      .then(
        (diagnostic) =>
          this.busEvenement?.publie<DiagnosticTermine>({
            identifiant: diagnostic.identifiant,
            type: 'DIAGNOSTIC_TERMINE',
            date: FournisseurHorloge.maintenant(),
            corps: { identifiantDiagnostic: diagnostic.identifiant },
          }),
      )
      .catch((erreur) =>
        Promise.reject(ErreurMAC.cree('Termine le diagnostic', erreur)),
      );
  }
}

export type DiagnosticTermine = Omit<Evenement, 'corps'> & {
  corps: {
    identifiantDiagnostic: crypto.UUID;
  };
};
