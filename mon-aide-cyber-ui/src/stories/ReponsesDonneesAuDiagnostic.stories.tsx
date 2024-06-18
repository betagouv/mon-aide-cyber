import { Meta, StoryObj } from '@storybook/react';
import { unDiagnostic } from '../../test/constructeurs/constructeurDiagnostic.ts';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import {
  uneQuestionAChoixMultiple,
  uneQuestionAChoixUnique,
  uneQuestionTiroirAChoixMultiple,
  uneQuestionTiroirAChoixUnique,
} from '../../test/constructeurs/constructeurQuestions.ts';
import { uneReponsePossible } from '../../test/constructeurs/constructeurReponsePossible.ts';
import { ComposantAffichageErreur } from '../composants/alertes/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { unReferentiel } from '../../test/constructeurs/constructeurReferentiel.ts';
import { ComposantDiagnostic } from '../composants/diagnostic/ComposantDiagnostic.tsx';
import { uneAction } from '../../test/constructeurs/constructeurActionDiagnostic.ts';
import {
  Diagnostic,
  ReponseQuestionATiroir,
} from '../domaine/diagnostic/Diagnostic.ts';
import { UUID } from '../types/Types.ts';
import { ContexteMacAPI } from '../fournisseurs/api/ContexteMacAPI.tsx';
import { ServeurMACMemoire } from './ServeurMACMemoire.ts';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { MemoryRouter } from 'react-router-dom';
import { FournisseurNavigationMAC } from '../fournisseurs/ContexteNavigationMAC.tsx';

const actionRepondre = uneAction().contexte().construis();

const identifiantQuestionAChoixUnique = '6dadad14-8fa0-4be7-a8da-473d538eb6c1';
const reponseDonneeChoixUnique = uneReponsePossible().construis();
const diagnosticAvecUneQuestionAChoixUnique = unDiagnostic()
  .ajouteAction(actionRepondre)
  .avecIdentifiant(identifiantQuestionAChoixUnique)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle('Quelle entreprise êtes-vous ?')
          .avecDesReponses([
            uneReponsePossible().avecLibelle('Entreprise privée').construis(),
            reponseDonneeChoixUnique,
            uneReponsePossible().construis(),
          ])
          .avecLaReponseDonnee(reponseDonneeChoixUnique)
          .construis()
      )
      .construis()
  )
  .construis();

const identifiantQuestionListeDeroulante =
  '1cdaac38-2ee8-413d-ac00-00f8b5fbad10';
const reponseSelectionnee = uneReponsePossible()
  .avecLibelle('Réponse B')
  .construis();
const diagnosticAvecQuestionSousFormeDeListeDeroulante = unDiagnostic()
  .ajouteAction(actionRepondre)
  .avecIdentifiant(identifiantQuestionListeDeroulante)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle('Une liste déroulante?')
          .sousFormeDeListe()
          .avecDesReponses([
            uneReponsePossible().avecLibelle('Réponse A').construis(),
            reponseSelectionnee,
            uneReponsePossible().avecLibelle('Réponse C').construis(),
          ])
          .avecLaReponseDonnee(reponseSelectionnee)
          .construis()
      )
      .construis()
  )
  .construis();

const identifiantDiagnosticAvecPlusieursThematiques =
  'aa1a75a3-8896-4ab2-81e3-24a773ec994e';
const diagnosticAPlusieursThematiques = unDiagnostic()
  .avecIdentifiant(identifiantDiagnosticAvecPlusieursThematiques)
  .avecUnReferentiel(
    unReferentiel()
      .ajouteUneThematique('Thème 1', [
        uneQuestionAChoixUnique().construis(),
        uneQuestionAChoixUnique().construis(),
      ])
      .avecUneQuestion(uneQuestionAChoixUnique().construis())
      .construis()
  )
  .construis();

