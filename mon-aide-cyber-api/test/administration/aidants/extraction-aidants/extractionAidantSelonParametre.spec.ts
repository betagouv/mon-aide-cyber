import { assert, beforeEach, it } from 'vitest';
import { Aidant } from '../../../../src/administration/aidants/extraction-aidants/Types';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import {
  EntrepotAidant,
  ExtractionAidantSelonParametre,
} from '../../../../src/administration/aidants/extraction-aidants/extractionAidantSelonParametre';
import { AggregatNonTrouve } from '../../../../src/domaine/Aggregat';
import crypto from 'crypto';
import { cloneDeep } from 'lodash';
import { EntrepotRelationMemoire } from '../../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { ParametreExtraction } from '../../../../src/administration/aidants/extraction-aidants/commande';
import { ConstructeurAidant, unAidant } from './constructeurAidant';
import { FournisseurHorlogeDeTest } from '../../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { Tuple } from '../../../../src/relation/Tuple';

describe('Extraction des Aidants suivant le nombre de diagnostics effectués', () => {
  const entrepotRelation = new EntrepotRelationMemoire();
  const entrepotAidant = new EntrepotAidantMemoire(entrepotRelation);
  FournisseurHorlogeDeTest.initialise(
    new Date(Date.parse('2024-12-12T13:22:33'))
  );

  beforeEach(() => {
    entrepotAidant.reinitialise();
  });

  type Test = {
    test: string;
    parametre: ParametreExtraction;
    aidants: ConstructeurAidant[];
    aidantsAttendus: Aidant[];
  };

  it.each<Test>([
    {
      test: '0 diagnostic',
      parametre: 'SANS_DIAGNOSTIC',
      aidants: [
        unAidant(entrepotAidant, entrepotRelation).ayantFaitNDiagnostics(1),
        unAidant(entrepotAidant, entrepotRelation)
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
      test: 'exactement 1 diagnostic',
      parametre: 'EXACTEMENT_UN_DIAGNOSTIC',
      aidants: [
        unAidant(entrepotAidant, entrepotRelation)
          .avecUnId('6da9ed47-d95f-4c23-93fb-616c8dd48052')
          .avecUnNomPrenom('Jean Dujardin')
          .avecUnEmail('jean.dujardin@yomail.com')
          .ayantFaitNDiagnostics(1),
        unAidant(entrepotAidant, entrepotRelation).ayantFaitNDiagnostics(2),
        unAidant(entrepotAidant, entrepotRelation)
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
      test: '2 diagnostics',
      parametre: 'AU_MOINS_DEUX_DIAGNOSTICS',
      aidants: [
        unAidant(entrepotAidant, entrepotRelation).ayantFaitNDiagnostics(1),
        unAidant(entrepotAidant, entrepotRelation)
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
      test: '5 diagnostics',
      parametre: 'AU_MOINS_CINQ_DIAGNOSTICS',
      aidants: [
        unAidant(entrepotAidant, entrepotRelation).ayantFaitNDiagnostics(4),
        unAidant(entrepotAidant, entrepotRelation)
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
  ])('Extrais un aidant ayant fait $test', async (test) => {
    await Promise.all(test.aidants.map((aidant) => aidant.construis()));
    const resultat = await new ExtractionAidantSelonParametre(
      entrepotAidant
    ).extrais(test.parametre);

    assert.sameDeepMembers(resultat, test.aidantsAttendus);
  });
});

export class EntrepotAidantMemoire implements EntrepotAidant {
  protected entites: Map<crypto.UUID, Aidant> = new Map();

  constructor(
    private readonly entrepotRelationMemoire: EntrepotRelationMemoire
  ) {}

  async lis(identifiant: string): Promise<Aidant> {
    const entiteTrouvee = this.entites.get(identifiant as crypto.UUID);
    if (entiteTrouvee) {
      return Promise.resolve(cloneDeep(entiteTrouvee));
    }
    throw new AggregatNonTrouve('aidant');
  }

  async persiste(entite: Aidant) {
    const entiteClonee = cloneDeep(entite);
    this.entites.set(entite.identifiant, entiteClonee);
  }

  tous(): Promise<Aidant[]> {
    return Promise.resolve(Array.from(this.entites.values()));
  }

  async rechercheAidantSansDiagnostic(): Promise<Aidant[]> {
    return this.rechercheParCritere((relation) => relation.length === 0);
  }

  rechercheAidantAyantExactementNDiagnostics(
    nombreDeDiagnstics: number
  ): Promise<Aidant[]> {
    return this.rechercheParCritere(
      (relation) => relation.length === nombreDeDiagnstics
    );
  }

  rechercheAidantAyantAuMoinsNDiagnostics(
    nombreDeDiagnostics: number
  ): Promise<Aidant[]> {
    return this.rechercheParCritere(
      (relation) => relation.length >= nombreDeDiagnostics
    );
  }

  private rechercheParCritere(critere: (relation: Tuple[]) => boolean) {
    return Promise.all(
      Array.from(this.entites.values()).map(async (aidant) => {
        const relation =
          await this.entrepotRelationMemoire.trouveObjetsLiesAUtilisateur(
            aidant.identifiant
          );
        return critere(relation) ? aidant : undefined;
      })
    ).then((aidants) => aidants.filter((a): a is Aidant => !!a));
  }

  reinitialise() {
    this.entites = new Map();
  }
}
