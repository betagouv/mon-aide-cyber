import { beforeEach, describe, expect, it } from 'vitest';
import {
  uneQuestion,
  uneQuestionATiroir,
  uneReponsePossible,
  unReferentiel,
} from '../constructeurs/constructeurReferentiel';
import { unDiagnostic } from '../constructeurs/constructeurDiagnostic';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { QuestionDiagnostic } from '../../src/diagnostic/Diagnostic';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import crypto from 'crypto';
import { ErreurMAC } from '../../src/domaine/erreurMAC';
import { AggregatNonTrouve } from '../../src/domaine/Aggregat';
import { Entrepots } from '../../src/domaine/Entrepots';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import {
  CapteurSagaAjoutReponse,
  CorpsReponseQuestionATiroir,
  SagaAjoutReponse,
} from '../../src/diagnostic/CapteurSagaAjoutReponse';
import { Constructeur } from '../constructeurs/constructeur';
import { fakerFR } from '@faker-js/faker';
import { BusCommandeTest } from '../infrastructure/bus/BusCommandeTest';

describe("Capteur d'ajout de réponse au diagnostic", () => {
  let entrepots: Entrepots;

  beforeEach(() => {
    entrepots = new EntrepotsMemoire();
  });
  describe('Lorsque l’on veut ajouter une réponse au diagnostic', () => {
    it('met à jour les réponses d’une question à tiroir', async () => {
      const premiereReponse = uneReponsePossible().construis();
      const secondeReponse = uneReponsePossible().construis();
      const reponseAvecQuestionATiroir = uneReponsePossible()
        .ajouteUneQuestionATiroir(
          uneQuestion()
            .aChoixMultiple('QCM ?')
            .avecReponsesPossibles([
              premiereReponse,
              uneReponsePossible().construis(),
              secondeReponse,
            ])
            .construis()
        )
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(
              uneQuestion()
                .aChoixUnique('Question à tiroir ?')
                .avecReponsesPossibles([reponseAvecQuestionATiroir])
                .construis()
            )
            .construis()
        )
        .construis();
      await entrepots.diagnostic().persiste(diagnostic);

      await new CapteurSagaAjoutReponse(
        entrepots,
        new BusCommandeTest(),
        new BusEvenementDeTest()
      ).execute(
        new ConstructeurSagaAjoutReponse(diagnostic.identifiant)
          .avecUnchemin('contexte')
          .avecUnIdentifiant('question-a-tiroir-')
          .avecUneReponse({
            reponse: reponseAvecQuestionATiroir.identifiant,
            questions: [
              {
                identifiant: 'qcm-',
                reponses: [
                  premiereReponse.identifiant,
                  secondeReponse.identifiant,
                ],
              },
            ],
          })
          .construis()
      );

      const diagnosticRetourne = await entrepots
        .diagnostic()
        .lis(diagnostic.identifiant);
      const question = diagnosticRetourne.referentiel.contexte
        .questions[0] as QuestionDiagnostic;
      expect(question.reponseDonnee).toMatchObject({
        reponseUnique: reponseAvecQuestionATiroir.identifiant,
        reponsesMultiples: [
          {
            identifiant: 'qcm-',
            reponses: new Set([
              premiereReponse.identifiant,
              secondeReponse.identifiant,
            ]),
          },
        ],
      });
    });

    it("publie sur un bus d'événement ReponseAjoutee", async () => {
      const maintenant = new Date();
      FournisseurHorlogeDeTest.initialise(maintenant);
      const busEvenement = new BusEvenementDeTest();
      const secondeReponse = uneReponsePossible().construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(
              uneQuestion()
                .aChoixUnique('Avez-vous quelque chose à envoyer ?')
                .avecReponsesPossibles([secondeReponse])
                .construis()
            )
            .construis()
        )
        .construis();
      await entrepots.diagnostic().persiste(diagnostic);

      await new CapteurSagaAjoutReponse(
        entrepots,
        new BusCommandeTest(),
        busEvenement
      ).execute(
        new ConstructeurSagaAjoutReponse(diagnostic.identifiant)
          .avecUnIdentifiant('avezvous-quelque-chose-a-envoyer-')
          .avecUnchemin('contexte')
          .avecUneReponse(secondeReponse.identifiant)
          .construis()
      );

      expect(busEvenement.evenementRecu).toStrictEqual({
        identifiant: diagnostic.identifiant,
        type: 'REPONSE_AJOUTEE',
        date: maintenant,
        corps: {
          identifiantDiagnostic: diagnostic.identifiant,
          thematique: 'contexte',
          identifiantQuestion: 'avezvous-quelque-chose-a-envoyer-',
          reponse: secondeReponse.identifiant,
        },
      });
    });

    it('met à jour les réponses de plusieurs questions à tiroir', async () => {
      const premiereReponse = uneReponsePossible().construis();
      const secondeReponse = uneReponsePossible().construis();
      const reponseAvecQuestionsATiroir = uneReponsePossible()
        .ajouteUneQuestionATiroir(
          uneQuestionATiroir()
            .aChoixMultiple('tiroir 1 ?')
            .avecReponsesPossibles([
              premiereReponse,
              uneReponsePossible().construis(),
            ])
            .construis()
        )
        .ajouteUneQuestionATiroir(
          uneQuestionATiroir()
            .aChoixUnique('tiroir 2 ?')
            .avecReponsesPossibles([
              secondeReponse,
              uneReponsePossible().construis(),
            ])
            .construis()
        )
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(
              uneQuestion()
                .aChoixUnique('Question à tiroir ?')
                .avecReponsesPossibles([reponseAvecQuestionsATiroir])
                .construis()
            )
            .construis()
        )
        .construis();
      await entrepots.diagnostic().persiste(diagnostic);

      await new CapteurSagaAjoutReponse(
        entrepots,
        new BusCommandeTest(),
        new BusEvenementDeTest()
      ).execute(
        new ConstructeurSagaAjoutReponse(diagnostic.identifiant)
          .avecUnchemin('contexte')
          .avecUnIdentifiant('question-a-tiroir-')
          .avecUneReponse({
            reponse: reponseAvecQuestionsATiroir.identifiant,
            questions: [
              {
                identifiant: 'tiroir-1-',
                reponses: [premiereReponse.identifiant],
              },
              {
                identifiant: 'tiroir-2-',
                reponses: [secondeReponse.identifiant],
              },
            ],
          })
          .construis()
      );

      const diagnosticRetourne = await entrepots
        .diagnostic()
        .lis(diagnostic.identifiant);
      const question = diagnosticRetourne.referentiel.contexte
        .questions[0] as QuestionDiagnostic;
      expect(question.reponseDonnee).toMatchObject({
        reponseUnique: reponseAvecQuestionsATiroir.identifiant,
        reponsesMultiples: [
          {
            identifiant: 'tiroir-1-',
            reponses: new Set([premiereReponse.identifiant]),
          },
          {
            identifiant: 'tiroir-2-',
            reponses: new Set([secondeReponse.identifiant]),
          },
        ],
      });
    });

    it('si le diagnostic est inconnu, cela génère un erreur', async () => {
      await expect(() =>
        new CapteurSagaAjoutReponse(
          entrepots,
          new BusCommandeTest(),
          new BusEvenementDeTest()
        ).execute(
          new ConstructeurSagaAjoutReponse(crypto.randomUUID())
            .avecUnchemin('')
            .avecUnIdentifiant('')
            .avecUneReponse('')
            .construis()
        )
      ).rejects.toStrictEqual(
        ErreurMAC.cree(
          'Ajout réponse au diagnostic',
          new AggregatNonTrouve('diagnostic')
        )
      );
    });

    it('met à jour la date de dernière modification', async () => {
      const dateCreation = new Date(2023, 10, 12, 11, 15, 22);
      FournisseurHorlogeDeTest.initialise(dateCreation);
      const secondeReponse = uneReponsePossible().construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(
              uneQuestion()
                .aChoixUnique('Faites-vous une mise à jour ?')
                .avecReponsesPossibles([secondeReponse])
                .construis()
            )
            .construis()
        )
        .construis();
      await entrepots.diagnostic().persiste(diagnostic);
      const dateDerniereModification = new Date(2023, 10, 12, 12, 20, 10);
      FournisseurHorlogeDeTest.initialise(dateDerniereModification);

      await new CapteurSagaAjoutReponse(
        entrepots,
        new BusCommandeTest(),
        new BusEvenementDeTest()
      ).execute(
        new ConstructeurSagaAjoutReponse(diagnostic.identifiant)
          .avecUnchemin('contexte')
          .avecUnIdentifiant('avezvous-quelque-chose-a-envoyer-')
          .avecUneReponse(secondeReponse.identifiant)
          .construis()
      );

      const diagnosticRetourne = await entrepots
        .diagnostic()
        .lis(diagnostic.identifiant);
      expect(diagnosticRetourne.dateCreation).toStrictEqual(dateCreation);
      expect(diagnosticRetourne.dateDerniereModification).toStrictEqual(
        dateDerniereModification
      );
    });

    it('publie sur le bus de commande la commande de génération de restitution', async () => {
      const question = uneQuestion().construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel().ajouteUneQuestionAuContexte(question).construis()
        )
        .construis();
      await entrepots.diagnostic().persiste(diagnostic);
      const busDeCommande: BusCommandeTest = new BusCommandeTest();

      await new CapteurSagaAjoutReponse(
        entrepots,
        busDeCommande,
        new BusEvenementDeTest()
      ).execute(
        new ConstructeurSagaAjoutReponse(diagnostic.identifiant)
          .avecUnIdentifiant(question.identifiant)
          .avecUnchemin('contexte')
          .avecUneReponse(question.reponsesPossibles[0].identifiant)
          .construis()
      );

      expect(busDeCommande.aRecu('CommandeLanceRestitution')).toBe(true);
    });
  });
});

class ConstructeurSagaAjoutReponse implements Constructeur<SagaAjoutReponse> {
  private chemin: string = fakerFR.string.alpha(10);
  private identifiant: string = fakerFR.string.alpha(10);
  private reponse: string | string[] | CorpsReponseQuestionATiroir =
    fakerFR.string.alpha(10);

  constructor(private readonly idDiagnostic: crypto.UUID) {}

  avecUnchemin(chemin: string): ConstructeurSagaAjoutReponse {
    this.chemin = chemin;
    return this;
  }

  avecUnIdentifiant(identifiant: string): ConstructeurSagaAjoutReponse {
    this.identifiant = identifiant;
    return this;
  }

  avecUneReponse(
    reponse: string | string[] | CorpsReponseQuestionATiroir
  ): ConstructeurSagaAjoutReponse {
    this.reponse = reponse;
    return this;
  }

  construis(): SagaAjoutReponse {
    return {
      chemin: this.chemin,
      idDiagnostic: this.idDiagnostic,
      identifiant: this.identifiant,
      reponse: this.reponse,
      type: 'SagaAjoutReponse',
    };
  }
}