const identifiantQuestionATiroir = '4a0242d6-26c0-459b-85bd-bf2ce9962c9b';
const reponseAvecQuestionAChoixMultiple = uneReponsePossible()
  .avecLibelle('Plusieurs choix?')
  .avecUneQuestion(
    uneQuestionTiroirAChoixMultiple()
      .avecLibelle('La question?')
      .avecDesReponses([
        uneReponsePossible().avecLibelle('choix 1').construis(),
        uneReponsePossible().avecLibelle('choix 2').construis(),
        uneReponsePossible().avecLibelle('choix 3').construis(),
        uneReponsePossible().avecLibelle('choix 4').construis(),
      ])
      .construis()
  );
const diagnosticAvecQuestionATiroir = unDiagnostic()
  .avecIdentifiant(identifiantQuestionATiroir)
  .ajouteAction(actionRepondre)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle('QCM?')
          .avecDesReponses([
            uneReponsePossible().construis(),
            uneReponsePossible().avecLibelle('un seul choix').construis(),
            reponseAvecQuestionAChoixMultiple.construis(),
          ])
          .avecLaReponseDonnee(reponseAvecQuestionAChoixMultiple.construis(), [
            {
              identifiant: 'la-question',
              reponses: new Set(['choix-2', 'choix-4']),
            },
          ])
          .construis()
      )
      .construis()
  )
  .construis();

const identifiantQuestionATiroirAvecChoixUniqueEtChoixMultiple =
  'df11a788-7375-449d-844f-2b3298546d36';
const questionAChoixUnique = uneQuestionAChoixUnique()
  .avecLibelle('Réponse unique')
  .avecDesReponses([
    uneReponsePossible().avecLibelle('rep unique 1').construis(),
    uneReponsePossible().avecLibelle('rep unique 2').construis(),
    uneReponsePossible().avecLibelle('rep unique 3').construis(),
  ]);
const diagnosticAvecQuestionATiroirAvecChoixUniqueEtChoixMultiple =
  unDiagnostic()
    .ajouteAction(actionRepondre)
    .avecIdentifiant(identifiantQuestionATiroirAvecChoixUniqueEtChoixMultiple)
    .avecUnReferentiel(
      unReferentiel()
        .avecUneQuestion(
          uneQuestionAChoixUnique()
            .avecLibelle('Tiroir multiple et unique')
            .avecDesReponses([
              uneReponsePossible().avecLibelle('Non').construis(),
              reponseAvecQuestionAChoixMultiple
                .avecUneQuestion(questionAChoixUnique.construis())
                .construis(),
            ])
            .avecLaReponseDonnee(
              reponseAvecQuestionAChoixMultiple.construis(),
              [
                {
                  identifiant: 'la-question',
                  reponses: new Set(['choix-2', 'choix-4']),
                },
                {
                  identifiant: 'reponse-unique',
                  reponses: new Set(['rep-unique-2']),
                },
              ]
            )
            .construis()
        )
        .construis()
    )
    .construis();

const identifiantQuestionATiroirAvecPlusieursChoixUnique =
  '0170b46d-16d2-4ec4-88e0-85356914388a';
const premiereReponseAChoixUniqueATiroir = uneReponsePossible()
  .avecLibelle('Première réponse unique à tiroir')
  .avecUneQuestion(questionAChoixUnique.construis())
  .avecUneQuestion(
    uneQuestionAChoixUnique()
      .avecLibelle('Autre réponse unique')
      .avecDesReponses([
        uneReponsePossible().avecLibelle('1 - autre rep unique 1').construis(),
        uneReponsePossible().avecLibelle('1 - autre rep unique 2').construis(),
        uneReponsePossible().avecLibelle('1 - autre rep unique 3').construis(),
      ])
      .construis()
  )
  .construis();
