import { beforeEach, describe, expect, it } from 'vitest';
import { uneDemandeAide } from '../../../gestion-demandes/aide/ConstructeurDemandeAide';
import { EntrepotsMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { FournisseurHorlogeDeTest } from '../../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { lesAidesNonPourvues } from '../../../../src/administration/gestion-demandes/aides/aidesNonPourvues';
import { unDiagnostic } from '../../../constructeurs/constructeurDiagnostic';
import { AdaptateurRelationsMAC } from '../../../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { ServiceDeChiffrementClair } from '../../../infrastructure/securite/ServiceDeChiffrementClair';

describe('Pour les demandes d’aides non pourvues', () => {
  let adaptateurRelationsMAC: AdaptateurRelationsMAC;

  beforeEach(() => {
    adaptateurRelationsMAC = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire(),
      new ServiceDeChiffrementClair()
    );
  });

  it('retourne les demandes d’aides', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2025-12-07T10:00:00+01:00'))
    );
    const entrepots = new EntrepotsMemoire();
    const dateDeDemande = new Date(Date.parse('2025-07-07T10:00:00+01:00'));
    const demandeAide = uneDemandeAide()
      .avecUneDateDeSignatureDesCGU(dateDeDemande)
      .construis();
    await entrepots.demandesAides().persiste(demandeAide);

    const demandesAidesNonPourvues = await lesAidesNonPourvues(
      entrepots,
      adaptateurRelationsMAC
    ).recherche();

    expect(demandesAidesNonPourvues).toStrictEqual([
      {
        entite: demandeAide.email,
        departement: demandeAide.departement.nom,
        dateDeDemande,
      },
    ]);
  });

  it('retourne les demandes d’aides après le 4 juin 2025', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2025-12-07T10:00:00+01:00'))
    );
    const entrepots = new EntrepotsMemoire();
    await entrepots.demandesAides().persiste(
      uneDemandeAide()
        .avecUneDateDeSignatureDesCGU(
          new Date(Date.parse('2025-07-07T10:00:00+01:00'))
        )
        .construis()
    );
    await entrepots.demandesAides().persiste(
      uneDemandeAide()
        .avecUneDateDeSignatureDesCGU(
          new Date(Date.parse('2025-06-03T10:00:00+01:00'))
        )
        .construis()
    );

    const demandesAidesNonPourvues = await lesAidesNonPourvues(
      entrepots,
      adaptateurRelationsMAC
    ).recherche();

    expect(demandesAidesNonPourvues).toHaveLength(1);
  });

  it('retourne les demandes d’aides pour lesquelles aucun diagnostic n’a été effectué', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2025-12-07T10:00:00+01:00'))
    );
    const entrepots = new EntrepotsMemoire();
    const demandeAide = uneDemandeAide()
      .avecUneDateDeSignatureDesCGU(
        new Date(Date.parse('2025-07-07T10:00:00+01:00'))
      )
      .construis();
    await entrepots.demandesAides().persiste(demandeAide);
    await entrepots.demandesAides().persiste(
      uneDemandeAide()
        .avecUneDateDeSignatureDesCGU(
          new Date(Date.parse('2026-02-04T10:00:00+01:00'))
        )
        .construis()
    );
    const diagnostic = unDiagnostic().construis();
    await adaptateurRelationsMAC.creeTupleEntiteAideeBeneficieDiagnostic(
      diagnostic.identifiant,
      demandeAide.email
    );

    const demandesAidesNonPourvues = await lesAidesNonPourvues(
      entrepots,
      adaptateurRelationsMAC
    ).recherche();

    expect(demandesAidesNonPourvues).toHaveLength(1);
  });
});
