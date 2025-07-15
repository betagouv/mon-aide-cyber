import { beforeEach, describe, expect, it } from 'vitest';
import { uneDemandeAide } from '../../../gestion-demandes/aide/ConstructeurDemandeAide';
import { unAidant } from '../../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { AdaptateurRelationsMAC } from '../../../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { ServiceDeChiffrementClair } from '../../../infrastructure/securite/ServiceDeChiffrementClair';
import { EntrepotsMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import {
  AffectationAnnulee,
  executeRelanceMiseEnRelation,
} from '../../../../src/administration/aidants/relance-mise-en-relation/executeRelanceMiseEnRelation';
import { BusEvenementDeTest } from '../../../infrastructure/bus/BusEvenementDeTest';
import { FournisseurHorlogeDeTest } from '../../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import { AidantMisEnRelation } from '../../../../src/gestion-demandes/aide/MiseEnRelationParCriteres';
import { AdaptateurEnvoiMailMemoire } from '../../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { AdaptateurGeographie } from '../../../../src/adaptateurs/AdaptateurGeographie';
import {
  Departement,
  finistere,
} from '../../../../src/gestion-demandes/departements';
import { unAdaptateurRechercheEntreprise } from '../../../constructeurs/constructeurAdaptateurRechercheEntrepriseEnDur';
import { AdaptateurRechercheEntreprise } from '../../../../src/infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import { Aidant, entitesPubliques } from '../../../../src/espace-aidant/Aidant';
import { DemandeAide } from '../../../../src/gestion-demandes/aide/DemandeAide';

describe('Commande pour exécuter la relance de mise en relation suite à l‘annulation d‘un Aidant', () => {
  let envoieMail: AdaptateurEnvoiMailMemoire;
  let adaptateurGeo: AdaptateurGeographie;
  const annuaireCot = {
    rechercheEmailParDepartement: (__departement: Departement) =>
      'cot@par-defaut.fr',
  };
  let adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  let aidant: Aidant;
  let demandeAide: DemandeAide;

  beforeEach(() => {
    envoieMail = new AdaptateurEnvoiMailMemoire();
    adaptateurGeo = {
      epciAvecCode: async (__codeEpci: string) => ({ nom: 'Plouguerneau' }),
    };

    adaptateurRechercheEntreprise = unAdaptateurRechercheEntreprise()
      .quiRenvoieCodeEpci('1223')
      .dansLeServicePublic()
      .dansLesTransports()
      .avecLeSiret('1234567890')
      .construis();

    aidant = unAidant()
      .ayantPourSecteursActivite([{ nom: 'Transports' }])
      .ayantPourTypesEntite([entitesPubliques])
      .ayantPourDepartements([finistere])
      .construis();

    demandeAide = uneDemandeAide()
      .avecLeSiret('1234567890')
      .dansLeDepartement(finistere)
      .construis();
  });

  it('Supprime la relation demandeAttribuee', async () => {
    const adaptateurRelationMemoire = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire(),
      new ServiceDeChiffrementClair()
    );
    const entrepots = new EntrepotsMemoire();
    await entrepots.demandesAides().persiste(demandeAide);
    await entrepots.aidants().persiste(aidant);
    await adaptateurRelationMemoire.attribueDemandeAAidant(
      demandeAide.identifiant,
      aidant.identifiant
    );

    await executeRelanceMiseEnRelation(demandeAide.email, {
      entrepots,
      adaptateurRelation: adaptateurRelationMemoire,
      busEvenement: new BusEvenementDeTest(),
      adaptateurMail: envoieMail,
      adaptateurGeographie: adaptateurGeo,
      adaptateurRechercheEntreprise: adaptateurRechercheEntreprise,
      annuaireCot,
    });

    expect(
      await adaptateurRelationMemoire.relationExiste(
        'demandeAttribuee',
        {
          type: 'aidant',
          identifiant: aidant.identifiant,
        },
        {
          type: 'demandeAide',
          identifiant: demandeAide.identifiant,
        }
      )
    ).toBe(false);
  });

  it("Publie l'événement AFFECTATION_ANNULEE", async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const adaptateurRelationMemoire = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire(),
      new ServiceDeChiffrementClair()
    );
    const entrepots = new EntrepotsMemoire();
    await entrepots.demandesAides().persiste(demandeAide);
    await entrepots.aidants().persiste(aidant);
    await adaptateurRelationMemoire.attribueDemandeAAidant(
      demandeAide.identifiant,
      aidant.identifiant
    );
    const busEvenement = new BusEvenementDeTest();

    await executeRelanceMiseEnRelation(demandeAide.email, {
      entrepots,
      adaptateurRelation: adaptateurRelationMemoire,
      busEvenement: busEvenement,
      adaptateurMail: envoieMail,
      adaptateurGeographie: adaptateurGeo,
      adaptateurRechercheEntreprise: adaptateurRechercheEntreprise,
      annuaireCot,
    });

    expect(busEvenement.evenementRecu).toStrictEqual<AffectationAnnulee>({
      identifiant: expect.any(String),
      type: 'AFFECTATION_ANNULEE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiantDemande: demandeAide.identifiant,
        identifiantAidant: aidant.identifiant,
      },
    });
  });

  it("Consomme l'événement AFFECTATION_ANNULEE", async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const adaptateurRelationMemoire = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire(),
      new ServiceDeChiffrementClair()
    );
    const entrepots = new EntrepotsMemoire();
    await entrepots.demandesAides().persiste(demandeAide);
    await entrepots.aidants().persiste(aidant);
    await adaptateurRelationMemoire.attribueDemandeAAidant(
      demandeAide.identifiant,
      aidant.identifiant
    );
    const busEvenement = new BusEvenementDeTest();

    await executeRelanceMiseEnRelation(demandeAide.email, {
      entrepots,
      adaptateurRelation: adaptateurRelationMemoire,
      busEvenement: busEvenement,
      adaptateurMail: envoieMail,
      adaptateurGeographie: adaptateurGeo,
      adaptateurRechercheEntreprise: adaptateurRechercheEntreprise,
      annuaireCot,
    });

    expect(
      busEvenement.consommateursTestes.get('AFFECTATION_ANNULEE')
    ).toBeDefined();
  });

  it('Exécute la mise en relation par critères', async () => {
    const aidantsContactes: AidantMisEnRelation[] = [];
    envoieMail.envoiToutesLesMisesEnRelation = async (
      aidants: AidantMisEnRelation[],
      __donneesMiseEnRelation
    ) => {
      aidantsContactes.push(...aidants);
    };
    const adaptateurRelationMemoire = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire(),
      new ServiceDeChiffrementClair()
    );
    const entrepots = new EntrepotsMemoire();
    await entrepots.demandesAides().persiste(demandeAide);
    await entrepots.aidants().persiste(aidant);
    await adaptateurRelationMemoire.attribueDemandeAAidant(
      demandeAide.identifiant,
      aidant.identifiant
    );
    const busEvenement = new BusEvenementDeTest();

    await executeRelanceMiseEnRelation(demandeAide.email, {
      entrepots,
      adaptateurRelation: adaptateurRelationMemoire,
      busEvenement: busEvenement,
      adaptateurMail: envoieMail,
      adaptateurGeographie: adaptateurGeo,
      adaptateurRechercheEntreprise: adaptateurRechercheEntreprise,
      annuaireCot,
    });

    expect(aidantsContactes).toHaveLength(1);
  });
});
