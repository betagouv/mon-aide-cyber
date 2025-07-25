import serveur from '../../src/serveur';
import { AdaptateurReferentielDeTest } from '../adaptateurs/AdaptateurReferentielDeTest';
import { AdaptateurTranscripteurDeTest } from '../adaptateurs/adaptateurTranscripteur';
import { AdaptateurMesuresTest } from '../adaptateurs/AdaptateurMesuresTest';
import { Express, NextFunction, Request, Response } from 'express';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurGestionnaireErreursMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurGestionnaireErreursMemoire';
import { FauxGestionnaireDeJeton } from '../infrastructure/authentification/FauxGestionnaireDeJeton';
import { AdaptateurDeVerificationDeSessionDeTest } from '../adaptateurs/AdaptateurDeVerificationDeSessionDeTest';
import { unAdaptateurDeRestitutionHTML } from '../adaptateurs/ConstructeurAdaptateurRestitutionHTML';
import { AdaptateursRestitution } from '../../src/adaptateurs/AdaptateursRestitution';
import { unAdaptateurRestitutionPDF } from '../adaptateurs/ConstructeurAdaptateurRestitutionPDF';
import { AdaptateurEnvoiMail } from '../../src/adaptateurs/AdaptateurEnvoiMail';
import { AdaptateurEnvoiMailMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { AdapatateurDeVerificationDeCGUDeTest } from '../adaptateurs/AdaptateurDeVerificationDeCGUDeTest';
import { AdaptateurDeGestionDeCookiesDeTest } from '../adaptateurs/AdaptateurDeGestionDeCookiesDeTest';
import { AdaptateurRelationsMAC } from '../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../src/relation/infrastructure/EntrepotRelationMemoire';
import { AdaptateurDeVerificationDesAccesDeTest } from '../adaptateurs/AdaptateurDeVerificationDesAccesDeTest';
import { ServiceDeChiffrement } from '../../src/securite/ServiceDeChiffrement';
import { ServiceDeChiffrementClair } from '../infrastructure/securite/ServiceDeChiffrementClair';
import { AdaptateurMetabaseMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurMetabaseMemoire';
import { unServiceAidant } from '../../src/espace-aidant/ServiceAidantMAC';
import { AdaptateurDeVerificationDuTypeDeRelationDeTest } from '../adaptateurs/AdaptateurDeVerificationDuTypeDeRelationDeTest';
import { AdaptateurProConnect } from '../../src/adaptateurs/pro-connect/adaptateurProConnect';
import { AdaptateurProConnectDeTest } from '../adaptateurs/pro-connect/AdaptateurProConnectDeTest';
import { AdaptateurDeVerificationDeDemandeDeTest } from '../adaptateurs/AdaptateurDeVerificationDeDemandeDeTest';
import { AdaptateurDeVerificationDeDemande } from '../../src/adaptateurs/AdaptateurDeVerificationDeDemande';
import { AdaptateurAseptisationDeTest } from '../adaptateurs/AdaptateurAseptisationDeTest';
import { AdaptateurRepertoireDeContactsMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurRepertoireDeContactsMemoire';
import { unAdaptateurRechercheEntreprise } from '../constructeurs/constructeurAdaptateurRechercheEntrepriseEnDur';
import { AdaptateurCmsCrispMACMemoire } from '../adaptateurs/AdaptateurCmsCrispMACMemoire';
import { AdaptateurCmsCrispMAC } from '../../src/adaptateurs/AdaptateurCmsCrispMAC';
import { AdaptateurRelations } from '../../src/relation/AdaptateurRelations';
import { AdaptateurSignatureRequeteDeTest } from '../adaptateurs/AdaptateurSignatureRequeteDeTest';
import { BusCommandeMACIntercepte } from '../infrastructure/bus/BusCommandeMACIntercepte';
import { Messagerie } from '../../src/infrastructure/adaptateurs/AdaptateurMessagerieMattermost';
import { AdaptateurMessagerieMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurMessagerieMemoire';

const PORT_DISPONIBLE = 0;

class TesteurIntegrationMAC {
  private serveurDeTest:
    | {
        app: Express;
        arreteEcoute: () => void;
        ecoute: (port: number, succes: () => void) => void;
      }
    | undefined = undefined;

  constructor(
    public adaptateurRelations: AdaptateurRelations = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire()
    ),
    public adaptateurReferentiel = new AdaptateurReferentielDeTest(),
    public adaptateurMesures = new AdaptateurMesuresTest(),
    public adaptateurTranscripteurDonnees = new AdaptateurTranscripteurDeTest(),
    public entrepots = new EntrepotsMemoire(),
    public busEvenement = new BusEvenementDeTest(),
    public gestionnaireDeJeton = new FauxGestionnaireDeJeton(),
    public adaptateurDeVerificationDeCGU = new AdapatateurDeVerificationDeCGUDeTest(),
    public adaptateurAseptisation = new AdaptateurAseptisationDeTest(),
    public adaptateurDeVerificationDeDemande: AdaptateurDeVerificationDeDemande = new AdaptateurDeVerificationDeDemandeDeTest(),
    public adaptateurDeVerificationDeSession: AdaptateurDeVerificationDeSessionDeTest = new AdaptateurDeVerificationDeSessionDeTest(),
    public adaptateurDeVerificationDesAcces = new AdaptateurDeVerificationDesAccesDeTest(),
    public adaptateurDeVerificationDeRelations = new AdaptateurDeVerificationDuTypeDeRelationDeTest(),
    public repertoireDeContacts = new AdaptateurRepertoireDeContactsMemoire(),
    public gestionnaireErreurs = new AdaptateurGestionnaireErreursMemoire(),
    public adaptateurEnvoieMessage: AdaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire(),
    public messagerie: Messagerie = new AdaptateurMessagerieMemoire(),
    public serviceDeChiffrement: ServiceDeChiffrement = new ServiceDeChiffrementClair(),
    public adaptateurDeGestionDeCookies: AdaptateurDeGestionDeCookiesDeTest = new AdaptateurDeGestionDeCookiesDeTest(),
    public adaptateursRestitution: AdaptateursRestitution = {
      html() {
        return unAdaptateurDeRestitutionHTML().construis();
      },

      pdf() {
        return unAdaptateurRestitutionPDF();
      },
    },
    public adaptateurMetabase: AdaptateurMetabaseMemoire = new AdaptateurMetabaseMemoire(),
    public adaptateurProConnect: AdaptateurProConnect = new AdaptateurProConnectDeTest(),
    public adaptateurDeRechercheEntreprise = unAdaptateurRechercheEntreprise().construis(),
    public adaptateurCmsCrisp: AdaptateurCmsCrispMAC = new AdaptateurCmsCrispMACMemoire(),
    public adaptateurSignatureRequete: AdaptateurSignatureRequeteDeTest = new AdaptateurSignatureRequeteDeTest(),
    public busCommande: BusCommandeMACIntercepte = new BusCommandeMACIntercepte(
      entrepots,
      busEvenement,
      adaptateurEnvoieMessage,
      {
        aidant: unServiceAidant(entrepots.aidants()),
        referentiels: {
          diagnostic: adaptateurReferentiel,
          mesures: adaptateurMesures,
        },
      },
      adaptateurDeRechercheEntreprise,
      adaptateurRelations
    )
  ) {}

  initialise() {
    this.busCommande = new BusCommandeMACIntercepte(
      this.entrepots,
      this.busEvenement,
      this.adaptateurEnvoieMessage,
      {
        aidant: unServiceAidant(this.entrepots.aidants()),
        referentiels: {
          diagnostic: this.adaptateurReferentiel,
          mesures: this.adaptateurMesures,
        },
      },
      this.adaptateurDeRechercheEntreprise,
      this.adaptateurRelations
    );
    this.serveurDeTest = serveur.creeServeur({
      adaptateurRelations: this.adaptateurRelations,
      adaptateurReferentiel: this.adaptateurReferentiel,
      adaptateurTranscripteurDonnees: this.adaptateurTranscripteurDonnees,
      adaptateurMesures: this.adaptateurMesures,
      entrepots: this.entrepots,
      busCommande: this.busCommande,
      busEvenement: this.busEvenement,
      gestionnaireErreurs: this.gestionnaireErreurs,
      gestionnaireDeJeton: this.gestionnaireDeJeton,
      adaptateurDeGestionDeCookies: this.adaptateurDeGestionDeCookies,
      adaptateurAseptisation: this.adaptateurAseptisation,
      adaptateurDeVerificationDeCGU: this.adaptateurDeVerificationDeCGU,
      adaptateurDeVerificationDeDemande: this.adaptateurDeVerificationDeDemande,
      adaptateurDeVerificationDeSession: this.adaptateurDeVerificationDeSession,
      adaptateurDeVerificationDesAcces: this.adaptateurDeVerificationDesAcces,
      adaptateursRestitution: this.adaptateursRestitution,
      avecProtectionCsrf: false,
      adaptateurEnvoiMessage: this.adaptateurEnvoieMessage,
      messagerie: this.messagerie,
      serviceDeChiffrement: this.serviceDeChiffrement,
      adaptateurMetabase: this.adaptateurMetabase,
      adaptateurDeVerificationDeRelations:
        this.adaptateurDeVerificationDeRelations,
      repertoireDeContacts: this.repertoireDeContacts,
      adaptateurProConnect: this.adaptateurProConnect,
      adaptateurRechercheEntreprise: this.adaptateurDeRechercheEntreprise,
      adaptateurCmsCrisp: this.adaptateurCmsCrisp,
      adaptateurSignatureRequete: this.adaptateurSignatureRequete,
      estEnMaintenance: false,
      redirigeVersUrlBase: (
        _requete: Request,
        _reponse: Response,
        suite: NextFunction
      ) => suite(),
    });
    const portEcoute = PORT_DISPONIBLE;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.serveurDeTest.ecoute(portEcoute, () => {});
    return { portEcoute: portEcoute, app: this.serveurDeTest.app };
  }

  arrete() {
    this.entrepots = new EntrepotsMemoire();
    this.serveurDeTest?.arreteEcoute();
  }
}

const testeurIntegration = () => new TesteurIntegrationMAC();

export default testeurIntegration;
