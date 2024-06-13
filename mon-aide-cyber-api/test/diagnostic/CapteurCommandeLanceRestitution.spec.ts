import { beforeEach, describe, expect, it } from 'vitest';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import {
  uneListeDe7QuestionsToutesAssociees,
  uneQuestion,
  uneReponsePossible,
  unReferentiel,
} from '../constructeurs/constructeurReferentiel';
import { unDiagnostic } from '../constructeurs/constructeurDiagnostic';
import { MesurePriorisee } from '../../src/diagnostic/Diagnostic';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import crypto from 'crypto';
import { ErreurMAC } from '../../src/domaine/erreurMAC';
import { AggregatNonTrouve } from '../../src/domaine/Aggregat';
import {
  CapteurCommandeLanceRestitution,
  CommandeLanceRestitution,
} from '../../src/diagnostic/CapteurCommandeLanceRestitution';
import { Entrepots } from '../../src/domaine/Entrepots';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { Constructeur } from '../constructeurs/constructeur';
import { desMesuresPour7Questions } from '../constructeurs/constructeurMesures';

describe('Capteur de lancement de la restitution', () => {
  let capteurCommandeLanceRestitution: CapteurCommandeLanceRestitution;
  let entrepots: Entrepots;
  const mesures = desMesuresPour7Questions();
  beforeEach(() => {
    entrepots = new EntrepotsMemoire();
    capteurCommandeLanceRestitution = new CapteurCommandeLanceRestitution(
      entrepots,
      new BusEvenementDeTest()
    );
  });

  it('génère les mesures', async () => {
    const questions = uneListeDe7QuestionsToutesAssociees();
    const diagnostic = unDiagnostic()
      .avecUnReferentiel(
        unReferentiel()
          .sansThematique()
          .ajouteUneThematique('thematique', questions)
          .construis()
      )
      .avecLesReponsesDonnees('thematique', [
        { q1: 'reponse-11' },
        { q2: 'reponse-21' },
        { q3: 'reponse-31' },
        { q4: 'reponse-41' },
        { q5: 'reponse-51' },
        { q6: 'reponse-61' },
        { q7: 'reponse-71' },
      ])
      .avecDesMesures(mesures)
      .construis();
    await entrepots.diagnostic().persiste(diagnostic);

    await capteurCommandeLanceRestitution.execute(
      new ConstructeurCommande(diagnostic.identifiant).construis()
    );

    const diagnosticRetourne = await entrepots
      .diagnostic()
      .lis(diagnostic.identifiant);
    expect(
      diagnosticRetourne.restitution?.mesures?.mesuresPrioritaires
    ).toStrictEqual<MesurePriorisee[]>([
      {
        valeurObtenue: 0,
        priorisation: 1,
        titre: 'mesure 1',
        pourquoi: 'parce-que',
        comment: 'comme ça',
      },
      {
        valeurObtenue: 0,
        priorisation: 2,
        titre: 'mesure 2',
        pourquoi: 'parce-que',
        comment: 'comme ça',
      },
      {
        valeurObtenue: 0,
        priorisation: 3,
        titre: 'mesure 3',
        pourquoi: 'parce-que',
        comment: 'comme ça',
      },
      {
        valeurObtenue: 0,
        priorisation: 4,
        titre: 'mesure 4',
        pourquoi: 'parce-que',
        comment: 'comme ça',
      },
      {
        valeurObtenue: 0,
        priorisation: 5,
        titre: 'mesure 5',
        pourquoi: 'parce-que',
        comment: 'comme ça',
      },
      {
        valeurObtenue: 0,
        priorisation: 6,
        titre: 'mesure 6',
        pourquoi: 'parce-que',
        comment: 'comme ça',
      },
    ]);
    expect(
      diagnosticRetourne.restitution?.mesures?.autresMesures
    ).toStrictEqual([
      {
        titre: 'mesure 7',
        pourquoi: 'parce-que',
        comment: 'comme ça',
        valeurObtenue: 0,
        priorisation: 7,
      },
    ]);
  });

  it("publie sur un bus d'événement Restitution Lancée", async () => {
    const maintenant = new Date();
    FournisseurHorlogeDeTest.initialise(maintenant);
    const busEvenement = new BusEvenementDeTest();
    const diagnostic = unDiagnostic()
      .avecUnReferentiel(
        unReferentiel()
          .ajouteUneQuestionAuContexte(
            uneQuestion()
              .aChoixUnique('Avez-vous quelque chose à envoyer ?')
              .avecReponsesPossibles([uneReponsePossible().construis()])
              .construis()
          )
          .construis()
      )
      .construis();
    await entrepots.diagnostic().persiste(diagnostic);

    await new CapteurCommandeLanceRestitution(entrepots, busEvenement).execute(
      new ConstructeurCommande(diagnostic.identifiant).construis()
    );

    expect(busEvenement.evenementRecu).toStrictEqual({
      identifiant: diagnostic.identifiant,
      type: 'RESTITUTION_LANCEE',
      date: maintenant,
      corps: {
        identifiantDiagnostic: diagnostic.identifiant,
        indicateurs: {},
        mesures: [],
      },
    });
  });

  it('si le diagnostic est inconnu, cela génère un erreur', async () => {
    await expect(() =>
      new CapteurCommandeLanceRestitution(
        entrepots,
        new BusEvenementDeTest()
      ).execute(new ConstructeurCommande(crypto.randomUUID()).construis())
    ).rejects.toStrictEqual(
      ErreurMAC.cree(
        'Demande la restitution',
        new AggregatNonTrouve('diagnostic')
      )
    );
  });
});

class ConstructeurCommande implements Constructeur<CommandeLanceRestitution> {
  constructor(private readonly idDiagnostic: crypto.UUID) {}

  construis(): CommandeLanceRestitution {
    return {
      idDiagnostic: this.idDiagnostic,
      type: 'CommandeLanceRestitution',
    };
  }
}
