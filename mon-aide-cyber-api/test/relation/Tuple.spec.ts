import { describe, expect } from 'vitest';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import { unDiagnostic } from '../constructeurs/constructeurDiagnostic';
import { Tuple, unTuple } from '../../src/relation/Tuple';
import { DefinitionAidantInitieDiagnostic } from '../../src/diagnostic/tuples';

describe('Tuple', () => {
  it('construis un tuple de type initiateur entre un aidant et un diagnostic', async () => {
    const diagnostic = unDiagnostic().construis();
    const aidant = unAidant().construis();

    const tuple = unTuple<DefinitionAidantInitieDiagnostic>({
      definition: {
        relation: 'initiateur',
        typeObjet: 'diagnostic',
        typeUtilisateur: 'aidant',
      },
    })
      .avecUtilisateur(aidant.identifiant)
      .avecObjet(diagnostic.identifiant)
      .construis();

    expect(tuple).toStrictEqual<Tuple>({
      identifiant: expect.any(String),
      utilisateur: {
        type: 'aidant',
        identifiant: aidant.identifiant,
      },
      relation: 'initiateur',
      objet: {
        type: 'diagnostic',
        identifiant: diagnostic.identifiant,
      },
    });
  });
});
