import { beforeEach, describe, expect, it } from 'vitest';
import { adaptateursCorpsMessage } from '../../../src/gestion-demandes/aide/adaptateursCorpsMessage';
import { unAdaptateurDeCorpsDeMessage } from './ConstructeurAdaptateurDeCorpsDeMessage';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { adaptateursEnvironnementDeTest } from '../../adaptateurs/adaptateursEnvironnementDeTest';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { MiseEnRelationDirecteAidant } from '../../../src/gestion-demandes/aide/MiseEnRelationDirecteAidant';
import {
  Departement,
  gironde,
} from '../../../src/gestion-demandes/departements';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { unUtilisateurMAC } from '../../constructeurs/constructeurUtilisateurMac';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { DemandeAide } from '../../../src/gestion-demandes/aide/DemandeAide';
import { Aidant, entitesPubliques } from '../../../src/espace-aidant/Aidant';

const cotParDefaut = {
  rechercheEmailParDepartement: (__departement: Departement) => 'cot@email.com',
};

describe('Mise en relation directe avec un Aidant', () => {
  beforeEach(() => {
    adaptateurEnvironnement.messagerie = () =>
      adaptateursEnvironnementDeTest.messagerie({
        emailMac: 'mac@email.com',
        copieMac: 'copie-mac@email.com',
      });
  });

  it('Envoie un email de confirmation à l’Aidé', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-03-19T14:45:17+01:00'))
    );
    const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    const miseEnRelation = new MiseEnRelationDirecteAidant(
      adaptateurEnvoiMail,
      cotParDefaut,
      unUtilisateurMAC()
        .depuisUnAidant(
          unAidant().avecUnEmail('jean-dupont@email.com').construis()
        )
        .construis()
    );

    await miseEnRelation.execute({
      demandeAide: {
        identifiant: crypto.randomUUID(),
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        departement: gironde,
        raisonSociale: '',
        email: 'jean-dupont@email.com',
      },
      secteursActivite: [{ nom: 'Administration' }],
      typeEntite: entitesPubliques,
      siret: '123456',
    });

    expect(
      adaptateurEnvoiMail.confirmationDemandeAideAEteEnvoyeeA(
        'jean-dupont@email.com'
      )
    ).toBe(true);
  });

  it("Envoie un email de confirmation à l'Aidé en prenant en compte la relation existante avec un Aidant", async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-03-19T14:45:17+01:00'))
    );
    const entrepots = new EntrepotsMemoire();
    const aidant = unAidant()
      .avecUnEmail('jean.dujardin@email.com')
      .construis();
    await entrepots.aidants().persiste(aidant);
    const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    const miseEnRelation = new MiseEnRelationDirecteAidant(
      adaptateurEnvoiMail,
      cotParDefaut,
      unUtilisateurMAC()
        .depuisUnAidant(
          unAidant().avecUnEmail('jean.dujardin@email.com').construis()
        )
        .construis()
    );

    await miseEnRelation.execute({
      demandeAide: {
        identifiant: crypto.randomUUID(),
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        departement: gironde,
        raisonSociale: '',
        email: 'jean-dupont@email.com',
      },
      secteursActivite: [{ nom: 'Administration' }],
      typeEntite: entitesPubliques,
      siret: '12345',
    });

    expect(
      adaptateurEnvoiMail.confirmationDemandeAideAEteEnvoyeeA(
        'jean-dupont@email.com',
        'jean.dujardin@email.com'
      )
    ).toBe(true);
  });

  it('Envoie un email de demande d’aide au COT en prenant en compte la relation existante avec un Aidant', async () => {
    adaptateursCorpsMessage.demande = unAdaptateurDeCorpsDeMessage()
      .recapitulatifDemandeAide(
        (
          _aide: DemandeAide,
          _aidants: Aidant[],
          relationUtilisateur: string | undefined
        ) =>
          `Bonjour une entité a fait une demande d’aide, relation Aidant : ${relationUtilisateur}`
      )
      .construis().demande;
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-03-19T14:45:17+01:00'))
    );
    const aidant = unAidant()
      .avecUnEmail('jean.dujardin@email.com')
      .construis();
    await new EntrepotsMemoire().aidants().persiste(aidant);
    const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    const miseEnRelation = new MiseEnRelationDirecteAidant(
      adaptateurEnvoiMail,
      cotParDefaut,
      unUtilisateurMAC()
        .depuisUnAidant(
          unAidant().avecUnEmail('jean.dujardin@email.com').construis()
        )
        .construis()
    );

    await miseEnRelation.execute({
      demandeAide: {
        identifiant: crypto.randomUUID(),
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        email: 'jean-dupont@email.com',
        departement: gironde,
        raisonSociale: 'BetaGouv',
      },
      secteursActivite: [{ nom: 'Administration' }],
      typeEntite: entitesPubliques,
      siret: '123456',
    });

    expect(
      adaptateurEnvoiMail.aEteEnvoyeA(
        'cot@email.com',
        `Bonjour une entité a fait une demande d’aide, relation Aidant : jean.dujardin@email.com`
      )
    ).toBe(true);
    expect(
      adaptateurEnvoiMail.aEteEnvoyeEnCopieA(
        'copie-mac@email.com',
        'Bonjour une entité a fait une demande d’aide, relation Aidant : jean.dujardin@email.com'
      )
    ).toBe(true);
  });
});
