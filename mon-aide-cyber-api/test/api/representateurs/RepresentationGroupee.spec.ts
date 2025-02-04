import { describe, expect, it } from 'vitest';
import { unTranscripteur } from './transcripteursDeTest';
import { RepresentationGroupee } from '../../../src/api/representateurs/RepresentationGroupee';
import { uneQuestionDiagnostic } from '../../constructeurs/constructeurDiagnostic';

describe('Représentation groupée', () => {
  it('numérote les questions', () => {
    const questions = [
      uneQuestionDiagnostic()
        .aChoixUnique()
        .avecLibelle('Quelle est la nature de votre entité?')
        .construis(),
      uneQuestionDiagnostic()
        .aChoixUnique()
        .avecLibelle("Quel est son secteur d'activité?")
        .construis(),
      uneQuestionDiagnostic()
        .aChoixUnique()
        .avecLibelle('Combien de personnes compte votre entité?')
        .construis(),
    ];
    const transcripteur = unTranscripteur()
      .avecLesThematiques(['thematique-groupee'])
      .avecLesQuestionsGroupees([
        {
          thematique: 'thematique-groupee',
          groupes: [
            {
              questions: [
                { identifiant: 'quelle-est-la-nature-de-votre-entite' },
                { identifiant: 'quel-est-son-secteur-dactivite' },
              ],
            },
            {
              questions: [
                { identifiant: 'combien-de-personnes-compte-votre-entite' },
              ],
            },
          ],
        },
      ])
      .construis();

    const representationQuestions = new RepresentationGroupee(
      transcripteur
    ).represente('thematique-groupee', { questions });

    expect(representationQuestions).toStrictEqual([
      {
        numero: 1,
        questions: [
          {
            type: 'choixUnique',
            identifiant: 'quelle-est-la-nature-de-votre-entite',
            libelle: 'Quelle est la nature de votre entité?',
            reponseDonnee: { valeur: null, reponses: [] },
            reponsesPossibles: [],
          },
          {
            type: 'choixUnique',
            identifiant: 'quel-est-son-secteur-dactivite',
            libelle: "Quel est son secteur d'activité?",
            reponseDonnee: { valeur: null, reponses: [] },
            reponsesPossibles: [],
          },
        ],
      },
      {
        numero: 2,
        questions: [
          {
            type: 'choixUnique',
            identifiant: 'combien-de-personnes-compte-votre-entite',
            libelle: 'Combien de personnes compte votre entité?',
            reponseDonnee: { valeur: null, reponses: [] },
            reponsesPossibles: [],
          },
        ],
      },
    ]);
  });

  it('numérote les questions non représentées', () => {
    const questions = [
      uneQuestionDiagnostic()
        .aChoixUnique()
        .avecLibelle('Quelle est la nature de votre entité?')
        .construis(),
      uneQuestionDiagnostic()
        .aChoixUnique()
        .avecLibelle("Quel est son secteur d'activité?")
        .construis(),
      uneQuestionDiagnostic()
        .aChoixUnique()
        .avecLibelle('Combien de personnes compte votre entité?')
        .construis(),
    ];
    const transcripteur = unTranscripteur()
      .avecLesThematiques(['thematique-groupee'])
      .avecLesQuestionsGroupees([
        {
          thematique: 'thematique-groupee',
          groupes: [
            {
              questions: [
                { identifiant: 'quelle-est-la-nature-de-votre-entite' },
                { identifiant: 'quel-est-son-secteur-dactivite' },
              ],
            },
          ],
        },
      ])
      .construis();

    const representationQuestions = new RepresentationGroupee(
      transcripteur
    ).represente('thematique-groupee', { questions });

    expect(representationQuestions).toStrictEqual([
      {
        numero: 1,
        questions: [
          {
            type: 'choixUnique',
            identifiant: 'quelle-est-la-nature-de-votre-entite',
            libelle: 'Quelle est la nature de votre entité?',
            reponseDonnee: { valeur: null, reponses: [] },
            reponsesPossibles: [],
          },
          {
            type: 'choixUnique',
            identifiant: 'quel-est-son-secteur-dactivite',
            libelle: "Quel est son secteur d'activité?",
            reponseDonnee: { valeur: null, reponses: [] },
            reponsesPossibles: [],
          },
        ],
      },
      {
        numero: 2,
        questions: [
          {
            type: 'choixUnique',
            identifiant: 'combien-de-personnes-compte-votre-entite',
            libelle: 'Combien de personnes compte votre entité?',
            reponseDonnee: { valeur: null, reponses: [] },
            reponsesPossibles: [],
          },
        ],
      },
    ]);
  });

  it('Passe si la question n’est plus présente dans le référentiel', () => {
    const questions = [
      uneQuestionDiagnostic()
        .aChoixUnique()
        .avecLibelle('Quelle est la nature de votre entité?')
        .construis(),
    ];
    const transcripteur = unTranscripteur()
      .avecLesThematiques(['thematique-groupee'])
      .avecLesQuestionsGroupees([
        {
          thematique: 'thematique-groupee',
          groupes: [
            {
              questions: [
                { identifiant: 'quelle-est-la-nature-de-votre-entite' },
                { identifiant: 'quel-est-son-secteur-dactivite' },
              ],
            },
            {
              questions: [
                { identifiant: 'combien-de-personnes-compte-votre-entite' },
              ],
            },
          ],
        },
      ])
      .construis();

    const representationQuestions = new RepresentationGroupee(
      transcripteur
    ).represente('thematique-groupee', { questions });

    expect(representationQuestions).toStrictEqual([
      {
        numero: 1,
        questions: [
          {
            type: 'choixUnique',
            identifiant: 'quelle-est-la-nature-de-votre-entite',
            libelle: 'Quelle est la nature de votre entité?',
            reponseDonnee: { valeur: null, reponses: [] },
            reponsesPossibles: [],
          },
        ],
      },
    ]);
  });
});