const secondeReponseAChoixUniqueATiroir = uneReponsePossible()
  .avecLibelle('Seconde réponse unique à tiroir')
  .avecUneQuestion(
    uneQuestionAChoixUnique()
      .avecLibelle('2 - Réponse unique')
      .avecDesReponses([
        uneReponsePossible().avecLibelle('2 - rep unique 1').construis(),
        uneReponsePossible().avecLibelle('2 - rep unique 2').construis(),
        uneReponsePossible().avecLibelle('2 - rep unique 3').construis(),
      ])
      .construis()
  )
  .avecUneQuestion(
    uneQuestionAChoixUnique()
      .avecLibelle('2 - Autre réponse unique')
      .avecDesReponses([
        uneReponsePossible().avecLibelle('2 - autre rep unique 1').construis(),
        uneReponsePossible().avecLibelle('2 - autre rep unique 2').construis(),
        uneReponsePossible().avecLibelle('2 - autre rep unique 3').construis(),
      ])
      .construis()
  )
  .construis();
const diagnosticAvecUneQuestionAvecPlusieursQuestionsATiroirAChoixUnique =
  unDiagnostic()
    .avecIdentifiant(identifiantQuestionATiroirAvecPlusieursChoixUnique)
    .ajouteAction(actionRepondre)
    .avecUnReferentiel(
      unReferentiel()
        .avecUneQuestion(
          uneQuestionAChoixUnique()
            .avecLibelle('Une question à choix unique à tiroir')
            .avecDesReponses([
              premiereReponseAChoixUniqueATiroir,
              secondeReponseAChoixUniqueATiroir,
            ])
            .avecLaReponseDonnee(premiereReponseAChoixUniqueATiroir, [
              {
                identifiant: 'reponse-unique',
                reponses: new Set(['rep-unique-2']),
              },
              {
                identifiant: 'autre-reponse-unique',
                reponses: new Set(['1-autre-rep-unique-1']),
              },
            ])
            .construis()
        )
        .construis()
    )
    .construis();

const identifiantQuestionAPlusieursTiroirs =
  '7e37b7fa-1ed6-434d-ba5b-d473928c08c2';
const diagnosticAvecQuestionsAPlusieursTiroirs = unDiagnostic()
  .avecIdentifiant(identifiantQuestionAPlusieursTiroirs)
  .ajouteAction(actionRepondre)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle('QCM?')
          .avecDesReponses([
            uneReponsePossible().construis(),
            uneReponsePossible().avecLibelle('un seul choix').construis(),
            reponseAvecQuestionAChoixMultiple
              .avecLibelle('Plusieurs tiroirs')
              .avecUneQuestion(
                uneQuestionTiroirAChoixMultiple()
                  .avecLibelle('second tiroir')
                  .avecDesReponses([
                    uneReponsePossible().avecLibelle('tiroir 21').construis(),
                    uneReponsePossible().avecLibelle('tiroir 22').construis(),
                  ])
                  .construis()
              )
              .construis(),
          ])
          .avecLaReponseDonnee(reponseAvecQuestionAChoixMultiple.construis(), [
            {
              identifiant: 'la-question',
              reponses: new Set(['choix-2', 'choix-4']),
            },
            {
              identifiant: 'second-tiroir',
              reponses: new Set(['tiroir-21']),
            },
          ])
          .construis()
      )
      .construis()
  )
  .construis();

const identifiantQuestionATiroirAvecReponseUnique =
  'd01c0e69-7abd-46cf-a109-a38f8b1b26e0';
const diagnosticAvecQuestionsATiroirsAvecReponseUnique = unDiagnostic()
  .avecIdentifiant(identifiantQuestionATiroirAvecReponseUnique)
  .ajouteAction(actionRepondre)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle('QCM?')
          .avecDesReponses([
            uneReponsePossible().construis(),
            uneReponsePossible().avecLibelle('un seul choix').construis(),
            uneReponsePossible()
              .avecLibelle('Tiroir à choix unique ?')
              .avecUneQuestion(
                uneQuestionTiroirAChoixUnique()
                  .avecLibelle('Le choix unique ?')
                  .avecDesReponses([
                    uneReponsePossible().avecLibelle('choix 1').construis(),
                    uneReponsePossible().avecLibelle('choix 2').construis(),
                    uneReponsePossible().avecLibelle('choix 3').construis(),
                  ])
                  .construis()
              )
              .construis(),
          ])
          .avecLaReponseDonnee(reponseAvecQuestionAChoixMultiple.construis(), [
            {
              identifiant: 'le-choix-unique-',
              reponses: new Set(['choix-2']),
            },
          ])
          .construis()
      )
      .construis()
  )
  .construis();

