import { BusCommande, CapteurCommande, Commande } from '../../domaine/commande';
import { Entrepots } from '../../domaine/Entrepots';
import { BusEvenement } from '../../domaine/BusEvenement';
import { CapteurSagaAjoutReponse } from '../../diagnostic/CapteurSagaAjoutReponse';
import { CapteurCommandeLanceRestitution } from '../../diagnostic/CapteurCommandeLanceRestitution';
import { CapteurCommandeLanceDiagnostic } from '../../diagnostic/CapteurCommandeLanceDiagnostic';
import { CapteurCommandeRechercheAideParEmail } from '../../aide/CapteurCommandeRechercheAideParEmail';
import { CapteurCommandeCreerAide } from '../../aide/CapteurCommandeCreerAide';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { CapteurSagaDemandeAide } from '../../gestion-demandes/aide/CapteurSagaDemandeAide';
import { CapteurCommandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/CapteurCommandeDevenirAidant';
import { fabriqueAnnuaireCOT } from '../adaptateurs/fabriqueAnnuaireCOT';
import { CapteurCommandeCreeCompteAidant } from '../../authentification/CapteurCommandeCreeCompteAidant';

import { ServiceAidant } from '../../authentification/ServiceAidant';
import { CapteurSagaFinaliseDemandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/CapteurSagaFinaliseDemandeDevenirAidant';
import { adaptateurServiceChiffrement } from '../adaptateurs/adaptateurServiceChiffrement';

type Services = {
  aidant: ServiceAidant;
};

type ParametresCapteur = {
  entrepots: Entrepots;
  busCommande?: BusCommande;
  busEvenements?: BusEvenement;
  adaptateurEnvoiMail?: AdaptateurEnvoiMail;
  services: Services;
};

type Capteur = {
  capteur: (parametres: ParametresCapteur) => CapteurCommande<Commande, any>;
};

const capteurs: Map<string, Capteur> = new Map([
  [
    'SagaAjoutReponse',
    {
      capteur: (parametres) =>
        new CapteurSagaAjoutReponse(
          parametres.entrepots,
          parametres.busCommande!,
          parametres.busEvenements!
        ),
    },
  ],
  [
    'SagaDemandeAide',
    {
      capteur: (parametres) =>
        new CapteurSagaDemandeAide(
          parametres.busCommande!,
          parametres.busEvenements!,
          parametres.adaptateurEnvoiMail!
        ),
    },
  ],
  [
    'CommandeRechercheAideParEmail',
    {
      capteur: (parametres) =>
        new CapteurCommandeRechercheAideParEmail(parametres.entrepots),
    },
  ],
  [
    'CommandeCreerAide',
    {
      capteur: (parametres) =>
        new CapteurCommandeCreerAide(parametres.entrepots),
    },
  ],
  [
    'CommandeLanceRestitution',
    {
      capteur: (parametres) =>
        new CapteurCommandeLanceRestitution(
          parametres.entrepots,
          parametres.busEvenements!
        ),
    },
  ],
  [
    'CommandeLanceDiagnostic',
    {
      capteur: (parametres) =>
        new CapteurCommandeLanceDiagnostic(
          parametres.entrepots,
          parametres.busEvenements!
        ),
    },
  ],
  [
    'CommandeDevenirAidant',
    {
      capteur: (parametres) =>
        new CapteurCommandeDevenirAidant(
          parametres.entrepots,
          parametres.busEvenements!,
          parametres.adaptateurEnvoiMail!,
          fabriqueAnnuaireCOT().annuaireCOT,
          parametres.services.aidant
        ),
    },
  ],
  [
    'CommandeCreeCompteAidant',
    {
      capteur: (parametres) =>
        new CapteurCommandeCreeCompteAidant(
          parametres.entrepots,
          parametres.busEvenements!
        ),
    },
  ],
  [
    'CommandeFinaliseDemandeDevenirAidant',
    {
      capteur: (parametres) =>
        new CapteurSagaFinaliseDemandeDevenirAidant(
          parametres.entrepots,
          parametres.busCommande!,
          parametres.busEvenements!,
          parametres.adaptateurEnvoiMail!,
          adaptateurServiceChiffrement()
        ),
    },
  ],
]);

export class BusCommandeMAC implements BusCommande {
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busEvenement: BusEvenement,
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly services: Services
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
          adaptateurEnvoiMail: this.adaptateurEnvoiMail,
          services: {
            aidant: this.services.aidant,
          },
        })
        .execute(commande);
    }
    throw new Error(`Impossible d'exécuter la demande '${commande.type}'`);
  }
}
