import { describe, expect, it } from 'vitest';
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

describe('Commande pour exécuter la relance de mise en relation suite à l‘annulation d‘un Aidant', () => {
  it('Supprime la relation demandeAttribuee', async () => {
    const demandeAide = uneDemandeAide().construis();
    const aidant = unAidant().construis();
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
    const demandeAide = uneDemandeAide().construis();
    const aidant = unAidant().construis();
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
    const demandeAide = uneDemandeAide().construis();
    const aidant = unAidant().construis();
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
    });

    expect(
      busEvenement.consommateursTestes.get('AFFECTATION_ANNULEE')
    ).toBeDefined();
  });
});
