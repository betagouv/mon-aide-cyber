import { Meta, StoryObj } from '@storybook/react-vite';
import { unDiagnostic } from '../../test/constructeurs/constructeurDiagnostic.ts';
import { expect, waitFor, within } from 'storybook/test';
import {
  uneQuestionAChoixMultiple,
  uneQuestionAChoixUnique,
  uneQuestionTiroirAChoixMultiple,
  uneQuestionTiroirAChoixUnique,
} from '../../test/constructeurs/constructeurQuestions.ts';
import { uneReponsePossible } from '../../test/constructeurs/constructeurReponsePossible.ts';
import { unReferentiel } from '../../test/constructeurs/constructeurReferentiel.ts';
import { ReponseQuestionATiroir } from '../domaine/diagnostic/Diagnostic.ts';
import { UUID } from '../types/Types.ts';
import { ServeurMACMemoire, unLienHATEOAS } from './ServeurMACMemoire.ts';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { decorateurComposantDiagnostic } from './DecorateurComposantDiagnostic.tsx';
import {
  ActionsHeaderDiagnosticAidant,
  EcranDiagnostic,
} from '../composants/diagnostic/EcranDiagnosticAidant.tsx';
import { HeaderDiagnostic } from '../composants/diagnostic/HeaderDiagnostic.tsx';

const identifiantQuestionAChoixUnique = '6dadad14-8fa0-4be7-a8da-473d538eb6c1';
const reponseDonneeChoixUnique = uneReponsePossible().construis();
const diagnosticAvecUneQuestionAChoixUnique = unDiagnostic()
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

const macAPIMemoire = {
  execute: async <T, U, V = void>(
    parametresAPI: ParametresAPI<V>,
    __transcris: (contenu: Promise<U>) => Promise<T>
  ) => {
    if (parametresAPI.methode === 'PATCH') {
      await entrepotDiagnosticMemoire.envoieReponse(
        parametresAPI as ParametresAPI<{
          chemin: string;
          identifiant: string;
          reponse: string | string[] | ReponseQuestionATiroir | null;
        }>
      );
    }
    const idDiagnostic = parametresAPI.url.split('/').at(-1);
    return Promise.resolve(
      entrepotDiagnosticMemoire.find(idDiagnostic as UUID) as T
    );
  },
};

const meta = {
  title: 'Diagnostic',
  component: EcranDiagnostic,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof EcranDiagnostic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectionneReponseDiagnostic: Story = {
  name: 'Coche la réponse donnée',
  args: {
    idDiagnostic: identifiantQuestionAChoixUnique,
    macAPI: macAPIMemoire,
    header: (
      <HeaderDiagnostic
        actions={
          <ActionsHeaderDiagnosticAidant
            idDiagnostic={identifiantQuestionAChoixUnique}
          />
        }
      />
    ),
    accedeALaRestitution: () => null,
  },
  decorators: [
    (story) =>
      decorateurComposantDiagnostic(story, identifiantQuestionAChoixUnique),
  ],
  play: async ({ canvasElement, step, userEvent }) => {
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
      entrepotDiagnosticMemoire.verifieEnvoiReponse(
        unLienHATEOAS()
          .repondreDiagnostic(identifiantQuestionAChoixUnique)
          .construis(),
        {
          reponseDonnee: 'entreprise-privee',
          identifiantQuestion: 'quelle-entreprise-etesvous-',
        }
      );
    });
  },
};

export const SelectionneReponseDiagnosticDansUneListe: Story = {
  name: 'Sélectionne la réponse donnée dans la liste d’auto complétion',
  args: {
    idDiagnostic: identifiantQuestionListeDeroulante,
    macAPI: macAPIMemoire,
    header: (
      <HeaderDiagnostic
        actions={
          <ActionsHeaderDiagnosticAidant
            idDiagnostic={identifiantQuestionListeDeroulante}
          />
        }
      />
    ),
    accedeALaRestitution: () => null,
  },
  decorators: [
    (story) =>
      decorateurComposantDiagnostic(story, identifiantQuestionListeDeroulante),
  ],
  play: async ({ canvasElement, step, userEvent }) => {
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
      entrepotDiagnosticMemoire.verifieEnvoiReponse(
        unLienHATEOAS()
          .repondreDiagnostic(identifiantQuestionListeDeroulante)
          .construis(),
        {
          reponseDonnee: 'reponse-c',
          identifiantQuestion: 'une-liste-deroulante',
        }
      );
    });
  },
};

