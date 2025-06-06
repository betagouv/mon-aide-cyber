import { beforeEach, describe, expect, it } from 'vitest';
import { chiffreLesIdentifiantsDesEntitesAidesDansLesRelations } from '../../../../src/administration/diagnostics/rattrapage-entites-diagnostics/rattrapage';
import { EntrepotRelationMemoire } from '../../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { FauxServiceDeChiffrement } from '../../../infrastructure/securite/FauxServiceDeChiffrement';
import { Tuple, unTuple } from '../../../../src/relation/Tuple';
import {
  definitionEntiteAideeBeneficieDiagnostic,
  DefinitionEntiteAideeBeneficieDiagnostic,
} from '../../../../src/diagnostic/tuples';
import crypto from 'crypto';

describe('Rattrapage des identifiants des entités Aidées', () => {
  let serviceDeChiffrement: FauxServiceDeChiffrement;
  let entrepotRelation: EntrepotRelationMemoire;

  beforeEach(async () => {
    serviceDeChiffrement = new FauxServiceDeChiffrement(new Map());
    entrepotRelation = new EntrepotRelationMemoire();
  });

  const creeUneEntiteAideeBeneficiantDuDiagnostic = async (
    identifiantDiagnostic: crypto.UUID,
    identifiantEntiteAidee: any
  ) => {
    const tuple = unTuple<DefinitionEntiteAideeBeneficieDiagnostic>(
      definitionEntiteAideeBeneficieDiagnostic
    )
      .avecUtilisateur(identifiantEntiteAidee)
      .avecObjet(identifiantDiagnostic)
      .construis();
    await entrepotRelation.persiste(tuple);
    return tuple;
  };

  it('Chiffre les identifiants Aidés', async () => {
    serviceDeChiffrement.ajoute('email@entite-aidee.com', 'aaa');
    serviceDeChiffrement.lanceUneExceptionSurDechiffre(
      'email@entite-aidee.com'
    );
    const identifiantDiagnostic = crypto.randomUUID();
    const tuple = await creeUneEntiteAideeBeneficiantDuDiagnostic(
      identifiantDiagnostic,
      'email@entite-aidee.com'
    );

    await chiffreLesIdentifiantsDesEntitesAidesDansLesRelations(
      entrepotRelation,
      serviceDeChiffrement,
      [{ id: tuple.identifiant, identifiant: 'email@entite-aidee.com' }]
    );

    expect(await entrepotRelation.toutesLesEntites()).toStrictEqual<Tuple[]>([
      {
        identifiant: expect.any(String),
        utilisateur: { type: 'entiteAidee', identifiant: 'aaa' },
        relation: 'destinataire',
        objet: { type: 'diagnostic', identifiant: identifiantDiagnostic },
      },
    ]);
  });

  it('Ne chiffre pas les identifiants Aidés si c’est déjà le cas', async () => {
    serviceDeChiffrement.ajoute('email-non-chiffre@entite-aidee.com', 'aaa');
    serviceDeChiffrement.ajoute('email-deja-chiffre@entite-aidee.com', 'bbb');
    serviceDeChiffrement.lanceUneExceptionSurDechiffre(
      'email-non-chiffre@entite-aidee.com'
    );
    const identifiantPremierDiagnostic = crypto.randomUUID();
    const tupleNonChiffre = await creeUneEntiteAideeBeneficiantDuDiagnostic(
      identifiantPremierDiagnostic,
      'email-non-chiffre@entite-aidee.com'
    );
    const identifiantDeuxiemeDiagnostic = crypto.randomUUID();
    const tupleChiffre = await creeUneEntiteAideeBeneficiantDuDiagnostic(
      identifiantDeuxiemeDiagnostic,
      'bbb'
    );

    await chiffreLesIdentifiantsDesEntitesAidesDansLesRelations(
      entrepotRelation,
      serviceDeChiffrement,
      [
        {
          id: tupleNonChiffre.identifiant,
          identifiant: 'email-non-chiffre@entite-aidee.com',
        },
        {
          id: tupleChiffre.identifiant,
          identifiant: 'email-deja-chiffre@entite-aidee.com',
        },
      ]
    );

    expect(await entrepotRelation.toutesLesEntites()).toStrictEqual<Tuple[]>([
      {
        identifiant: expect.any(String),
        utilisateur: { type: 'entiteAidee', identifiant: 'aaa' },
        relation: 'destinataire',
        objet: {
          type: 'diagnostic',
          identifiant: identifiantPremierDiagnostic,
        },
      },
      {
        identifiant: expect.any(String),
        utilisateur: { type: 'entiteAidee', identifiant: 'bbb' },
        relation: 'destinataire',
        objet: {
          type: 'diagnostic',
          identifiant: identifiantDeuxiemeDiagnostic,
        },
      },
    ]);
  });
});
