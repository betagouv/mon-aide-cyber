import { beforeEach, describe } from 'vitest';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import {
  CapteurSagaLanceAutoDiagnostic,
  DemandeAutoDiagnostic,
} from '../../src/auto-diagnostic/CapteurSagaLanceAutoDiagnostic';
import { AdaptateurReferentielDeTest } from '../adaptateurs/AdaptateurReferentielDeTest';
import { AdaptateurMesuresTest } from '../adaptateurs/AdaptateurMesuresTest';
import { Entrepots } from '../../src/domaine/Entrepots';
import { unReferentiel } from '../constructeurs/constructeurReferentiel';
import { BusCommande } from '../../src/domaine/commande';
import { BusCommandeMAC } from '../../src/infrastructure/bus/BusCommandeMAC';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { unConstructeurDeServices } from '../constructeurs/constructeurServices';
import { adaptateurUUID } from '../../src/infrastructure/adaptateurs/adaptateurUUID';
import crypto from 'crypto';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('Capteur pour lancer un Auto-Diagnostic', () => {
  let adaptateurReferentiel: AdaptateurReferentielDeTest;
  let adaptateurMesures: AdaptateurMesuresTest;
  let adaptateurEnvoiMail: AdaptateurEnvoiMailMemoire;
  let busEvenement: BusEvenementDeTest;
  let entrepots: Entrepots;
  let busCommande: BusCommande;

  beforeEach(() => {
    adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    busEvenement = new BusEvenementDeTest();
    adaptateurReferentiel = new AdaptateurReferentielDeTest();
    adaptateurMesures = new AdaptateurMesuresTest();
    entrepots = new EntrepotsMemoire();
    busCommande = new BusCommandeMAC(
      entrepots,
      busEvenement,
      adaptateurEnvoiMail,
      unConstructeurDeServices(entrepots.aidants())
    );
  });

  it('Crée la demande correspondante', async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const identifiantDemande = crypto.randomUUID();
    adaptateurUUID.genereUUID = () => identifiantDemande;
    const referentiel = unReferentiel().construis();
    adaptateurReferentiel.ajoute(referentiel);

    await new CapteurSagaLanceAutoDiagnostic(
      entrepots,
      busCommande,
      adaptateurReferentiel,
      adaptateurMesures
    ).execute({
      type: 'SagaLanceAutoDiagnostic',
      email: 'jean.dupont@email.com',
      dateSignatureCGU: FournisseurHorloge.maintenant(),
    });

    const demandes = await entrepots.demandesAutoDiagnostic().tous();
    expect(demandes).toHaveLength(1);
    expect(demandes[0]).toStrictEqual<DemandeAutoDiagnostic>({
      identifiant: identifiantDemande,
      dateSignatureCGU: FournisseurHorloge.maintenant(),
    });
  });
});
