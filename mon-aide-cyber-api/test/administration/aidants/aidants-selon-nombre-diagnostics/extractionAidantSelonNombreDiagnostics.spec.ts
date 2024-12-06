import { beforeEach, expect } from 'vitest';
import { Aidant } from '../../../../src/administration/aidants/aidants-selon-nombre-diagnostics/Types';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../../infrastructure/horloge/FournisseurHorlogeDeTest';
import {
  EntrepotAidant,
  ExtractionAidantSelonNombreDiagnostics,
} from '../../../../src/administration/aidants/aidants-selon-nombre-diagnostics/extractionAidantSelonNombreDiagnostics';
import { AggregatNonTrouve } from '../../../../src/domaine/Aggregat';
import crypto from 'crypto';
import { cloneDeep } from 'lodash';
import { EntrepotRelationMemoire } from '../../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { unTupleAidantInitieDiagnostic } from '../../../../src/diagnostic/tuples';
import {
  nettoieLaBaseDeDonneesAidants,
  nettoieLaBaseDeDonneesRelations,
} from '../../../utilitaires/nettoyeurBDD';

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

  rechercheAidantSansDiagnostic(): Promise<Aidant[]> {
    return this.tous();
  }

  rechercheAidantAyantAuMoinsNDiagnostics(
    nombreDeDiagnostics: number
  ): Promise<Aidant[]> {
    const trouves = Array.from(this.entites.values())
      .map(async (aidant) => {
        return this.entrepotRelationMemoire
          .trouveObjetsLiesAUtilisateur(aidant.identifiant)
          .then((relation) =>
            relation.length >= nombreDeDiagnostics ? aidant : undefined
          );
      })
      .filter((y): y is Promise<Aidant> => !!y);

    return Promise.all(trouves);
  }
}

describe('Extraction des Aidants sans diagnostic', () => {
  beforeEach(async () => {
    await nettoieLaBaseDeDonneesAidants();
    await nettoieLaBaseDeDonneesRelations();
  });

  it('Extrais un Aidant sans diagnostic', async () => {
    FournisseurHorlogeDeTest.initialise(FournisseurHorloge.maintenant());

    const entrepotRelationMemoire = new EntrepotRelationMemoire();
    const entrepot = new EntrepotAidantMemoire(entrepotRelationMemoire);

    entrepot.persiste({
      identifiant: crypto.randomUUID(),
      nomPrenom: 'Jean DUPONT',
      email: 'jean.dupont@yomail.com',
      compteCree: FournisseurHorloge.maintenant(),
    });
    const resultat = await new ExtractionAidantSelonNombreDiagnostics(
      entrepot
    ).extrais('SANS_DIAGNOSTIC');

    expect(resultat).toStrictEqual<Aidant[]>([
      {
        identifiant: expect.any(String),
        nomPrenom: 'Jean DUPONT',
        email: 'jean.dupont@yomail.com',
        compteCree: FournisseurHorloge.maintenant(),
      },
    ]);
  });

  it('Extrais un Aidant ayant 2 diags', async () => {
    FournisseurHorlogeDeTest.initialise(FournisseurHorloge.maintenant());
    const entrepotRelationMemoire = new EntrepotRelationMemoire();
    const entrepot = new EntrepotAidantMemoire(entrepotRelationMemoire);

    const aidant = {
      identifiant: crypto.randomUUID(),
      nomPrenom: 'Jean DUPONT',
      email: 'jean.dupont@yomail.com',
      compteCree: FournisseurHorloge.maintenant(),
    };
    await entrepot.persiste(aidant);

    await entrepotRelationMemoire.persiste(
      unTupleAidantInitieDiagnostic(aidant.identifiant, crypto.randomUUID())
    );
    await entrepotRelationMemoire.persiste(
      unTupleAidantInitieDiagnostic(aidant.identifiant, crypto.randomUUID())
    );

    const resultat = await new ExtractionAidantSelonNombreDiagnostics(
      entrepot
    ).extrais('AU_MOINS_DEUX_DIAGNOSTICS');

    expect(resultat).toStrictEqual<Aidant[]>([
      {
        identifiant: expect.any(String),
        nomPrenom: 'Jean DUPONT',
        email: 'jean.dupont@yomail.com',
        compteCree: FournisseurHorloge.maintenant(),
      },
    ]);
  });
});