const identifiantQuestionAChoixMultiple =
  '4196086c-d370-4406-a757-347d964a4e74';
const diagnosticAveUneQuestionAChoixMultiple = unDiagnostic()
  .avecIdentifiant(identifiantQuestionAChoixMultiple)
  .ajouteAction(actionRepondre)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestionAChoixMultiple()
          .avecLibelle('Question à choix multiple ?')
          .avecDesReponses([
            uneReponsePossible().avecLibelle('Réponse 1').construis(),
            uneReponsePossible().avecLibelle('Réponse 2').construis(),
            uneReponsePossible().avecLibelle('Réponse 3').construis(),
            uneReponsePossible().avecLibelle('Réponse 4').construis(),
          ])
          .avecUneReponseMultipleDonnee([
            uneReponsePossible().avecLibelle('Réponse 1').construis(),
          ])
          .construis()
      )
      .construis()
  )
  .construis();

const entrepotDiagnosticMemoire = new ServeurMACMemoire();
await entrepotDiagnosticMemoire.persiste(diagnosticAvecUneQuestionAChoixUnique);
await entrepotDiagnosticMemoire.persiste(
  diagnosticAvecQuestionSousFormeDeListeDeroulante
);
await entrepotDiagnosticMemoire.persiste(diagnosticAPlusieursThematiques);
await entrepotDiagnosticMemoire.persiste(diagnosticAvecQuestionATiroir);
await entrepotDiagnosticMemoire.persiste(
  diagnosticAvecQuestionATiroirAvecChoixUniqueEtChoixMultiple
);
await entrepotDiagnosticMemoire.persiste(
  diagnosticAvecUneQuestionAvecPlusieursQuestionsATiroirAChoixUnique
);
await entrepotDiagnosticMemoire.persiste(
  diagnosticAvecQuestionsAPlusieursTiroirs
);
await entrepotDiagnosticMemoire.persiste(
  diagnosticAvecQuestionsATiroirsAvecReponseUnique
);
await entrepotDiagnosticMemoire.persiste(
  diagnosticAveUneQuestionAChoixMultiple
);

const meta = {
  title: 'Diagnostic',
  component: ComposantDiagnostic,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => (
      <MemoryRouter>
        <ContexteMacAPI.Provider
          value={{
            appelle: async <T = Diagnostic, V = void>(
              parametresAPI: ParametresAPI<V>,
              _: (contenu: Promise<any>) => Promise<T>
            ) => {
              if (parametresAPI.methode === 'PATCH') {
                entrepotDiagnosticMemoire.envoieReponse(
                  parametresAPI as ParametresAPI<{
                    chemin: string;
                    identifiant: string;
                    reponse: string | string[] | ReponseQuestionATiroir | null;
                  }>
                );
              }
              const idDiagnostic = parametresAPI.url.split('/').at(-1);
              return entrepotDiagnosticMemoire.find(idDiagnostic as UUID) as T;
            },
          }}
        >
          <FournisseurNavigationMAC>
            <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
              {story()}
            </ErrorBoundary>
          </FournisseurNavigationMAC>
        </ContexteMacAPI.Provider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof ComposantDiagnostic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectionneReponseDiagnostic: Story = {
  name: 'Coche la réponse donnée',
  args: { idDiagnostic: identifiantQuestionAChoixUnique },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Lorsque le diagnostic est récupéré depuis l’API', async () => {
      expect(
        await waitFor(() =>
          canvas.getByText(
            `1. ${diagnosticAvecUneQuestionAChoixUnique.referentiel.contexte.groupes[0].questions[0].libelle}`
          )
        )
      ).toBeInTheDocument();
      expect(
        await waitFor(() =>
          canvas.getByRole('radio', { name: reponseDonneeChoixUnique.libelle })
        )
      ).toBeChecked();
    });

    await step('Lorsque l’utilisateur modifie la réponse', async () => {
      await userEvent.click(
        canvas.getByRole('radio', { name: /entreprise privée/i })
      );

      expect(
        canvas.getByRole('radio', { name: /entreprise privée/i })
      ).toBeChecked();
      entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
        reponseDonnee: 'entreprise-privee',
        identifiantQuestion: 'quelle-entreprise-etesvous-',
      });
    });
  },
};

