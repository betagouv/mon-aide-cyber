import { describe, expect, it } from 'vitest';
import { CapteurSagaDemandeSolliciterAide } from '../../../src/gestion-demandes/aide/CapteurSagaDemandeSolliciterAide';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { unConstructeurDeServices } from '../../constructeurs/constructeurServices';
import {
  uneQuestion,
  unReferentiel,
} from '../../constructeurs/constructeurReferentiel';
import { AdaptateurReferentielDeTest } from '../../adaptateurs/AdaptateurReferentielDeTest';

describe('Capteur saga demande solliciter aide', () => {
  it('Crée le diagnostic suite à la création de la demande d’Aide', async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const entrepots = new EntrepotsMemoire();
    const services = unConstructeurDeServices(entrepots.aidants());
    const referentiel = unReferentiel()
      .ajouteUneQuestionAuContexte(uneQuestion().construis())
      .construis();
    (services.referentiels.diagnostic as AdaptateurReferentielDeTest).ajoute(
      referentiel
    );

    await new CapteurSagaDemandeSolliciterAide(
      entrepots,
      new BusCommandeMAC(
        entrepots,
        new BusEvenementDeTest(),
        new AdaptateurEnvoiMailMemoire(),
        services
      )
    ).execute({
      dateSignatureCGU: FournisseurHorloge.maintenant(),
      email: 'jean.dupont@mail.com',
      departement: 'Finistère',
      type: 'SagaDemandeSolliciterAide',
    });

    const diagnostic = (await entrepots.diagnostic().tous())[0];
    expect(diagnostic).not.toBeUndefined();
  });
});
