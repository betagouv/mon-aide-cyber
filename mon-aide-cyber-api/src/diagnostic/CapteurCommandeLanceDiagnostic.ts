import { CapteurCommande, Commande } from '../domaine/commande';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement, Evenement } from '../domaine/BusEvenement';
import { Diagnostic, initialiseDiagnostic } from './Diagnostic';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { ErreurMAC } from '../domaine/erreurMAC';
import { Adaptateur } from '../adaptateurs/Adaptateur';
import { Referentiel } from './Referentiel';
import crypto from 'crypto';
import { ReferentielDeMesures } from './ReferentielDeMesures';

export class CapteurCommandeLanceDiagnostic
  implements CapteurCommande<CommandeLanceDiagnostic, Diagnostic>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busEvenement: BusEvenement,
    private readonly referentiel: Adaptateur<Referentiel>,
    private readonly referentielDeMesures: Adaptateur<ReferentielDeMesures>
  ) {}

  execute(commande: CommandeLanceDiagnostic): Promise<Diagnostic> {
    return Promise.all([
      this.referentiel.lis(),
      this.referentielDeMesures.lis(),
    ])
      .then(async ([ref, rec]) => {
        const diagnostic = initialiseDiagnostic(ref, rec);
        await this.entrepots.diagnostic().persiste(diagnostic);
        await this.busEvenement?.publie<DiagnosticLance>({
          identifiant: diagnostic.identifiant,
          type: 'DIAGNOSTIC_LANCE',
          date: FournisseurHorloge.maintenant(),
          corps: {
            identifiantDiagnostic: diagnostic.identifiant,
            identifiantUtilisateur: commande.identifiantAidant,
            emailEntite: commande.emailEntite,
          },
        });
        return diagnostic;
      })
      .catch((erreur) =>
        Promise.reject(ErreurMAC.cree('Lance le diagnostic', erreur))
      );
  }
}

export type CommandeLanceDiagnostic = Omit<Commande, 'type'> & {
  type: 'CommandeLanceDiagnostic';
  identifiantAidant: crypto.UUID;
  emailEntite: string;
};

export type DiagnosticLance = Evenement<{
  identifiantDiagnostic: crypto.UUID;
  identifiantUtilisateur: crypto.UUID;
  emailEntite: string;
}>;
