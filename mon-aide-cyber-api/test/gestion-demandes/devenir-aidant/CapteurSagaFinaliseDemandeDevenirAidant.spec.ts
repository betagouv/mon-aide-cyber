import { describe, expect } from 'vitest';
import { Aidant } from '../../../src/authentification/Aidant';
import { unConstructeurDeDemandeDevenirAidant } from './constructeurDeDemandeDevenirAidant';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { ServiceDevenirAidant } from '../../../src/gestion-demandes/devenir-aidant/ServiceDevenirAidant';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import {
  CapteurSagaFinaliseDemandeDevenirAidant,
  DemandeDevenirAidantFinalisee,
} from '../../../src/gestion-demandes/devenir-aidant/CapteurSagaFinaliseDemandeDevenirAidant';
import { unServiceAidant } from '../../../src/authentification/ServiceAidantMAC';

describe('Capteur de commande pour finaliser la demande devenir Aidant', () => {
  it('Finalise la demande en créant le compte Aidant', async () => {
    const demande = unConstructeurDeDemandeDevenirAidant().construis();
    const entrepots = new EntrepotsMemoire();
    entrepots.demandesDevenirAidant().persiste(demande);
    const busEvenement = new BusEvenementDeTest();

    const demandeFinalisee = await new CapteurSagaFinaliseDemandeDevenirAidant(
      new BusCommandeMAC(
        entrepots,
        busEvenement,
        new AdaptateurEnvoiMailMemoire(),
        { aidant: unServiceAidant(entrepots.aidants()) }
      ),
      new ServiceDevenirAidant(entrepots.demandesDevenirAidant())
    ).execute({
      mail: demande.mail,
      type: 'CommandeFinaliseDemandeDevenirAidant',
    });

    const aidantCree = await entrepots
      .aidants()
      .rechercheParIdentifiantDeConnexion(demande.mail);
    expect(aidantCree).toStrictEqual<Aidant>({
      identifiant: expect.any(String),
      identifiantConnexion: demande.mail,
      nomPrenom: `${demande.prenom} ${demande.nom}`,
      motDePasse: expect.any(String),
      dateSignatureCGU: demande.date,
    });
    expect(demandeFinalisee).toStrictEqual<DemandeDevenirAidantFinalisee>({
      identifiantAidant: aidantCree.identifiant,
    });
  });

  it('ne peut finaliser une demande inexistante', async () => {
    const entrepots = new EntrepotsMemoire();
    const busEvenement = new BusEvenementDeTest();

    const demandeFinalisee = await new CapteurSagaFinaliseDemandeDevenirAidant(
      new BusCommandeMAC(
        entrepots,
        busEvenement,
        new AdaptateurEnvoiMailMemoire(),
        { aidant: unServiceAidant(entrepots.aidants()) }
      ),
      new ServiceDevenirAidant(entrepots.demandesDevenirAidant())
    ).execute({
      mail: 'mail@noix.fr',
      type: 'CommandeFinaliseDemandeDevenirAidant',
    });

    expect(await entrepots.aidants().tous()).toHaveLength(0);
    expect(demandeFinalisee).toBeUndefined();
  });
});
