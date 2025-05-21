import { assert, describe, expect, it, beforeEach } from 'vitest';
import { AdaptateurRelationsMAC } from '../../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../../src/relation/infrastructure/EntrepotRelationMemoire';
import {
  CapteurCommandeAttribueDemandeAide,
  DemandeAideDejaPourvue,
  DemandeAidePourvue,
} from '../../../src/gestion-demandes/aide/CapteurCommandeAttribueDemandeAide';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { ConfirmationDemandeAideAttribuee } from '../../../src/adaptateurs/AdaptateurEnvoiMail';
import { uneDemandeAide } from './ConstructeurDemandeAide';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { finistere } from '../../../src/gestion-demandes/departements';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { Aidant, entitesPubliques } from '../../../src/espace-aidant/Aidant';
import { DemandeAide } from '../../../src/gestion-demandes/aide/DemandeAide';
import {
  AdaptateurRechercheEntreprise,
  adaptateurRechercheEntreprise,
} from '../../../src/infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import { AdaptateurDeRequeteHTTPMemoire } from '../../adaptateurs/AdaptateurDeRequeteHTTPMemoire';
import { unConstructeurDeReponseAPIEntreprise } from '../../constructeurs/constructeurAPIEntreprise';
import { ReponseAPIRechercheEntreprise } from '../../api/recherche-entreprise/api';

