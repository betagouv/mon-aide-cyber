import { BusCommande, CapteurCommande, Commande } from '../../domaine/commande';
import { Entrepots } from '../../domaine/Entrepots';
import { BusEvenement } from '../../domaine/BusEvenement';
import { CapteurSagaAjoutReponse } from '../../diagnostic/CapteurSagaAjoutReponse';
import { CapteurCommandeLanceRestitution } from '../../diagnostic/CapteurCommandeLanceRestitution';
import { CapteurCommandeLanceDiagnostic } from '../../diagnostic/CapteurCommandeLanceDiagnostic';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { CapteurSagaDemandeAide } from '../../gestion-demandes/aide/CapteurSagaDemandeAide';
import { CapteurCommandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/CapteurCommandeDevenirAidant';
import { fabriqueAnnuaireCOT } from '../adaptateurs/fabriqueAnnuaireCOT';
import { CapteurSagaActivationCompteAidant } from '../../gestion-demandes/devenir-aidant/CapteurSagaActivationCompteAidant';
import { adaptateurServiceChiffrement } from '../adaptateurs/adaptateurServiceChiffrement';
import { CapteurCommandeCreeEspaceAidant } from '../../espace-aidant/CapteurCommandeCreeEspaceAidant';
import { CapteurSagaDemandeAidantCreeEspaceAidant } from '../../gestion-demandes/devenir-aidant/CapteurSagaDemandeAidantCreeEspaceAidant';
import { Adaptateur } from '../../adaptateurs/Adaptateur';
import { Referentiel } from '../../diagnostic/Referentiel';
import { ReferentielDeMesures } from '../../diagnostic/ReferentielDeMesures';
import { ServiceAidant } from '../../espace-aidant/ServiceAidant';
import { CapteurCommandeCreeUtilisateur } from '../../authentification/CapteurCommandeCreeUtilisateur';
import { CapteurCommandeReinitialisationMotDePasse } from '../../authentification/reinitialisation-mot-de-passe/CapteurCommandeReinitialisationMotDePasse';
import {
  CapteurCommandeDemandeDiagnosticLibreAcces,
  CapteurSagaLanceDiagnosticLibreAcces,
} from '../../diagnostic-libre-acces/CapteurSagaLanceDiagnosticLibreAcces';
import { CapteurCommandeCreerEspaceUtilisateurInscrit } from '../../espace-utilisateur-inscrit/CapteurCommandeCreerEspaceUtilisateurInscrit';
import { CapteurCommandeRechercheDemandeAideParEmail } from '../../gestion-demandes/aide/CapteurCommandeRechercheDemandeAideParEmail';
import { CapteurCommandeCreerDemandeAide } from '../../gestion-demandes/aide/CapteurCommandeCreerDemandeAide';
import { CapteurCommandeMettreAJourDemandeAide } from '../../gestion-demandes/aide/CapteurCommandeMettreAJourDemandeAide';
import { adaptateurRepertoireDeContacts } from '../../adaptateurs/adaptateurRepertoireDeContacts';
import { AdaptateurRelations } from '../../relation/AdaptateurRelations';
import { AdaptateurRelationsMAC } from '../../relation/AdaptateurRelationsMAC';
import { fabriqueMiseEnRelation } from '../../gestion-demandes/aide/miseEnRelation';
import { AdaptateurRechercheEntreprise } from '../adaptateurs/adaptateurRechercheEntreprise';
import { CapteurCommandeAttribueDemandeAide } from '../../gestion-demandes/aide/CapteurCommandeAttribueDemandeAide';
import { unAdaptateurGeographie } from '../../adaptateurs/AdaptateurGeographie';

export type Services = {
  aidant: ServiceAidant;
  referentiels: {
    diagnostic: Adaptateur<Referentiel>;
    mesures: Adaptateur<ReferentielDeMesures>;
  };
};

type ParametresCapteur = {
  entrepots: Entrepots;
  busCommande?: BusCommande;
  busEvenements?: BusEvenement;
  adaptateurEnvoiMail?: AdaptateurEnvoiMail;
  services: Services;
  adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  adaptateurRelations: AdaptateurRelations;
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
          parametres.entrepots.utilisateursMAC(),
          fabriqueMiseEnRelation(
            parametres.adaptateurEnvoiMail!,
            fabriqueAnnuaireCOT().annuaireCOT(),
            parametres.entrepots,
            unAdaptateurGeographie()
          ),
          parametres.adaptateurRechercheEntreprise
        ),
    },
  ],
  [
    'CommandeRechercheAideParEmail',
    {
      capteur: (parametres) =>
        new CapteurCommandeRechercheDemandeAideParEmail(parametres.entrepots),
    },
  ],
  [
    'CommandeCreerDemandeAide',
    {
      capteur: (parametres) =>
        new CapteurCommandeCreerDemandeAide(parametres.entrepots),
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
          parametres.busEvenements!,
          parametres.services.referentiels.diagnostic,
          parametres.services.referentiels.mesures
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
    'CommandeCreeUtilisateur',
    {
      capteur: (parametres) =>
        new CapteurCommandeCreeUtilisateur(parametres.entrepots),
    },
  ],
  [
    'CommandeCreeEspaceAidant',
    {
      capteur: (parametres) =>
        new CapteurCommandeCreeEspaceAidant(
          parametres.entrepots,
          parametres.busEvenements!,
          adaptateurRepertoireDeContacts(),
          parametres.adaptateurRelations
        ),
    },
  ],
  [
    'CommandeCreerEspaceUtilisateurInscrit',
    {
      capteur: (parametres) =>
        new CapteurCommandeCreerEspaceUtilisateurInscrit(
          parametres.entrepots,
          parametres.busEvenements!,
          parametres.adaptateurEnvoiMail!,
          adaptateurRepertoireDeContacts()
        ),
    },
  ],
  [
    'SagaActivationCompteAidant',
    {
      capteur: (parametres) =>
        new CapteurSagaActivationCompteAidant(
          parametres.entrepots,
          parametres.busEvenements!,
          parametres.adaptateurEnvoiMail!,
          parametres.busCommande!
        ),
    },
  ],
  [
    'SagaDemandeAidantEspaceAidant',
    {
      capteur: (parametres) =>
        new CapteurSagaDemandeAidantCreeEspaceAidant(
          parametres.entrepots,
          parametres.busCommande!,
          parametres.busEvenements!
        ),
    },
  ],
  [
    'CommandeReinitialisationMotDePasse',
    {
      capteur: (parametres) =>
        new CapteurCommandeReinitialisationMotDePasse(
          parametres.entrepots,
          parametres.busEvenements!,
          parametres.adaptateurEnvoiMail!,
          adaptateurServiceChiffrement()
        ),
    },
  ],
  [
    'SagaLanceDiagnosticLibreAcces',
    {
      capteur: (parametres) =>
        new CapteurSagaLanceDiagnosticLibreAcces(
          parametres.entrepots,
          parametres.busCommande!,
          parametres.busEvenements!,
          parametres.services.referentiels.diagnostic,
          parametres.services.referentiels.mesures
        ),
    },
  ],
  [
    'CommandeDemandeDiagnosticLibreAcces',
    {
      capteur: (parametres) =>
        new CapteurCommandeDemandeDiagnosticLibreAcces(parametres.entrepots),
    },
  ],
  [
    'CommandeMettreAJourDemandeAide',
    {
      capteur: (parametres) =>
        new CapteurCommandeMettreAJourDemandeAide(
          parametres.entrepots.demandesAides()
        ),
    },
  ],
  [
    'CommandeAttribueDemandeAide',
    {
      capteur: (parametres) =>
        new CapteurCommandeAttribueDemandeAide(
          parametres.adaptateurEnvoiMail!,
          parametres.adaptateurRelations,
          parametres.busEvenements!,
          parametres.entrepots!,
          parametres.adaptateurRechercheEntreprise
        ),
    },
  ],
]);

export class BusCommandeMAC implements BusCommande {
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busEvenement: BusEvenement,
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly services: Services,
    private readonly adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise,
    private readonly adaptateurRelations: AdaptateurRelations = new AdaptateurRelationsMAC()
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
            referentiels: {
              diagnostic: this.services.referentiels.diagnostic,
              mesures: this.services.referentiels.mesures,
            },
          },
          adaptateurRechercheEntreprise: this.adaptateurRechercheEntreprise,
          adaptateurRelations: this.adaptateurRelations,
        })
        .execute(commande);
    }
    throw new Error(`Impossible d'exécuter la demande '${commande.type}'`);
  }
}