export const AfficheLesThematiques: Story = {
  name: 'Affiche les thématiques et peut interagir avec',
  args: {
    idDiagnostic: identifiantDiagnosticAvecPlusieursThematiques,
    macAPI: macAPIMemoire,
    header: (
      <HeaderDiagnostic
        actions={
          <ActionsHeaderDiagnosticAidant
            idDiagnostic={identifiantDiagnosticAvecPlusieursThematiques}
          />
        }
      />
    ),
    accedeALaRestitution: () => null,
  },
  decorators: [
    (story) =>
      decorateurComposantDiagnostic(
        story,
        identifiantDiagnosticAvecPlusieursThematiques
      ),
  ],
  play: async ({ canvasElement, step, userEvent }) => {
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
  args: {
    idDiagnostic: identifiantQuestionATiroir,
    macAPI: macAPIMemoire,
    header: (
      <HeaderDiagnostic
        actions={
          <ActionsHeaderDiagnosticAidant
            idDiagnostic={identifiantQuestionATiroir}
          />
        }
      />
    ),
    accedeALaRestitution: () => null,
  },
  decorators: [
    (story) => decorateurComposantDiagnostic(story, identifiantQuestionATiroir),
  ],
  play: async ({ canvasElement, step, userEvent }) => {
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

      await waitFor(() => {
        expect(
          canvas.getByRole('radio', { name: /plusieurs choix/i })
        ).toBeChecked();
        expect(
          canvas.getByRole('checkbox', { name: /choix 2/i })
        ).toBeChecked();
        expect(
          canvas.getByRole('checkbox', { name: /choix 3/i })
        ).toBeChecked();
        expect(
          canvas.getByRole('checkbox', { name: /choix 4/i })
        ).not.toBeChecked();
      });

      entrepotDiagnosticMemoire.verifieEnvoiReponse(
        unLienHATEOAS()
          .repondreDiagnostic(identifiantQuestionATiroir)
          .construis(),
        {
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
        }
      );
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
        entrepotDiagnosticMemoire.verifieEnvoiReponse(
          unLienHATEOAS()
            .repondreDiagnostic(identifiantQuestionATiroir)
            .construis(),
          {
            reponseDonnee: 'un-seul-choix',
            identifiantQuestion: 'qcm',
          }
        );
      }
    );
  },
};

export const SelectionneLesReponsesPourLesQuestionsAPlusieursTiroirs: Story = {
  name: 'Sélectionne les réponses pour les questions à plusieurs tiroirs',
  args: {
    idDiagnostic: identifiantQuestionAPlusieursTiroirs,
    macAPI: macAPIMemoire,
    header: (
      <HeaderDiagnostic
        actions={
          <ActionsHeaderDiagnosticAidant
            idDiagnostic={identifiantQuestionAPlusieursTiroirs}
          />
        }
      />
    ),
    accedeALaRestitution: () => null,
  },
  decorators: [
    (story) =>
      decorateurComposantDiagnostic(
        story,
        identifiantQuestionAPlusieursTiroirs
      ),
  ],
  play: async ({ canvasElement, step, userEvent }) => {
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

      await waitFor(() => {
        expect(
          canvas.getByRole('radio', { name: /plusieurs tiroirs/i })
        ).toBeChecked();
        expect(
          canvas.getByRole('checkbox', { name: /choix 2/i })
        ).toBeChecked();
        expect(
          canvas.getByRole('checkbox', { name: /choix 3/i })
        ).toBeChecked();
        expect(
          canvas.getByRole('checkbox', { name: /choix 4/i })
        ).toBeChecked();
        expect(
          canvas.getByRole('checkbox', { name: /tiroir 21/i })
        ).toBeChecked();
        expect(
          canvas.getByRole('checkbox', { name: /tiroir 22/i })
        ).toBeChecked();
      });

      entrepotDiagnosticMemoire.verifieEnvoiReponse(
        unLienHATEOAS()
          .repondreDiagnostic(identifiantQuestionAPlusieursTiroirs)
          .construis(),
        {
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
        }
      );
    });
  },
};

export const SelectionneLesReponsesPourLesQuestionsATiroirsAChoixMultipleEtAChoixUnique: Story =
  {
    name: 'Sélectionne les réponses pour les questions à tiroirs à choix multiple et à choix unique',
    args: {
      idDiagnostic: identifiantQuestionATiroirAvecChoixUniqueEtChoixMultiple,
      macAPI: macAPIMemoire,
      header: (
        <HeaderDiagnostic
          actions={
            <ActionsHeaderDiagnosticAidant
              idDiagnostic={
                identifiantQuestionATiroirAvecChoixUniqueEtChoixMultiple
              }
            />
          }
        />
      ),
      accedeALaRestitution: () => null,
    },
    decorators: [
      (story) =>
        decorateurComposantDiagnostic(
          story,
          identifiantQuestionATiroirAvecChoixUniqueEtChoixMultiple
        ),
    ],
    play: async ({ canvasElement, step, userEvent }) => {
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

        await waitFor(() => {
          expect(
            canvas.getByRole('radio', { name: /plusieurs choix?/i })
          ).toBeChecked();
          expect(
            canvas.getByRole('checkbox', { name: /choix 2/i })
          ).toBeChecked();
          expect(
            canvas.getByRole('checkbox', { name: /choix 3/i })
          ).toBeChecked();
          expect(
            canvas.getByRole('checkbox', { name: /choix 4/i })
          ).toBeChecked();
          expect(
            canvas.getByRole('radio', { name: /rep unique 1/i })
          ).toBeChecked();
          expect(
            canvas.getByRole('radio', { name: /rep unique 2/i })
          ).not.toBeChecked();
        });
        entrepotDiagnosticMemoire.verifieEnvoiReponse(
          unLienHATEOAS()
            .repondreDiagnostic(
              identifiantQuestionATiroirAvecChoixUniqueEtChoixMultiple
            )
            .construis(),
          {
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
          }
        );
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
          entrepotDiagnosticMemoire.verifieEnvoiReponse(
            unLienHATEOAS()
              .repondreDiagnostic(
                identifiantQuestionATiroirAvecChoixUniqueEtChoixMultiple
              )
              .construis(),
            {
              reponseDonnee: 'non',
              identifiantQuestion: 'tiroir-multiple-et-unique',
            }
          );
        }
      );
    },
  };

