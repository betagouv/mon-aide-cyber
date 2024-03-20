import { BusCommande, CapteurCommande, Commande } from '../../domaine/commande';
import { Entrepots } from '../../domaine/Entrepots';
import { BusEvenement } from '../../domaine/BusEvenement';
import { CapteurSagaAjoutReponse } from '../../diagnostic/CapteurSagaAjoutReponse';
import { CapteurCommandeLanceRestitution } from '../../diagnostic/CapteurCommandeLanceRestitution';
import { CapteurCommandeLanceDiagnostic } from '../../diagnostic/CapteurCommandeLanceDiagnostic';
import { CapteurSagaDemandeValidationCGUAide } from '../../parcours-cgu-aide/CapteurSagaDemandeValidationCGUAide';

type ParametresCapteur = {
  entrepots: Entrepots;
  busCommande?: BusCommande;
  busEvenements?: BusEvenement;
};

type Capteur = {
  capteur: (parametres: ParametresCapteur) => CapteurCommande<Commande, any>;
};
const capteurs: Map<string, Capteur> = new Map([
  [
    'SagaAjoutReponse',
    {
      capteur: (parametres) =>
        new CapteurSagaAjoutReponse(parametres.entrepots, parametres.busCommande!, parametres.busEvenements!),
    },
  ],
  [
    'SagaDemandeValidationCGUAide',
    {
      capteur: (parametres) =>
        new CapteurSagaDemandeValidationCGUAide(
          parametres.entrepots,
          parametres.busCommande!,
          parametres.busEvenements!,
        ),
    },
  ],
  [
    'CommandeLanceRestitution',
    {
      capteur: (parametres) => new CapteurCommandeLanceRestitution(parametres.entrepots, parametres.busEvenements!),
    },
  ],
  [
    'CommandeLanceDiagnostic',
    {
      capteur: (parametres) => new CapteurCommandeLanceDiagnostic(parametres.entrepots, parametres.busEvenements!),
    },
  ],
]);

export class BusCommandeMAC implements BusCommande {
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busEvenement: BusEvenement,
  ) {}

  publie<C extends Commande, R>(commande: C): Promise<R> {
    const capteur = capteurs.get(commande.type);
    // La vérification ci-dessous est remontée par codeql https://github.com/github/codeql/blob/d540fc0794dcb2a6c10648b8925403788612e976/javascript/ql/src/Security/CWE-754/UnvalidatedDynamicMethodCall.ql
    if (capteur && typeof capteur.capteur === 'function') {
      return capteur
        .capteur({
          entrepots: this.entrepots,
          busCommande: this,
          busEvenements: this.busEvenement,
        })
        .execute(commande);
    }
    throw new Error(`Impossible d'exécuter la demande '${commande.type}'`);
  }
}
