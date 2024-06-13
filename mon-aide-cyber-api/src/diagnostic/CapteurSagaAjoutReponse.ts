import crypto from 'crypto';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement, Evenement } from '../domaine/BusEvenement';
import { ajouteLaReponseAuDiagnostic } from './Diagnostic';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { ErreurMAC } from '../domaine/erreurMAC';
import { BusCommande, CapteurSaga, Saga } from '../domaine/commande';
import { CommandeLanceRestitution } from './CapteurCommandeLanceRestitution';

class CapteurSagaAjoutReponse implements CapteurSaga<SagaAjoutReponse, void> {
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busCommande: BusCommande,
    private readonly busEvenement?: BusEvenement
  ) {}
  execute(commande: SagaAjoutReponse): Promise<void> {
    return this.entrepots
      .diagnostic()
      .lis(commande.idDiagnostic)
      .then((diagnostic) => {
        ajouteLaReponseAuDiagnostic(diagnostic, {
          chemin: commande.chemin,
          identifiant: commande.identifiant,
          reponse: commande.reponse,
        });
        return diagnostic;
      })
      .then(async (diagnostic) => {
        await this.entrepots.diagnostic().persiste(diagnostic);
        return diagnostic;
      })
      .then(async (diagnostic) => {
        const commande: CommandeLanceRestitution = {
          type: 'CommandeLanceRestitution',
          idDiagnostic: diagnostic.identifiant,
        };
        await this.busCommande.publie(commande);
        return diagnostic;
      })
      .then((diagnostic) =>
        this.busEvenement?.publie<ReponseAjoutee>({
          identifiant: diagnostic.identifiant,
          type: 'REPONSE_AJOUTEE',
          date: FournisseurHorloge.maintenant(),
          corps: {
            identifiantDiagnostic: diagnostic.identifiant,
            thematique: commande.chemin,
            identifiantQuestion: commande.identifiant,
            reponse: commande.reponse,
          },
        })
      )
      .catch((erreur) =>
        Promise.reject(ErreurMAC.cree('Ajout réponse au diagnostic', erreur))
      );
  }
}
export type CorpsReponseQuestionATiroir = {
  reponse: string;
  questions: { identifiant: string; reponses: string[] }[];
};
export type CorpsReponse = {
  chemin: string;
  identifiant: string;
  reponse: string | string[] | CorpsReponseQuestionATiroir;
};
type ReponseAjoutee = Omit<Evenement, 'corps'> & {
  corps: {
    identifiantDiagnostic: crypto.UUID;
    thematique: string;
    identifiantQuestion: string;
    reponse: string | string[] | CorpsReponseQuestionATiroir;
  };
};
export type SagaAjoutReponse = Omit<Saga, 'type'> & {
  type: 'SagaAjoutReponse';
  idDiagnostic: crypto.UUID;
  chemin: string;
  identifiant: string;
  reponse: string | string[] | CorpsReponseQuestionATiroir;
};

export { CapteurSagaAjoutReponse };