export const SelectionneLesReponsesPourLesQuestionsAPlusieursTiroirsAChoixUnique: Story =
  {
    name: 'Sélectionne les réponses pour les questions à plusieurs tiroirs à choix unique',
    args: {
      idDiagnostic: identifiantQuestionATiroirAvecPlusieursChoixUnique,
      macAPI: macAPIMemoire,
      header: (
        <HeaderDiagnostic
          actions={
            <ActionsHeaderDiagnosticAidant
              idDiagnostic={identifiantQuestionATiroirAvecPlusieursChoixUnique}
            />
          }
        />
      ),
      accedeALaRestitution: () => null,
    },
    decorators: [
      (story) =>
        decorateurComposantDiagnostic(
          story,
          identifiantQuestionATiroirAvecPlusieursChoixUnique
        ),
    ],
    play: async ({ canvasElement, step, userEvent }) => {
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
        entrepotDiagnosticMemoire.verifieEnvoiReponse(
          unLienHATEOAS()
            .repondreDiagnostic(
              identifiantQuestionATiroirAvecPlusieursChoixUnique
            )
            .construis(),
          {
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
          }
        );
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
          entrepotDiagnosticMemoire.verifieEnvoiReponse(
            unLienHATEOAS()
              .repondreDiagnostic(
                identifiantQuestionATiroirAvecPlusieursChoixUnique
              )
              .construis(),
            {
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
            }
          );
        }
      );
    },
  };

export const SelectionneLaReponsePourLaQuestionsATiroirAvecReponseUnique: Story =
  {
    name: 'Sélectionne la réponse pour la question à tiroir avec une réponse unique',
    args: {
      idDiagnostic: identifiantQuestionATiroirAvecReponseUnique,
      macAPI: macAPIMemoire,
      header: (
        <HeaderDiagnostic
          actions={
            <ActionsHeaderDiagnosticAidant
              idDiagnostic={identifiantQuestionATiroirAvecReponseUnique}
            />
          }
        />
      ),
      accedeALaRestitution: () => null,
    },
    decorators: [
      (story) =>
        decorateurComposantDiagnostic(
          story,
          identifiantQuestionATiroirAvecReponseUnique
        ),
    ],
    play: async ({ canvasElement, step, userEvent }) => {
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

        await waitFor(() => {
          expect(
            canvas.getByRole('radio', { name: /tiroir à choix unique ?/i })
          ).toBeChecked();
          expect(
            canvas.getByRole('radio', { name: /choix 1/i })
          ).not.toBeChecked();
          expect(
            canvas.getByRole('radio', { name: /choix 2/i })
          ).not.toBeChecked();
          expect(canvas.getByRole('radio', { name: /choix 3/i })).toBeChecked();
        });
        entrepotDiagnosticMemoire.verifieEnvoiReponse(
          unLienHATEOAS()
            .repondreDiagnostic(identifiantQuestionATiroirAvecReponseUnique)
            .construis(),
          {
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
          }
        );
      });
    },
  };

export const SelectionneLaReponsePourUneQuestionAChoixMultiple: Story = {
  name: 'Sélectionne la réponse pour une question à choix multiple',
  args: {
    idDiagnostic: identifiantQuestionAChoixMultiple,
    macAPI: macAPIMemoire,
    header: (
      <HeaderDiagnostic
        actions={
          <ActionsHeaderDiagnosticAidant
            idDiagnostic={identifiantQuestionAChoixMultiple}
          />
        }
      />
    ),
    accedeALaRestitution: () => null,
  },
  decorators: [
    (story) =>
      decorateurComposantDiagnostic(story, identifiantQuestionAChoixMultiple),
  ],
  play: async ({ canvasElement, step, userEvent }) => {
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
      entrepotDiagnosticMemoire.verifieEnvoiReponse(
        unLienHATEOAS()
          .repondreDiagnostic(identifiantQuestionAChoixMultiple)
          .construis(),
        {
          reponseDonnee: ['reponse-1', 'reponse-3'],
          identifiantQuestion: 'question-a-choix-multiple-',
        }
      );
    });
  },
};