export const SelectionneReponseDiagnosticDansUneListe: Story = {
  name: 'Sélectionne la réponse donnée dans la liste d’auto complétion',
  args: { idDiagnostic: identifiantQuestionListeDeroulante },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Lorsque le diagnostic est récupéré depuis l’API', async () => {
      expect(
        await waitFor(() =>
          canvas.getByText(
            `1. ${diagnosticAvecQuestionSousFormeDeListeDeroulante.referentiel.contexte.groupes[0].questions[0].libelle}`
          )
        )
      ).toBeInTheDocument();
      expect(await waitFor(() => canvas.getByRole('textbox'))).toHaveValue(
        reponseSelectionnee.libelle
      );
    });

    await step('Lorsque l’utilisateur modifie la réponse', async () => {
      const champSaisie = await waitFor(() => canvas.getByRole('textbox'));
      await waitFor(() => userEvent.clear(champSaisie));
      userEvent.type(champSaisie, 'Réponse C');

      await waitFor(() =>
        expect(canvas.getByRole('textbox')).toHaveValue('Réponse C')
      );
      entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
        reponseDonnee: 'reponse-c',
        identifiantQuestion: 'une-liste-deroulante',
      });
    });
  },
};

export const AfficheLesThematiques: Story = {
  name: 'Affiche les thématiques et peut interagir avec',
  args: { idDiagnostic: identifiantDiagnosticAvecPlusieursThematiques },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Lorsque le diagnostic est récupéré depuis l’API', async () => {
      expect(
        await waitFor(() =>
          canvas.getByText(
            `1. ${diagnosticAPlusieursThematiques.referentiel['contexte'].groupes[0].questions[0].libelle}`
          )
        )
      ).toBeInTheDocument();
      expect(await waitFor(() => canvas.getAllByRole('button').length)).toBe(5);
      await waitFor(() =>
        expect(
          canvas.queryByRole('button', { name: /thématique précédente/i })
        ).not.toBeInTheDocument()
      );
      expect(
        await waitFor(() =>
          canvas.getByRole('button', { name: /thématique suivante/i })
        )
      ).toBeInTheDocument();
    });

    await step('Lorsque l’utilisateur change de thématique', async () => {
      await userEvent.click(canvas.getAllByRole('button')[3]);

      expect(
        await waitFor(() =>
          canvas.getByText(
            `1. ${diagnosticAPlusieursThematiques.referentiel['Thème 1'].groupes[0].questions[0].libelle}`
          )
        )
      ).toBeInTheDocument();
      expect(
        await waitFor(() =>
          canvas.getByText(
            `2. ${diagnosticAPlusieursThematiques.referentiel['Thème 1'].groupes[1].questions[0].libelle}`
          )
        )
      ).toBeInTheDocument();

      expect(
        await waitFor(() =>
          canvas.getByRole('button', { name: /thématique précédente/i })
        )
      ).toBeInTheDocument();
      await waitFor(() =>
        expect(
          canvas.queryByRole('button', { name: /thématique suivante/i })
        ).not.toBeInTheDocument()
      );
    });
  },
};

