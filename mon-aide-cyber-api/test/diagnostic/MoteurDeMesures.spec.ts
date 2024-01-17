import { describe, expect, it } from 'vitest';
import {
  uneQuestionDiagnostic,
  uneReponseDonnee,
} from '../constructeurs/constructeurDiagnostic';
import {
  uneQuestionATiroir,
  uneReponsePossible,
} from '../constructeurs/constructeurReferentiel';
import { desMesures } from '../constructeurs/constructeurMesures';
import { MoteurMesures } from '../../src/diagnostic/MoteurMesures';
import { MesureDiagnostic } from '../../src/diagnostic/Diagnostic';

describe('Moteur de mesures', () => {
  const mesures = desMesures()
    .avecLesMesures([
      {
        RGPD: {
          niveau1: 'mesure 1',
          niveau2: 'mesure 2',
          priorisation: 1,
        },
        RGPD2: {
          niveau1: 'mesure RGPD 2 1',
          niveau2: 'mesure RGPD 2 2',
          priorisation: 2,
        },
      },
    ])
    .construis();

  describe('recommande les mesures aux réponses fournies', () => {
    it('de niveau 1', () => {
      const questionRepondue = uneQuestionDiagnostic()
        .avecLesReponsesPossibles([
          uneReponsePossible()
            .avecLibelle('Non')
            .associeeAMesure('RGPD', 1, 0)
            .construis(),
        ])
        .ayantLaReponseUnique('non')
        .construis();

      const mesuresGenerees = MoteurMesures.genere(questionRepondue, mesures);

      expect(mesuresGenerees).toStrictEqual<MesureDiagnostic[]>([
        {
          repondA: questionRepondue.identifiant,
          niveau: {
            titre: 'mesure 1',
            comment: 'comme ça',
            pourquoi: 'parce-que',
          },
          priorisation: 1,
        },
      ]);
    });

    it('de niveau 2', () => {
      const questionRepondue = uneQuestionDiagnostic()
        .avecLesReponsesPossibles([
          uneReponsePossible()
            .avecLibelle('Oui mais')
            .associeeAMesure('RGPD', 2, 1)
            .construis(),
        ])
        .ayantLaReponseUnique('oui-mais')
        .construis();

      const mesuresGenerees = MoteurMesures.genere(questionRepondue, mesures);

      expect(mesuresGenerees).toStrictEqual<MesureDiagnostic[]>([
        {
          repondA: questionRepondue.identifiant,
          niveau: {
            titre: 'mesure 2',
            comment: 'comme ça',
            pourquoi: 'parce-que',
          },
          priorisation: 1,
        },
      ]);
    });

    it('avec plusieurs mesures', () => {
      const questionRepondue = uneQuestionDiagnostic()
        .avecLesReponsesPossibles([
          uneReponsePossible()
            .avecLibelle('Oui mais')
            .associeeAMesure('RGPD', 2, 2)
            .associeeAMesure('RGPD2', 1, 0)
            .construis(),
        ])
        .ayantLaReponseUnique('oui-mais')
        .construis();

      const mesuresGenerees = MoteurMesures.genere(questionRepondue, mesures);

      expect(mesuresGenerees).toStrictEqual<MesureDiagnostic[]>([
        {
          repondA: questionRepondue.identifiant,
          niveau: {
            titre: 'mesure 2',
            comment: 'comme ça',
            pourquoi: 'parce-que',
          },
          priorisation: 1,
        },
        {
          repondA: questionRepondue.identifiant,
          niveau: {
            titre: 'mesure RGPD 2 1',
            comment: 'comme ça',
            pourquoi: 'parce-que',
          },
          priorisation: 2,
        },
      ]);
    });

    describe('pour les questions à tiroir', () => {
      const mesures = desMesures()
        .avecLesMesures([
          {
            'ordinateur-obsolete': {
              niveau1: 'Obsolète',
              niveau2: 'Obsolète niveau 2',
              priorisation: 4,
            },
          },
          {
            'obsolete-annee-1980': {
              niveau1: 'Les années 80 c’est bien mais',
              niveau2: 'Passez aux années 90',
              priorisation: 3,
            },
          },
          {
            'obsolete-annee-1990': {
              niveau1: '',
              niveau2: 'Passez aux années 2000',
              priorisation: 5,
            },
          },
        ])
        .construis();
      it('unique', () => {
        const questionRepondue = uneQuestionDiagnostic()
          .avecLibelle('Avez-vous un ordinateur?')
          .avecLesReponsesPossibles([
            uneReponsePossible()
              .avecLibelle('Ordinateur obsolète')
              .ajouteUneQuestionATiroir(
                uneQuestionATiroir()
                  .aChoixUnique('Quelle année?')
                  .avecReponsesPossibles([
                    uneReponsePossible()
                      .avecLibelle('1980')
                      .associeeAMesure('obsolete-annee-1980', 1, 0)
                      .construis(),
                    uneReponsePossible()
                      .avecLibelle('1990')
                      .associeeAMesure('obsolete-annee-1990', 2, 2)
                      .construis(),
                  ])
                  .construis(),
              )
              .construis(),
          ])
          .ayantLaReponseDonnee(
            uneReponseDonnee()
              .ayantPourReponse('ordinateur-obsolete')
              .avecDesReponsesMultiples([
                {
                  identifiant: 'quelle-annee',
                  reponses: ['1980'],
                },
              ])
              .construis(),
          )
          .construis();

        const mesuresGenerees = MoteurMesures.genere(questionRepondue, mesures);

        expect(mesuresGenerees).toStrictEqual<MesureDiagnostic[]>([
          {
            repondA: 'quelle-annee',
            niveau: {
              titre: 'Les années 80 c’est bien mais',
              comment: 'comme ça',
              pourquoi: 'parce-que',
            },
            priorisation: 3,
          },
        ]);
      });

      it('multiples', () => {
        const questionRepondue = uneQuestionDiagnostic()
          .avecLibelle('Avez-vous un ordinateur?')
          .avecLesReponsesPossibles([
            uneReponsePossible()
              .avecLibelle('Ordinateur obsolète')
              .ajouteUneQuestionATiroir(
                uneQuestionATiroir()
                  .aChoixUnique('Quelle année?')
                  .avecReponsesPossibles([
                    uneReponsePossible()
                      .avecLibelle('1980')
                      .associeeAMesure('obsolete-annee-1980', 1, 0)
                      .construis(),
                    uneReponsePossible()
                      .avecLibelle('1990')
                      .associeeAMesure('obsolete-annee-1990', 2, 2)
                      .construis(),
                  ])
                  .construis(),
              )
              .ajouteUneQuestionATiroir(
                uneQuestionATiroir()
                  .avecReponsesPossibles([
                    uneReponsePossible().construis(),
                    uneReponsePossible().construis(),
                  ])
                  .construis(),
              )
              .associeeAMesure('ordinateur-obsolete', 2, 1)
              .construis(),
          ])
          .ayantLaReponseDonnee(
            uneReponseDonnee()
              .ayantPourReponse('ordinateur-obsolete')
              .avecDesReponsesMultiples([
                {
                  identifiant: 'quelle-annee',
                  reponses: ['1980'],
                },
              ])
              .construis(),
          )
          .construis();

        const mesuresGenerees = MoteurMesures.genere(questionRepondue, mesures);

        expect(mesuresGenerees).toStrictEqual<MesureDiagnostic[]>([
          {
            repondA: 'quelle-annee',
            niveau: {
              titre: 'Les années 80 c’est bien mais',
              comment: 'comme ça',
              pourquoi: 'parce-que',
            },
            priorisation: 3,
          },
          {
            repondA: questionRepondue.identifiant,
            niveau: {
              titre: 'Obsolète niveau 2',
              comment: 'comme ça',
              pourquoi: 'parce-que',
            },
            priorisation: 4,
          },
        ]);
      });
    });
  });
});
