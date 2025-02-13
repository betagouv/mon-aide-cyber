import { assert, beforeEach, describe, it } from 'vitest';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import {
  ExtractionAidantSelonParametre,
  StatistiquesAidantDTO,
} from '../../../../src/administration/aidants/extraction-aidants/extractionAidantSelonParametre';
import { EntrepotRelationMemoire } from '../../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { ParametreExtraction } from '../../../../src/administration/aidants/extraction-aidants/commande';
import { FournisseurHorlogeDeTest } from '../../../infrastructure/horloge/FournisseurHorlogeDeTest';

import { EntrepotStatistiquesAidantMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import {
  ConstructeurStatistiqueAidant,
  uneStatistiqueAidant,
} from '../../../constructeurs/constructeurStatistiqueAidant';

describe('Extraction des Aidants suivant le nombre de diagnostics effectués', () => {
  const entrepotRelation = new EntrepotRelationMemoire();
  const entrepotAidant = new EntrepotStatistiquesAidantMemoire(
    entrepotRelation
  );
  FournisseurHorlogeDeTest.initialise(
    new Date(Date.parse('2024-12-12T13:22:33'))
  );

  beforeEach(() => {
    entrepotAidant.reinitialise();
  });

  type Test = {
    test: string;
    parametre: ParametreExtraction;
    aidants: ConstructeurStatistiqueAidant[];
    aidantsAttendus: StatistiquesAidantDTO[];
  };

  it.each<Test>([
    {
      test: 'ayant fait 0 diagnostic',
      parametre: 'SANS_DIAGNOSTIC',
      aidants: [
        uneStatistiqueAidant(
          entrepotAidant,
          entrepotRelation
        ).ayantFaitNDiagnostics(1),
        uneStatistiqueAidant(entrepotAidant, entrepotRelation)
          .avecUnId('6da9ed47-d95f-4c23-93fb-616c8dd48053')
          .avecUnNomPrenom('Jean DUPONT')
          .avecUnEmail('jean.dupont@yomail.com'),
      ],
      aidantsAttendus: [
        {
          identifiant: '6da9ed47-d95f-4c23-93fb-616c8dd48053',
          nomPrenom: 'Jean DUPONT',
          email: 'jean.dupont@yomail.com',
          compteCree: FournisseurHorloge.maintenant(),
        },
      ],
    },
    {
      test: 'ayant fait exactement 1 diagnostic',
      parametre: 'EXACTEMENT_UN_DIAGNOSTIC',
      aidants: [
        uneStatistiqueAidant(entrepotAidant, entrepotRelation)
          .avecUnId('6da9ed47-d95f-4c23-93fb-616c8dd48052')
          .avecUnNomPrenom('Jean Dujardin')
          .avecUnEmail('jean.dujardin@yomail.com')
          .ayantFaitNDiagnostics(1),
        uneStatistiqueAidant(
          entrepotAidant,
          entrepotRelation
        ).ayantFaitNDiagnostics(2),
        uneStatistiqueAidant(entrepotAidant, entrepotRelation)
          .avecUnId('6da9ed47-d95f-4c23-93fb-616c8dd48053')
          .ayantFaitNDiagnostics(1)
          .avecUnNomPrenom('Jean DUPONT')
          .avecUnEmail('jean.dupont@yomail.com'),
      ],
      aidantsAttendus: [
        {
          identifiant: '6da9ed47-d95f-4c23-93fb-616c8dd48053',
          nomPrenom: 'Jean DUPONT',
          email: 'jean.dupont@yomail.com',
          compteCree: FournisseurHorloge.maintenant(),
        },
        {
          identifiant: '6da9ed47-d95f-4c23-93fb-616c8dd48052',
          nomPrenom: 'Jean Dujardin',
          email: 'jean.dujardin@yomail.com',
          compteCree: FournisseurHorloge.maintenant(),
        },
      ],
    },
    {
      test: 'ayant fait 2 diagnostics ou plus',
      parametre: 'AU_MOINS_DEUX_DIAGNOSTICS',
      aidants: [
        uneStatistiqueAidant(
          entrepotAidant,
          entrepotRelation
        ).ayantFaitNDiagnostics(1),
        uneStatistiqueAidant(entrepotAidant, entrepotRelation)
          .avecUnId('6da9ed47-d95f-4c23-93fb-616c8dd48053')
          .ayantFaitNDiagnostics(2)
          .avecUnNomPrenom('Jean DUPONT')
          .avecUnEmail('jean.dupont@yomail.com'),
      ],
      aidantsAttendus: [
        {
          identifiant: '6da9ed47-d95f-4c23-93fb-616c8dd48053',
          nomPrenom: 'Jean DUPONT',
          email: 'jean.dupont@yomail.com',
          compteCree: FournisseurHorloge.maintenant(),
        },
      ],
    },
    {
      test: 'ayant fait 5 diagnostics ou plus',
      parametre: 'AU_MOINS_CINQ_DIAGNOSTICS',
      aidants: [
        uneStatistiqueAidant(
          entrepotAidant,
          entrepotRelation
        ).ayantFaitNDiagnostics(4),
        uneStatistiqueAidant(entrepotAidant, entrepotRelation)
          .avecUnId('6da9ed47-d95f-4c23-93fb-616c8dd48053')
          .ayantFaitNDiagnostics(5)
          .avecUnNomPrenom('Jean DUJARDIN')
          .avecUnEmail('jean.dujardin@yomail.com'),
      ],
      aidantsAttendus: [
        {
          identifiant: '6da9ed47-d95f-4c23-93fb-616c8dd48053',
          nomPrenom: 'Jean DUJARDIN',
          email: 'jean.dujardin@yomail.com',
          compteCree: FournisseurHorloge.maintenant(),
        },
      ],
    },
    {
      test: 'avec le nombre de diagnostics correpondant',
      parametre: 'NOMBRE_DIAGNOSTICS',
      aidants: [
        uneStatistiqueAidant(entrepotAidant, entrepotRelation)
          .avecUnId('6da9ed47-d95f-4c23-93fb-616c8dd48061')
          .avecUnNomPrenom('Jeanne DUPONT')
          .avecUnEmail('jeanne.dupont@yomail.com'),
        uneStatistiqueAidant(entrepotAidant, entrepotRelation)
          .avecUnId('6da9ed47-d95f-4c23-93fb-616c8dd48062')
          .ayantFaitNDiagnostics(3)
          .avecUnNomPrenom('Jean DUPONT')
          .avecUnEmail('jean.dupont@yomail.com'),
        uneStatistiqueAidant(entrepotAidant, entrepotRelation)
          .avecUnId('6da9ed47-d95f-4c23-93fb-616c8dd48063')
          .ayantFaitNDiagnostics(5)
          .avecUnNomPrenom('Jean DUJARDIN')
          .avecUnEmail('jean.dujardin@yomail.com'),
        uneStatistiqueAidant(entrepotAidant, entrepotRelation)
          .avecUnId('6da9ed47-d95f-4c23-93fb-616c8dd48064')
          .ayantFaitNDiagnostics(8)
          .avecUnNomPrenom('Jean MARTIN')
          .avecUnEmail('jean.martin@yomail.com'),
      ],
      aidantsAttendus: [
        {
          identifiant: '6da9ed47-d95f-4c23-93fb-616c8dd48061',
          nomPrenom: 'Jeanne DUPONT',
          email: 'jeanne.dupont@yomail.com',
          compteCree: FournisseurHorloge.maintenant(),
          nombreDiagnostics: 0,
        },
        {
          identifiant: '6da9ed47-d95f-4c23-93fb-616c8dd48062',
          nomPrenom: 'Jean DUPONT',
          email: 'jean.dupont@yomail.com',
          compteCree: FournisseurHorloge.maintenant(),
          nombreDiagnostics: 3,
        },
        {
          identifiant: '6da9ed47-d95f-4c23-93fb-616c8dd48063',
          nomPrenom: 'Jean DUJARDIN',
          email: 'jean.dujardin@yomail.com',
          compteCree: FournisseurHorloge.maintenant(),
          nombreDiagnostics: 5,
        },
        {
          identifiant: '6da9ed47-d95f-4c23-93fb-616c8dd48064',
          nomPrenom: 'Jean MARTIN',
          email: 'jean.martin@yomail.com',
          compteCree: FournisseurHorloge.maintenant(),
          nombreDiagnostics: 8,
        },
      ],
    },
  ])('Extrais les Aidants $test', async (test) => {
    await Promise.all(test.aidants.map((aidant) => aidant.construis()));
    const resultat = await new ExtractionAidantSelonParametre(
      entrepotAidant
    ).extrais(test.parametre);

    assert.sameDeepMembers(resultat, test.aidantsAttendus);
  });
});