export const SelectionneLesReponsesPourLesQuestionsATiroir: Story = {
  name: 'Sélectionne les réponses pour les questions à tiroir',
  args: { idDiagnostic: identifiantQuestionATiroir },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Lorsque le diagnostic est récupéré depuis l’API', async () => {
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /choix 2/i,
          })
        )
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /choix 4/i,
          })
        )
      ).toBeChecked();
    });

    await step('Lorsque l’utilisateur modifie la réponse', async () => {
      await userEvent.click(canvas.getByRole('checkbox', { name: /choix 3/i }));
      await userEvent.click(canvas.getByRole('checkbox', { name: /choix 4/i }));

      expect(
        canvas.getByRole('radio', { name: /plusieurs choix/i })
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /choix 2/i,
          })
        )
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /choix 3/i,
          })
        )
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /choix 4/i,
          })
        )
      ).not.toBeChecked();
      entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
        reponseDonnee: {
          reponse: 'plusieurs-choix',
          questions: [
            {
              identifiant: 'la-question',
              reponses: ['choix-2', 'choix-3'],
            },
          ],
        },
        identifiantQuestion: 'qcm',
      });
    });

    await step(
      "Lorsque l'utilisateur sélectionne une réponse à choix unique",
      async () => {
        await userEvent.click(
          canvas.getByRole('radio', { name: /un seul choix/i })
        );

        expect(
          await waitFor(() =>
            canvas.getByRole('radio', {
              name: /un seul choix/i,
            })
          )
        ).toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole('checkbox', {
              name: /choix 2/i,
            })
          )
        ).not.toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole('checkbox', {
              name: /choix 3/i,
            })
          )
        ).not.toBeChecked();
        entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
          reponseDonnee: 'un-seul-choix',
          identifiantQuestion: 'qcm',
        });
      }
    );
  },
};

export const SelectionneLesReponsesPourLesQuestionsAPlusieursTiroirs: Story = {
  name: 'Sélectionne les réponses pour les questions à plusieurs tiroirs',
  args: { idDiagnostic: identifiantQuestionAPlusieursTiroirs },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Lorsque le diagnostic est récupéré depuis l’API', async () => {
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /choix 2/i,
          })
        )
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /choix 4/i,
          })
        )
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /tiroir 21/i,
          })
        )
      ).toBeChecked();
    });

    await step('Lorsque l’utilisateur modifie la réponse', async () => {
      await userEvent.click(canvas.getByRole('checkbox', { name: /choix 3/i }));
      await userEvent.click(
        canvas.getByRole('checkbox', { name: /tiroir 22/i })
      );

      expect(
        canvas.getByRole('radio', { name: /plusieurs tiroirs/i })
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /choix 2/i,
          })
        )
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /choix 3/i,
          })
        )
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /choix 4/i,
          })
        )
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /tiroir 21/i,
          })
        )
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /tiroir 22/i,
          })
        )
      ).toBeChecked();
      entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
        reponseDonnee: {
          reponse: 'plusieurs-tiroirs',
          questions: [
            {
              identifiant: 'la-question',
              reponses: ['choix-2', 'choix-4', 'choix-3'],
            },
            {
              identifiant: 'second-tiroir',
              reponses: ['tiroir-21', 'tiroir-22'],
            },
          ],
        },
        identifiantQuestion: 'qcm',
      });
    });
  },
};

