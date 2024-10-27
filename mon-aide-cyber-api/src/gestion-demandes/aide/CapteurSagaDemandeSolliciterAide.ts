import {
  BusCommande,
  CapteurCommande,
  CapteurSaga,
  Commande,
  Saga,
} from '../../domaine/commande';
import { Entrepots } from '../../domaine/Entrepots';
import { CommandeCreerAide } from '../../aide/CapteurCommandeCreerAide';
import { Aide } from '../../aide/Aide';
import crypto from 'crypto';
import { Departement, rechercheParNomDepartement } from '../departements';
import { Adaptateur } from '../../adaptateurs/Adaptateur';
import { Referentiel } from '../../diagnostic/Referentiel';
import { ReferentielDeMesures } from '../../diagnostic/ReferentielDeMesures';
import {
  ajouteLaReponseAuDiagnostic,
  initialiseDiagnostic,
} from '../../diagnostic/Diagnostic';

export type SagaDemandeSolliciterAide = Omit<Saga, 'type'> & {
  dateSignatureCGU: Date;
  email: string;
  departement: string;
  type: 'SagaDemandeSolliciterAide';
};

type CommandeInitieDiagnosticAide = Commande & {
  type: 'CommandeInitieDiagnosticAide';
  departement: Departement;
  identifiantAide: crypto.UUID;
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
    return this.busCommande
      .publie<CommandeCreerAide, Aide>(commande)
      .then(async (aide) => {
        await this.busCommande.publie<
          CommandeInitieDiagnosticAide,
          crypto.UUID
        >({
          type: 'CommandeInitieDiagnosticAide',
          departement: rechercheParNomDepartement(aide.departement),
          identifiantAide: aide.identifiant,
        });
      });
  }
}

export class CapteurCommandeInitieDiagnosticAide
  implements CapteurCommande<CommandeInitieDiagnosticAide, crypto.UUID>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly diagnostic: Adaptateur<Referentiel>,
    private readonly mesures: Adaptateur<ReferentielDeMesures>,
    private readonly _questionDepartementEntite = 'contexte-departement-tom-siege-social'
  ) {}

  execute(commande: CommandeInitieDiagnosticAide): Promise<crypto.UUID> {
    return Promise.all([this.diagnostic.lis(), this.mesures.lis()]).then(
      async ([referentiel, mesures]) => {
        const diagnostic = initialiseDiagnostic(referentiel, mesures);
        const reponse = diagnostic.referentiel['contexte'].questions
          .find((q) => q.identifiant === this._questionDepartementEntite)
          ?.reponsesPossibles.find(
            (q) => q.libelle === commande.departement.nom
          );
        ajouteLaReponseAuDiagnostic(diagnostic, {
          identifiant: this._questionDepartementEntite,
          reponse: reponse!.identifiant,
          chemin: 'contexte',
        });
        return this.entrepots
          .diagnostic()
          .persiste(diagnostic)
          .then(() => diagnostic.identifiant);
      }
    );
  }
}
