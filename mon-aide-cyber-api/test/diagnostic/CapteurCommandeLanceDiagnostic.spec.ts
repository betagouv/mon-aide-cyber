import { beforeEach, describe, expect, it } from 'vitest';
import {
  uneQuestion,
  unReferentiel,
} from '../constructeurs/constructeurReferentiel';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { QuestionDiagnostic } from '../../src/diagnostic/Diagnostic';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { ErreurMAC } from '../../src/domaine/erreurMAC';
import { AdaptateurReferentielDeTest } from '../adaptateurs/AdaptateurReferentielDeTest';
import { Entrepots } from '../../src/domaine/Entrepots';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import {
  CapteurCommandeLanceDiagnostic,
  DiagnosticLance,
} from '../../src/diagnostic/CapteurCommandeLanceDiagnostic';
import { AdaptateurMesuresTest } from '../adaptateurs/AdaptateurMesuresTest';
import crypto from 'crypto';

describe('Capteur pour lancer un diagnostic', () => {
  let adaptateurReferentiel: AdaptateurReferentielDeTest;
  let adaptateurMesures: AdaptateurMesuresTest;
  let entrepots: Entrepots;

  beforeEach(() => {
    adaptateurReferentiel = new AdaptateurReferentielDeTest();
    adaptateurMesures = new AdaptateurMesuresTest();
    entrepots = new EntrepotsMemoire();
  });

  it('copie le référentiel disponible et le persiste', async () => {
    const referentiel = unReferentiel()
      .ajouteUneQuestionAuContexte(uneQuestion().construis())
      .construis();
    adaptateurReferentiel.ajoute(referentiel);
    const questionAttendue = referentiel.contexte.questions[0];

    const diagnostic = await new CapteurCommandeLanceDiagnostic(
      entrepots,
      new BusEvenementDeTest()
    ).execute({
      type: 'CommandeLanceDiagnostic',
      adaptateurReferentiel,
      adaptateurReferentielDeMesures: adaptateurMesures,
      identifiantAidant: crypto.randomUUID(),
    });

    const diagnosticRetourne = await entrepots
      .diagnostic()
      .lis(diagnostic.identifiant);
    expect(diagnosticRetourne.identifiant).not.toBeUndefined();
    expect(diagnosticRetourne.referentiel['contexte'].questions).toStrictEqual<
      QuestionDiagnostic[]
    >([
      {
        identifiant: questionAttendue.identifiant,
        libelle: questionAttendue.libelle,
        type: questionAttendue.type,
        poids: questionAttendue.poids,
        reponsesPossibles: questionAttendue.reponsesPossibles,
        reponseDonnee: { reponseUnique: null, reponsesMultiples: [] },
      },
    ]);
  });

  it('les dates de création et modification sont initialisées', async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const referentiel = unReferentiel().construis();
    adaptateurReferentiel.ajoute(referentiel);

    const diagnostic = await new CapteurCommandeLanceDiagnostic(
      entrepots,
      new BusEvenementDeTest()
    ).execute({
      type: 'CommandeLanceDiagnostic',
      adaptateurReferentiel,
      adaptateurReferentielDeMesures: adaptateurMesures,
      identifiantAidant: crypto.randomUUID(),
    });

    const diagnosticRetourne = await entrepots
      .diagnostic()
      .lis(diagnostic.identifiant);
    expect(diagnosticRetourne.dateCreation).toStrictEqual(
      FournisseurHorloge.maintenant()
    );
    expect(diagnosticRetourne.dateDerniereModification).toStrictEqual(
      FournisseurHorloge.maintenant()
    );
  });

  it("publie sur un bus d'événement DiagnosticLance", async () => {
    const maintenant = new Date();
    FournisseurHorlogeDeTest.initialise(maintenant);
    const busEvenement = new BusEvenementDeTest();
    adaptateurReferentiel.ajoute(unReferentiel().construis());
    const identifiantAidant = crypto.randomUUID();

    const diagnostic = await new CapteurCommandeLanceDiagnostic(
      entrepots,
      busEvenement
    ).execute({
      type: 'CommandeLanceDiagnostic',
      adaptateurReferentiel,
      adaptateurReferentielDeMesures: adaptateurMesures,
      identifiantAidant,
    });

    expect(busEvenement.evenementRecu).toStrictEqual<DiagnosticLance>({
      identifiant: diagnostic.identifiant,
      type: 'DIAGNOSTIC_LANCE',
      date: maintenant,
      corps: {
        identifiantDiagnostic: diagnostic.identifiant,
        identifiantAidant,
      },
    });
  });

  it('cela peut générer une erreur', async () => {
    await expect(() =>
      new CapteurCommandeLanceDiagnostic(
        entrepots,
        new BusEvenementDeTest()
      ).execute({
        type: 'CommandeLanceDiagnostic',
        adaptateurReferentiel,
        adaptateurReferentielDeMesures: adaptateurMesures,
        identifiantAidant: crypto.randomUUID(),
      })
    ).rejects.toStrictEqual(
      ErreurMAC.cree('Lance le diagnostic', new Error('Referentiel non connu'))
    );
  });
});