export const SelectionneLesReponsesPourLesQuestionsATiroirsAChoixMultipleEtAChoixUnique: Story =
  {
    name: 'Sélectionne les réponses pour les questions à tiroirs à choix multiple et à choix unique',
    args: {
      idDiagnostic: identifiantQuestionATiroirAvecChoixUniqueEtChoixMultiple,
    },
    play: async ({ canvasElement, step }) => {
      const canvas = within(canvasElement);

      await step(
        'Lorsque le diagnostic est récupéré depuis l’API',
        async () => {
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /plusieurs choix?/i,
              })
            )
          ).toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('checkbox', {
                name: /choix 2/i,
              })
            )
          ).toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('checkbox', {
                name: /choix 4/i,
              })
            )
          ).toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /rep unique 2/i,
              })
            )
          ).toBeChecked();
        }
      );

      await step('Lorsque l’utilisateur modifie la réponse', async () => {
        await userEvent.click(
          canvas.getByRole('radio', { name: /rep unique 1/i })
        );
        await userEvent.click(
          canvas.getByRole('checkbox', { name: /choix 3/i })
        );

        expect(
          await waitFor(() =>
            canvas.getByRole('radio', { name: /plusieurs choix?/i })
          )
        ).toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole('checkbox', {
              name: /choix 2/i,
            })
          )
        ).toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole('checkbox', {
              name: /choix 3/i,
            })
          )
        ).toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole('checkbox', {
              name: /choix 4/i,
            })
          )
        ).toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole('radio', {
              name: /rep unique 1/i,
            })
          )
        ).toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole('radio', {
              name: /rep unique 2/i,
            })
          )
        ).not.toBeChecked();
        entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
          reponseDonnee: {
            reponse: 'plusieurs-choix',
            questions: [
              {
                identifiant: 'la-question',
                reponses: ['choix-2', 'choix-4', 'choix-3'],
              },
              {
                identifiant: 'reponse-unique',
                reponses: ['rep-unique-1'],
              },
            ],
          },
          identifiantQuestion: 'tiroir-multiple-et-unique',
        });
      });

      await step(
        'Lorsque l\'utilisateur clique sur la réponse "Non" sans question tiroir',
        async () => {
          await userEvent.click(canvas.getByRole('radio', { name: /non/i }));

          expect(
            await waitFor(() =>
              canvas.getByRole('radio', { name: /plusieurs choix?/i })
            )
          ).not.toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('checkbox', {
                name: /choix 1/i,
              })
            )
          ).not.toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('checkbox', {
                name: /choix 2/i,
              })
            )
          ).not.toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('checkbox', {
                name: /choix 3/i,
              })
            )
          ).not.toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('checkbox', {
                name: /choix 4/i,
              })
            )
          ).not.toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /rep unique 1/i,
              })
            )
          ).not.toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /rep unique 2/i,
              })
            )
          ).not.toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /rep unique 3/i,
              })
            )
          ).not.toBeChecked();
          entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
            reponseDonnee: 'non',
            identifiantQuestion: 'tiroir-multiple-et-unique',
          });
        }
      );
    },
  };

export const SelectionneLesReponsesPourLesQuestionsAPlusieursTiroirsAChoixUnique: Story =
  {
    name: 'Sélectionne les réponses pour les questions à plusieurs tiroirs à choix unique',
    args: {
      idDiagnostic: identifiantQuestionATiroirAvecPlusieursChoixUnique,
    },
    play: async ({ canvasElement, step }) => {
      const canvas = within(canvasElement);

      await step(
        'Lorsque le diagnostic est récupéré depuis l’API',
        async () => {
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /première réponse unique à tiroir/i,
              })
            )
          ).toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: 'rep unique 2',
              })
            )
          ).toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /1 - autre rep unique 1/i,
              })
            )
          ).toBeChecked();
        }
      );

      await step('Lorsque l’utilisateur modifie la réponse', async () => {
        await userEvent.click(
          canvas.getByRole('radio', { name: /1 - autre rep unique 2/i })
        );

        expect(
          await waitFor(() =>
            canvas.getByRole('radio', {
              name: /première réponse unique à tiroir/i,
            })
          )
        ).toBeChecked();
        entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
          reponseDonnee: {
            reponse: 'premiere-reponse-unique-a-tiroir',
            questions: [
              {
                identifiant: 'reponse-unique',
                reponses: ['rep-unique-2'],
              },
              {
                identifiant: 'autre-reponse-unique',
                reponses: ['1-autre-rep-unique-2'],
              },
            ],
          },
          identifiantQuestion: 'une-question-a-choix-unique-a-tiroir',
        });
      });

      await step(
        "Lorsque l'utilisateur clique sur une autre réponse avec question tiroir",
        async () => {
          await userEvent.click(
            canvas.getByRole('radio', {
              name: /seconde réponse unique à tiroir/i,
            })
          );
          await userEvent.click(
            canvas.getByRole('radio', { name: /2 - rep unique 3/i })
          );
          await userEvent.click(
            canvas.getByRole('radio', { name: /2 - autre rep unique 1/i })
          );

          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /première réponse unique à tiroir/i,
              })
            )
          ).not.toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: 'rep unique 2',
              })
            )
          ).not.toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /1 - autre rep unique 2/i,
              })
            )
          ).not.toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /seconde réponse unique à tiroir/i,
              })
            )
          ).toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /2 - rep unique 3/i,
              })
            )
          ).toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /2 - autre rep unique 1/i,
              })
            )
          ).toBeChecked();
          entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
            reponseDonnee: {
              reponse: 'seconde-reponse-unique-a-tiroir',
              questions: [
                {
                  identifiant: '2-reponse-unique',
                  reponses: ['2-rep-unique-3'],
                },
                {
                  identifiant: '2-autre-reponse-unique',
                  reponses: ['2-autre-rep-unique-1'],
                },
              ],
            },
            identifiantQuestion: 'une-question-a-choix-unique-a-tiroir',
          });
        }
      );
    },
  };

