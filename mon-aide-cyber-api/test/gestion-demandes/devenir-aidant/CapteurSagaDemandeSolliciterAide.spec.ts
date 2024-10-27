import { describe, expect, it } from 'vitest';
import { CapteurSagaDemandeSolliciterAide } from '../../../src/gestion-demandes/aide/CapteurSagaDemandeSolliciterAide';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { unConstructeurDeServices } from '../../constructeurs/constructeurServices';
import { unReferentielAvecContexteComplet } from '../../constructeurs/constructeurReferentiel';
import { AdaptateurReferentielDeTest } from '../../adaptateurs/AdaptateurReferentielDeTest';

describe('Capteur saga demande solliciter aide', () => {
  beforeEach(() => FournisseurHorlogeDeTest.initialise(new Date()));

  it('Crée le diagnostic suite à la création de la demande d’Aide', async () => {
    const entrepots = new EntrepotsMemoire();
    const services = unConstructeurDeServices(entrepots.aidants());
    const referentiel = unReferentielAvecContexteComplet().construis();
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

  it('Ajoute le département correspondant à la sollicitation dans les informations de contexte du Diagnostic', async () => {
    const entrepots = new EntrepotsMemoire();
    const services = unConstructeurDeServices(entrepots.aidants());
    const referentiel = unReferentielAvecContexteComplet().construis();
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
    expect(
      diagnostic.referentiel['contexte'].questions[3].reponseDonnee
        .reponseUnique
    ).toStrictEqual('contexte-departement-tom-siege-social-finistere');
  });
});
