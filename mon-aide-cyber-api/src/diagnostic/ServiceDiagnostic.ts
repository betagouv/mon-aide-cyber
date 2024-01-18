import { Diagnostic, initialiseDiagnostic } from './Diagnostic';
import * as crypto from 'crypto';
import { Entrepots } from '../domaine/Entrepots';
import { Adaptateur } from '../adaptateurs/Adaptateur';
import { Referentiel } from './Referentiel';
import { TableauDeRecommandations } from './TableauDeRecommandations';
import { BusEvenement, Evenement } from '../domaine/BusEvenement';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { ErreurMAC } from '../domaine/erreurMAC';

export class ServiceDiagnostic {
  constructor(
    private readonly adaptateurReferentiel: Adaptateur<Referentiel>,
    private readonly adaptateurTableauDeRecommandations: Adaptateur<TableauDeRecommandations>,
    private readonly entrepots: Entrepots,
    private readonly busEvenement?: BusEvenement,
  ) {}

  diagnostic = async (id: crypto.UUID): Promise<Diagnostic> =>
    await this.entrepots
      .diagnostic()
      .lis(id)
      .catch((erreur) =>
        Promise.reject(ErreurMAC.cree('Accès diagnostic', erreur)),
      );

  lance = async (): Promise<Diagnostic> => {
    return Promise.all([
      this.adaptateurReferentiel.lis(),
      this.adaptateurTableauDeRecommandations.lis(),
    ])
      .then(async ([ref, rec]) => {
        const diagnostic = initialiseDiagnostic(ref, rec);
        await this.entrepots.diagnostic().persiste(diagnostic);
        await this.busEvenement?.publie<DiagnosticLance>({
          identifiant: diagnostic.identifiant,
          type: 'DIAGNOSTIC_LANCE',
          date: FournisseurHorloge.maintenant(),
          corps: { identifiantDiagnostic: diagnostic.identifiant },
        });
        return diagnostic;
      })
      .catch((erreur) =>
        Promise.reject(ErreurMAC.cree('Lance le diagnostic', erreur)),
      );
  };
}

export type DiagnosticLance = Omit<Evenement, 'corps'> & {
  corps: {
    identifiantDiagnostic: crypto.UUID;
  };
};