export const SelectionneLaReponsePourLaQuestionsATiroirAvecReponseUnique: Story =
  {
    name: 'Sélectionne la réponse pour la question à tiroir avec une réponse unique',
    args: { idDiagnostic: identifiantQuestionATiroirAvecReponseUnique },
    play: async ({ canvasElement, step }) => {
      const canvas = within(canvasElement);

      await step(
        'Lorsque le diagnostic est récupéré depuis l’API',
        async () => {
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /choix 1/i,
              })
            )
          ).not.toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /choix 2/i,
              })
            )
          ).toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole('radio', {
                name: /choix 3/i,
              })
            )
          ).not.toBeChecked();
        }
      );

      await step('Lorsque l’utilisateur modifie la réponse', async () => {
        await userEvent.click(canvas.getByRole('radio', { name: /choix 3/i }));

        expect(
          canvas.getByRole('radio', { name: /tiroir à choix unique ?/i })
        ).toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole('radio', {
              name: /choix 1/i,
            })
          )
        ).not.toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole('radio', {
              name: /choix 2/i,
            })
          )
        ).not.toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole('radio', {
              name: /choix 3/i,
            })
          )
        ).toBeChecked();
        entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
          reponseDonnee: {
            reponse: 'tiroir-a-choix-unique-',
            questions: [
              {
                identifiant: 'le-choix-unique-',
                reponses: ['choix-3'],
              },
            ],
          },
          identifiantQuestion: 'qcm',
        });
      });
    },
  };

export const SelectionneLaReponsePourUneQuestionAChoixMultiple: Story = {
  name: 'Sélectionne la réponse pour une question à choix multiple',
  args: { idDiagnostic: identifiantQuestionAChoixMultiple },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Lorsque le diagnostic est récupéré depuis l’API', async () => {
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /réponse 1/i,
          })
        )
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /réponse 2/i,
          })
        )
      ).not.toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /réponse 3/i,
          })
        )
      ).not.toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /réponse 4/i,
          })
        )
      ).not.toBeChecked();
    });

    await step('Lorsque l’utilisateur modifie la réponse', async () => {
      await userEvent.click(
        canvas.getByRole('checkbox', { name: /réponse 3/i })
      );

      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /réponse 1/i,
          })
        )
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /réponse 2/i,
          })
        )
      ).not.toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /réponse 3/i,
          })
        )
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole('checkbox', {
            name: /réponse 4/i,
          })
        )
      ).not.toBeChecked();
      entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
        reponseDonnee: ['reponse-1', 'reponse-3'],
        identifiantQuestion: 'question-a-choix-multiple-',
      });
    });
  },
};
