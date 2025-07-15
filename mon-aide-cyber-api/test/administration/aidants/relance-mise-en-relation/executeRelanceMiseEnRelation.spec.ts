import { describe, expect, it } from 'vitest';
import { uneDemandeAide } from '../../../gestion-demandes/aide/ConstructeurDemandeAide';
import { unAidant } from '../../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { AdaptateurRelationsMAC } from '../../../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { ServiceDeChiffrementClair } from '../../../infrastructure/securite/ServiceDeChiffrementClair';
import { EntrepotsMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { executeRelanceMiseEnRelation } from '../../../../src/administration/aidants/relance-mise-en-relation/executeRelanceMiseEnRelation';

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
});
