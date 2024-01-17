import { beforeEach, describe, expect, it } from 'vitest';
import {
  uneQuestion,
  uneQuestionATiroir,
  uneReponsePossible,
  unReferentiel,
} from '../constructeurs/constructeurReferentiel';
import { unDiagnostic } from '../constructeurs/constructeurDiagnostic';
import {
  DiagnosticLance,
  ServiceDiagnostic,
} from '../../src/diagnostic/ServiceDiagnostic';
import { AdaptateurReferentielDeTest } from '../adaptateurs/AdaptateurReferentielDeTest';
import { Entrepots } from '../../src/domaine/Entrepots';
import {
  QuestionDiagnostic,
} from '../../src/diagnostic/Diagnostic';
import { AdaptateurMesuresTest } from '../adaptateurs/AdaptateurMesuresTest';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { AggregatNonTrouve } from '../../src/domaine/Aggregat';
import crypto from 'crypto';
import { ErreurMAC } from '../../src/domaine/erreurMAC';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';

describe('Le service de diagnostic', () => {
  let adaptateurReferentiel: AdaptateurReferentielDeTest;
  let adaptateurMesures: AdaptateurMesuresTest;
  let entrepots: Entrepots;

  beforeEach(() => {
    adaptateurReferentiel = new AdaptateurReferentielDeTest();
    adaptateurMesures = new AdaptateurMesuresTest();
    entrepots = new EntrepotsMemoire();
  });

  describe("Lorsque l'on veut accéder à un diagnostic", () => {
    it('retourne un diagnostic contenant une réponse avec une question à tiroir', async () => {
      const reponseAttendue = uneReponsePossible()
        .ajouteUneQuestionATiroir(
          uneQuestionATiroir()
            .aChoixMultiple('Quelles réponses ?')
            .avecReponsesPossibles([
              uneReponsePossible().avecLibelle('Réponse A').construis(),
              uneReponsePossible().avecLibelle('Réponse B').construis(),
              uneReponsePossible().avecLibelle('Réponse C').construis(),
            ])
            .construis(),
        )
        .construis();
      const question = uneQuestion()
        .avecReponsesPossibles([
          uneReponsePossible().construis(),
          reponseAttendue,
        ])
        .construis();
      const referentiel = unReferentiel()
        .ajouteUneQuestionAuContexte(uneQuestion().construis())
        .ajouteUneQuestionAuContexte(question)
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(referentiel)
        .construis();
      adaptateurReferentiel.ajoute(referentiel);
      await entrepots.diagnostic().persiste(diagnostic);
      const serviceDiagnostic = new ServiceDiagnostic(
        adaptateurReferentiel,
        adaptateurMesures,
        entrepots,
        new BusEvenementDeTest(),
      );

      const diagnosticRetourne = await serviceDiagnostic.diagnostic(
        diagnostic.identifiant,
      );

      const referentielDiagnostic = diagnosticRetourne.referentiel['contexte'];
      expect(
        referentielDiagnostic.questions.map((q) => q.reponseDonnee),
      ).toMatchObject([
        { reponseUnique: null, reponsesMultiples: new Set() },
        { reponseUnique: null, reponsesMultiples: new Set() },
      ]);
      expect(
        referentielDiagnostic.questions[1].reponsesPossibles[1],
      ).toMatchObject({
        identifiant: reponseAttendue.identifiant,
        libelle: reponseAttendue.libelle,
        ordre: reponseAttendue.ordre,
        questions: [
          {
            identifiant: 'quelles-reponses-',
            libelle: 'Quelles réponses ?',
            reponsesPossibles: [
              { identifiant: 'reponse-a', libelle: 'Réponse A', ordre: 0 },
              { identifiant: 'reponse-b', libelle: 'Réponse B', ordre: 1 },
              { identifiant: 'reponse-c', libelle: 'Réponse C', ordre: 2 },
            ],
            type: 'choixMultiple',
          },
        ],
      });
    });

    it('retourne un diagnostic contenant une réponse avec plusieurs questions à tiroir', async () => {
      const reponseAttendue = uneReponsePossible()
        .ajouteUneQuestionATiroir(uneQuestionATiroir().construis())
        .ajouteUneQuestionATiroir(
          uneQuestionATiroir()
            .aChoixMultiple('Autres réponses ?')
            .avecReponsesPossibles([
              uneReponsePossible().avecLibelle('AA').construis(),
              uneReponsePossible().avecLibelle('BB').construis(),
              uneReponsePossible().avecLibelle('CC').construis(),
            ])
            .construis(),
        )
        .construis();
      const question = uneQuestion()
        .avecReponsesPossibles([
          uneReponsePossible().construis(),
          reponseAttendue,
        ])
        .construis();
      const referentiel = unReferentiel()
        .ajouteUneQuestionAuContexte(uneQuestion().construis())
        .ajouteUneQuestionAuContexte(question)
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(referentiel)
        .construis();
      adaptateurReferentiel.ajoute(referentiel);
      await entrepots.diagnostic().persiste(diagnostic);
      const serviceDiagnostic = new ServiceDiagnostic(
        adaptateurReferentiel,
        adaptateurMesures,
        entrepots,
        new BusEvenementDeTest(),
      );

      const diagnosticRetourne = await serviceDiagnostic.diagnostic(
        diagnostic.identifiant,
      );

      const referentielDiagnostic = diagnosticRetourne.referentiel['contexte'];
      expect(referentielDiagnostic.questions[1].reponsesPossibles).toHaveLength(
        2,
      );
      expect(
        referentielDiagnostic.questions[1].reponsesPossibles[1].questions?.[1],
      ).toMatchObject({
        identifiant: 'autres-reponses-',
        libelle: 'Autres réponses ?',
        reponsesPossibles: [
          { identifiant: 'aa', libelle: 'AA', ordre: 0 },
          { identifiant: 'bb', libelle: 'BB', ordre: 1 },
          { identifiant: 'cc', libelle: 'CC', ordre: 2 },
        ],
        type: 'choixMultiple',
      });
    });

    it('si le diagnostic est inconnu, cela génère un erreur', async () => {
      await expect(() =>
        new ServiceDiagnostic(
          adaptateurReferentiel,
          adaptateurMesures,
          entrepots,
          new BusEvenementDeTest(),
        ).diagnostic(crypto.randomUUID()),
      ).rejects.toStrictEqual(
        ErreurMAC.cree('Accès diagnostic', new AggregatNonTrouve('diagnostic')),
      );
    });
  });

  describe("Lorsque l'on veut lancer un diagnostic", () => {
    it('copie le référentiel disponible et le persiste', async () => {
      const referentiel = unReferentiel()
        .ajouteUneQuestionAuContexte(uneQuestion().construis())
        .construis();
      adaptateurReferentiel.ajoute(referentiel);
      const questionAttendue = referentiel.contexte.questions[0];

      const diagnostic = await new ServiceDiagnostic(
        adaptateurReferentiel,
        adaptateurMesures,
        entrepots,
        new BusEvenementDeTest(),
      ).lance();

      const diagnosticRetourne = await entrepots
        .diagnostic()
        .lis(diagnostic.identifiant);
      expect(diagnosticRetourne.identifiant).not.toBeUndefined();
      expect(
        diagnosticRetourne.referentiel['contexte'].questions,
      ).toStrictEqual<QuestionDiagnostic[]>([
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

      const diagnostic = await new ServiceDiagnostic(
        adaptateurReferentiel,
        adaptateurMesures,
        entrepots,
        new BusEvenementDeTest(),
      ).lance();

      const diagnosticRetourne = await entrepots
        .diagnostic()
        .lis(diagnostic.identifiant);
      expect(diagnosticRetourne.dateCreation).toStrictEqual(
        FournisseurHorloge.maintenant(),
      );
      expect(diagnosticRetourne.dateDerniereModification).toStrictEqual(
        FournisseurHorloge.maintenant(),
      );
    });

    it("publie sur un bus d'événement DiagnosticLance", async () => {
      const maintenant = new Date();
      FournisseurHorlogeDeTest.initialise(maintenant);
      const busEvenement = new BusEvenementDeTest();
      adaptateurReferentiel.ajoute(unReferentiel().construis());
      const diagnostic = await new ServiceDiagnostic(
        adaptateurReferentiel,
        adaptateurMesures,
        entrepots,
        busEvenement,
      ).lance();

      expect(busEvenement.evenementRecu).toStrictEqual<DiagnosticLance>({
        identifiant: diagnostic.identifiant,
        type: 'DIAGNOSTIC_LANCE',
        date: maintenant,
        corps: { identifiantDiagnostic: diagnostic.identifiant },
      });
    });

    it('cela peut générer une erreur', async () => {
      await expect(() =>
        new ServiceDiagnostic(
          adaptateurReferentiel,
          adaptateurMesures,
          entrepots,
          new BusEvenementDeTest(),
        ).lance(),
      ).rejects.toStrictEqual(
        ErreurMAC.cree(
          'Lance le diagnostic',
          new Error('Referentiel non connu'),
        ),
      );
    });
  });
});