describe("Capteur de commande d'attribution de demande d'aide", () => {
  let entrepot: EntrepotsMemoire;
  let relations: AdaptateurRelationsMAC;
  let aidantJeanDujardin: Aidant;
  let demandeFinistere: DemandeAide;
  let bus: BusEvenementDeTest;
  let envoiMail: AdaptateurEnvoiMailMemoire;
  const adaptateurDeRequeteHTTP = new AdaptateurDeRequeteHTTPMemoire();
  const rechercheEntreprise: AdaptateurRechercheEntreprise =
    adaptateurRechercheEntreprise(adaptateurDeRequeteHTTP);
  const entreprisePubliqueCorrespondantALaDemande: ReponseAPIRechercheEntreprise =
    {
      results: [
        unConstructeurDeReponseAPIEntreprise()
          .dansLeServicePublic()
          .dansAdministration()
          .construis(),
      ],
    };

  beforeEach(async () => {
    aidantJeanDujardin = unAidant()
      .avecUnIdentifiant('11111111-1111-1111-1111-111111111111')
      .avecUnEmail('aidant@societe.fr')
      .avecUnNomPrenom('Jean Dujardin')
      .construis();
    demandeFinistere = uneDemandeAide()
      .avecUnEmail('22222222-2222-2222-2222-222222222222')
      .avecUnEmail('demande@societe.fr')
      .dansLeDepartement(finistere)
      .construis();

    entrepot = new EntrepotsMemoire();
    await entrepot.aidants().persiste(aidantJeanDujardin);
    await entrepot.demandesAides().persiste(demandeFinistere);

    relations = new AdaptateurRelationsMAC(new EntrepotRelationMemoire());
    bus = new BusEvenementDeTest();
    envoiMail = new AdaptateurEnvoiMailMemoire();

    adaptateurDeRequeteHTTP.reponse<ReponseAPIRechercheEntreprise>(
      entreprisePubliqueCorrespondantALaDemande
    );
  });

  const leCapteur = () =>
    new CapteurCommandeAttribueDemandeAide(
      envoiMail,
      relations,
      bus,
      entrepot,
      rechercheEntreprise
    );

  it("Attribue la demande d'aide à l'aidant", async () => {
    const capteur = leCapteur();

    await capteur.execute({
      type: 'CommandeAttribueDemandeAide',
      identifiantDemande: '22222222-2222-2222-2222-222222222222',
      emailDemande: 'demande@societe.fr',
      identifiantAidant: '11111111-1111-1111-1111-111111111111',
    });

    expect(
      await relations.relationExiste(
        'demandeAttribuee',
        { type: 'aidant', identifiant: '11111111-1111-1111-1111-111111111111' },
        {
          type: 'demandeAide',
          identifiant: '22222222-2222-2222-2222-222222222222',
        }
      )
    ).toBe(true);
  });

  it("Publie un événement de « DEMANDE_AIDE_POURVUE » avec un statut en Succès lorsque l'Aidant est le premier arrivé", async () => {
    const maintenant = new Date();
    FournisseurHorlogeDeTest.initialise(maintenant);

    const capteur = leCapteur();

    await capteur.execute({
      type: 'CommandeAttribueDemandeAide',
      identifiantDemande: '22222222-2222-2222-2222-222222222222',
      emailDemande: 'demande@societe.fr',
      identifiantAidant: '11111111-1111-1111-1111-111111111111',
    });

    expect(bus.evenementRecu).toStrictEqual<DemandeAidePourvue>({
      identifiant: expect.any(String),
      type: 'DEMANDE_AIDE_POURVUE',
      date: maintenant,
      corps: {
        identifiantDemande: '22222222-2222-2222-2222-222222222222',
        identifiantAidant: '11111111-1111-1111-1111-111111111111',
        statut: 'SUCCESS',
      },
    });
  });

  it("Fournit toutes les informations nécessaires au mail de confirmation envoyé à l'Aidant", async () => {
    let confirmationEnvoyee: ConfirmationDemandeAideAttribuee;
    envoiMail.envoieConfirmationDemandeAideAttribuee = async (
      confirmation: ConfirmationDemandeAideAttribuee
    ) => {
      confirmationEnvoyee = confirmation;
    };
    const capteur = leCapteur();

    await capteur.execute({
      type: 'CommandeAttribueDemandeAide',
      identifiantDemande: '22222222-2222-2222-2222-222222222222',
      emailDemande: 'demande@societe.fr',
      identifiantAidant: '11111111-1111-1111-1111-111111111111',
    });

    expect(
      confirmationEnvoyee!
    ).toStrictEqual<ConfirmationDemandeAideAttribuee>({
      emailEntite: 'demande@societe.fr',
      secteursActivite: 'Administration, Tertiaire',
      typeEntite: entitesPubliques.nom,
      departement: finistere,
      emailAidant: 'aidant@societe.fr',
      nomPrenomAidant: 'Jean Dujardin',
    });
  });

  it('Jette une erreur de DemandeDejaPourvue si un aidant a déjà répondu à la demande', async () => {
    await relations.attribueDemandeAAidant(
      '22222222-2222-2222-2222-222222222222',
      'AAAAAAAA-1111-1111-1111-111111111111'
    );

    const capteur = leCapteur();

    const deuxiemeAidant = 'BBBBBBBB-1111-1111-1111-111111111111';
    await expect(
      capteur.execute({
        type: 'CommandeAttribueDemandeAide',
        identifiantDemande: '22222222-2222-2222-2222-222222222222',
        emailDemande: 'demande@societe.fr',
        identifiantAidant: deuxiemeAidant,
      })
    ).rejects.toThrow(new DemandeAideDejaPourvue());
  });

  it('Publie un événement de « DEMANDE_AIDE_POURVUE » avec un statut à « DEJA_POURVUE » lorsque la demande est déjà attribuée', async () => {
    const maintenant = new Date();
    FournisseurHorlogeDeTest.initialise(maintenant);
    await relations.attribueDemandeAAidant(
      '22222222-2222-2222-2222-222222222222',
      'AAAAAAAA-1111-1111-1111-111111111111'
    );
    const capteur = leCapteur();

    const deuxiemeAidant = 'BBBBBBBB-1111-1111-1111-111111111111';
    try {
      await capteur.execute({
        type: 'CommandeAttribueDemandeAide',
        identifiantDemande: '22222222-2222-2222-2222-222222222222',
        emailDemande: 'demande@societe.fr',
        identifiantAidant: deuxiemeAidant,
      });
      assert.fail('Ce test doit échouer car la demande est déjà pourvue');
    } catch (_erreur) {
      expect(bus.evenementRecu).toStrictEqual<DemandeAidePourvue>({
        identifiant: expect.any(String),
        type: 'DEMANDE_AIDE_POURVUE',
        date: maintenant,
        corps: {
          identifiantDemande: '22222222-2222-2222-2222-222222222222',
          identifiantAidant: deuxiemeAidant,
          statut: 'DEJA_POURVUE',
        },
      });
    }
  });
});
