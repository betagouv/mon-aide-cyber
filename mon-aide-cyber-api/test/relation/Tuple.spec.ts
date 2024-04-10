import { describe, expect } from 'vitest';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import { unDiagnostic } from '../constructeurs/constructeurDiagnostic';
import {
  Tuple,
  unObjet,
  unTuple,
  unUtilisateur,
} from '../../src/relation/Tuple';

describe('Tuple', () => {
  it('construis un tuple de type initiateur entre un aidant et un diagnostic', async () => {
    const diagnostic = unDiagnostic().construis();
    const aidant = unAidant().construis();

    const tuple = unTuple()
      .avecUtilisateur(
        unUtilisateur()
          .deTypeAidant()
          .avecIdentifiant(aidant.identifiant)
          .construis(),
      )
      .avecRelationInitiateur()
      .avecObjet(
        unObjet()
          .deTypeDiagnostic()
          .avecIdentifiant(diagnostic.identifiant)
          .construis(),
      )
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
