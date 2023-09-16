import { Meta, StoryObj } from "@storybook/react";
import { FournisseurEntrepots } from "../fournisseurs/FournisseurEntrepot.ts";
import { unDiagnostic } from "../../test/constructeurs/constructeurDiagnostic.ts";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import {
  EntrepotDiagnosticMemoire,
  EntrepotDiagnosticsMemoire,
} from "../../test/infrastructure/entrepots/EntrepotsMemoire.ts";
import {
  uneQuestionAChoixMultiple,
  uneQuestionAChoixUnique,
  uneQuestionTiroirAChoixMultiple,
  uneQuestionTiroirAChoixUnique,
} from "../../test/constructeurs/constructeurQuestions.ts";
import { uneReponsePossible } from "../../test/constructeurs/constructeurReponsePossible.ts";
import { ComposantAffichageErreur } from "../composants/erreurs/ComposantAffichageErreur.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { unReferentiel } from "../../test/constructeurs/constructeurReferentiel.ts";
import { ComposantDiagnostic } from "../composants/diagnostic/ComposantDiagnostic.tsx";
import { EntrepotDiagnostics } from "../domaine/diagnostic/Diagnostics.ts";
import { uneAction } from "../../test/constructeurs/constructeurActionDiagnostic.ts";

const entrepotDiagnosticMemoire = new EntrepotDiagnosticMemoire();
const actionRepondre = uneAction().contexte().construis();

const identifiantQuestionAChoixUnique = "6dadad14-8fa0-4be7-a8da-473d538eb6c1";
const reponseDonneeChoixUnique = uneReponsePossible().construis();
const diagnosticAvecUneQuestionAChoixUnique = unDiagnostic()
  .avecIdentifiant(identifiantQuestionAChoixUnique)
  .avecUnReferentiel(
    unReferentiel()
      .sansAction()
      .ajouteAction(actionRepondre)
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle("Quelle entreprise êtes-vous ?")
          .avecDesReponses([
            uneReponsePossible().avecLibelle("Entreprise privée").construis(),
            reponseDonneeChoixUnique,
            uneReponsePossible().construis(),
          ])
          .avecLaReponseDonnee(reponseDonneeChoixUnique)
          .construis(),
      )
      .construis(),
  )
  .construis();

const identifiantQuestionListeDeroulante =
  "1cdaac38-2ee8-413d-ac00-00f8b5fbad10";
const reponseSelectionnee = uneReponsePossible()
  .avecLibelle("Réponse B")
  .construis();
const diagnosticAvecQuestionSousFormeDeListeDeroulante = unDiagnostic()
  .avecIdentifiant(identifiantQuestionListeDeroulante)
  .avecUnReferentiel(
    unReferentiel()
      .sansAction()
      .ajouteAction(actionRepondre)
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle("Une liste déroulante?")
          .sousFormeDeListe()
          .avecDesReponses([
            uneReponsePossible().avecLibelle("Réponse A").construis(),
            reponseSelectionnee,
            uneReponsePossible().avecLibelle("Réponse C").construis(),
          ])
          .avecLaReponseDonnee(reponseSelectionnee)
          .construis(),
      )
      .construis(),
  )
  .construis();

const identifiantDiagnosticAvecPlusieursThematiques =
  "aa1a75a3-8896-4ab2-81e3-24a773ec994e";
const diagnosticAPlusieursThematiques = unDiagnostic()
  .avecIdentifiant(identifiantDiagnosticAvecPlusieursThematiques)
  .avecUnReferentiel(
    unReferentiel()
      .ajouteUneThematique("Thème 1", [
        uneQuestionAChoixUnique().construis(),
        uneQuestionAChoixUnique().construis(),
      ])
      .avecUneQuestion(uneQuestionAChoixUnique().construis())
      .construis(),
  )
  .construis();

const identifiantQuestionATiroir = "4a0242d6-26c0-459b-85bd-bf2ce9962c9b";
const reponseAvecQuestionAChoixMultiple = uneReponsePossible()
  .avecLibelle("Plusieurs choix?")
  .avecUneQuestion(
    uneQuestionTiroirAChoixMultiple()
      .avecLibelle("La question?")
      .avecDesReponses([
        uneReponsePossible().avecLibelle("choix 1").construis(),
        uneReponsePossible().avecLibelle("choix 2").construis(),
        uneReponsePossible().avecLibelle("choix 3").construis(),
        uneReponsePossible().avecLibelle("choix 4").construis(),
      ])
      .construis(),
  )
  .construis();
const diagnosticAvecQuestionATiroir = unDiagnostic()
  .avecIdentifiant(identifiantQuestionATiroir)
  .avecUnReferentiel(
    unReferentiel()
      .sansAction()
      .ajouteAction(actionRepondre)
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle("QCM?")
          .avecDesReponses([
            uneReponsePossible().construis(),
            uneReponsePossible().avecLibelle("un seul choix").construis(),
            reponseAvecQuestionAChoixMultiple,
          ])
          .avecLaReponseDonnee(reponseAvecQuestionAChoixMultiple, [
            {
              identifiant: "la-question",
              reponses: new Set(["choix-2", "choix-4"]),
            },
          ])
          .construis(),
      )
      .construis(),
  )
  .construis();

const identifiantQuestionAPlusieursTiroirs =
  "7e37b7fa-1ed6-434d-ba5b-d473928c08c2";
const diagnosticAvecQuestionsAPlusieursTiroirs = unDiagnostic()
  .avecIdentifiant(identifiantQuestionAPlusieursTiroirs)
  .avecUnReferentiel(
    unReferentiel()
      .sansAction()
      .ajouteAction(actionRepondre)
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle("QCM?")
          .avecDesReponses([
            uneReponsePossible().construis(),
            uneReponsePossible().avecLibelle("un seul choix").construis(),
            uneReponsePossible()
              .avecLibelle("Plusieurs tiroirs")
              .avecUneQuestion(
                uneQuestionTiroirAChoixMultiple()
                  .avecLibelle("La question?")
                  .avecDesReponses([
                    uneReponsePossible().avecLibelle("choix 1").construis(),
                    uneReponsePossible().avecLibelle("choix 2").construis(),
                    uneReponsePossible().avecLibelle("choix 3").construis(),
                    uneReponsePossible().avecLibelle("choix 4").construis(),
                  ])
                  .construis(),
              )
              .avecUneQuestion(
                uneQuestionTiroirAChoixMultiple()
                  .avecLibelle("second tiroir")
                  .avecDesReponses([
                    uneReponsePossible().avecLibelle("tiroir 21").construis(),
                    uneReponsePossible().avecLibelle("tiroir 22").construis(),
                  ])
                  .construis(),
              )

              .construis(),
          ])
          .avecLaReponseDonnee(reponseAvecQuestionAChoixMultiple, [
            {
              identifiant: "la-question",
              reponses: new Set(["choix-2", "choix-4"]),
            },
            {
              identifiant: "second-tiroir",
              reponses: new Set(["tiroir-21"]),
            },
          ])
          .construis(),
      )
      .construis(),
  )
  .construis();

const identifiantQuestionATiroirAvecReponseUnique =
  "d01c0e69-7abd-46cf-a109-a38f8b1b26e0";
const diagnosticAvecQuestionsATiroirsAvecReponseUnique = unDiagnostic()
  .avecIdentifiant(identifiantQuestionATiroirAvecReponseUnique)
  .avecUnReferentiel(
    unReferentiel()
      .sansAction()
      .ajouteAction(actionRepondre)
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle("QCM?")
          .avecDesReponses([
            uneReponsePossible().construis(),
            uneReponsePossible().avecLibelle("un seul choix").construis(),
            uneReponsePossible()
              .avecLibelle("Tiroir à choix unique ?")
              .avecUneQuestion(
                uneQuestionTiroirAChoixUnique()
                  .avecLibelle("Le choix unique ?")
                  .avecDesReponses([
                    uneReponsePossible().avecLibelle("choix 1").construis(),
                    uneReponsePossible().avecLibelle("choix 2").construis(),
                    uneReponsePossible().avecLibelle("choix 3").construis(),
                  ])
                  .construis(),
              )
              .construis(),
          ])
          .avecLaReponseDonnee(reponseAvecQuestionAChoixMultiple, [
            {
              identifiant: "le-choix-unique-",
              reponses: new Set(["choix-2"]),
            },
          ])
          .construis(),
      )
      .construis(),
  )
  .construis();

const identifiantQuestionAChoixMultiple =
  "4196086c-d370-4406-a757-347d964a4e74";
const diagnosticAveUneQuestionAChoixMultiple = unDiagnostic()
  .avecIdentifiant(identifiantQuestionAChoixMultiple)
  .avecUnReferentiel(
    unReferentiel()
      .sansAction()
      .ajouteAction(actionRepondre)
      .avecUneQuestion(
        uneQuestionAChoixMultiple()
          .avecLibelle("Question à choix multiple ?")
          .avecDesReponses([
            uneReponsePossible().avecLibelle("Réponse 1").construis(),
            uneReponsePossible().avecLibelle("Réponse 2").construis(),
            uneReponsePossible().avecLibelle("Réponse 3").construis(),
            uneReponsePossible().avecLibelle("Réponse 4").construis(),
          ])
          .avecUneReponseMultipleDonnee([
            uneReponsePossible().avecLibelle("Réponse 1").construis(),
          ])
          .construis(),
      )
      .construis(),
  )
  .construis();

await entrepotDiagnosticMemoire.persiste(diagnosticAvecUneQuestionAChoixUnique);
await entrepotDiagnosticMemoire.persiste(
  diagnosticAvecQuestionSousFormeDeListeDeroulante,
);
await entrepotDiagnosticMemoire.persiste(diagnosticAPlusieursThematiques);
await entrepotDiagnosticMemoire.persiste(diagnosticAvecQuestionATiroir);
await entrepotDiagnosticMemoire.persiste(
  diagnosticAvecQuestionsAPlusieursTiroirs,
);
await entrepotDiagnosticMemoire.persiste(
  diagnosticAvecQuestionsATiroirsAvecReponseUnique,
);
await entrepotDiagnosticMemoire.persiste(
  diagnosticAveUneQuestionAChoixMultiple,
);

const meta = {
  title: "Diagnostic",
  component: ComposantDiagnostic,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) => (
      <FournisseurEntrepots.Provider
        value={{
          diagnostic: () => entrepotDiagnosticMemoire,
          diagnostics: (): EntrepotDiagnostics =>
            new EntrepotDiagnosticsMemoire(),
        }}
      >
        <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
          {story()}
        </ErrorBoundary>
      </FournisseurEntrepots.Provider>
    ),
  ],
} satisfies Meta<typeof ComposantDiagnostic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectionneReponseDiagnostic: Story = {
  name: "Coche la réponse donnée",
  args: { idDiagnostic: identifiantQuestionAChoixUnique },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Lorsque le diagnostic est récupéré depuis l’API", async () => {
      expect(
        await waitFor(() =>
          canvas.getByText(
            diagnosticAvecUneQuestionAChoixUnique.referentiel.contexte
              .questions[0].libelle,
          ),
        ),
      ).toBeInTheDocument();
      expect(
        await waitFor(() =>
          canvas.getByRole("radio", { name: reponseDonneeChoixUnique.libelle }),
        ),
      ).toBeChecked();
    });

    await step("Lorsque l’utilisateur modifie la réponse", async () => {
      await userEvent.click(
        canvas.getByRole("radio", { name: /entreprise privée/i }),
      );

      expect(
        canvas.getByRole("radio", { name: /entreprise privée/i }),
      ).toBeChecked();
      entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
        reponseDonnee: "entreprise-privee",
        identifiantQuestion: "quelle-entreprise-etesvous-",
      });
    });
  },
};

export const SelectionneReponseDiagnosticDansUneListe: Story = {
  name: "Sélectionne la réponse donnée dans la liste",
  args: { idDiagnostic: identifiantQuestionListeDeroulante },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Lorsque le diagnostic est récupéré depuis l’API", async () => {
      expect(
        await waitFor(() =>
          canvas.getByText(
            diagnosticAvecQuestionSousFormeDeListeDeroulante.referentiel
              .contexte.questions[0].libelle,
          ),
        ),
      ).toBeInTheDocument();
      expect(
        await waitFor(() =>
          canvas.getByRole("option", {
            name: reponseSelectionnee.libelle,
            selected: true,
          }),
        ),
      ).toBeInTheDocument();
    });

    await step("Lorsque l’utilisateur modifie la réponse", async () => {
      await userEvent.selectOptions(canvas.getByRole("listbox"), "Réponse C");

      expect(
        await waitFor(() =>
          canvas.getByRole("option", { name: /réponse c/i, selected: true }),
        ),
      ).toBeInTheDocument();
      entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
        reponseDonnee: "reponse-c",
        identifiantQuestion: "une-liste-deroulante",
      });
    });
  },
};

export const AfficheLesThematiques: Story = {
  name: "Affiche les thématiques et peut interagir avec",
  args: { idDiagnostic: identifiantDiagnosticAvecPlusieursThematiques },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Lorsque le diagnostic est récupéré depuis l’API", async () => {
      expect(
        await waitFor(() =>
          canvas.getByText(
            diagnosticAPlusieursThematiques.referentiel["contexte"].questions[0]
              .libelle,
          ),
        ),
      ).toBeInTheDocument();
      expect(
        await waitFor(() =>
          canvas.getByRole("button", {
            name: /c/i,
          }),
        ),
      ).toBeInTheDocument();
      expect(
        await waitFor(() =>
          canvas.getByRole("button", {
            name: /t/i,
          }),
        ),
      ).toBeInTheDocument();
    });

    await step("Lorsque l’utilisateur change de thématique", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /t/i }));

      expect(
        await waitFor(() =>
          canvas.getByText(
            diagnosticAPlusieursThematiques.referentiel["Thème 1"].questions[0]
              .libelle,
          ),
        ),
      ).toBeInTheDocument();
      expect(
        await waitFor(() =>
          canvas.getByText(
            diagnosticAPlusieursThematiques.referentiel["Thème 1"].questions[1]
              .libelle,
          ),
        ),
      ).toBeInTheDocument();
    });
  },
};

export const SelectionneLesReponsesPourLesQuestionsATiroir: Story = {
  name: "Sélectionne les réponses pour les questions à tiroir",
  args: { idDiagnostic: identifiantQuestionATiroir },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Lorsque le diagnostic est récupéré depuis l’API", async () => {
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /choix 2/i,
          }),
        ),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /choix 4/i,
          }),
        ),
      ).toBeChecked();
    });

    await step("Lorsque l’utilisateur modifie la réponse", async () => {
      await userEvent.click(canvas.getByRole("checkbox", { name: /choix 3/i }));
      await userEvent.click(canvas.getByRole("checkbox", { name: /choix 4/i }));

      expect(
        canvas.getByRole("radio", { name: /plusieurs choix/i }),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /choix 2/i,
          }),
        ),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /choix 3/i,
          }),
        ),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /choix 4/i,
          }),
        ),
      ).not.toBeChecked();
      entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
        reponseDonnee: {
          reponse: "plusieurs-choix",
          questions: [
            {
              identifiant: "la-question",
              reponses: ["choix-2", "choix-3"],
            },
          ],
        },
        identifiantQuestion: "qcm",
      });
    });

    await step(
      "Lorsque l'utilisateur sélectionne une réponse à choix unique",
      async () => {
        await userEvent.click(
          canvas.getByRole("radio", { name: /un seul choix/i }),
        );

        expect(
          await waitFor(() =>
            canvas.getByRole("radio", {
              name: /un seul choix/i,
            }),
          ),
        ).toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole("checkbox", {
              name: /choix 2/i,
            }),
          ),
        ).not.toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole("checkbox", {
              name: /choix 3/i,
            }),
          ),
        ).not.toBeChecked();
        entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
          reponseDonnee: "un-seul-choix",
          identifiantQuestion: "qcm",
        });
      },
    );
  },
};

export const SelectionneLesReponsesPourLesQuestionsAPlusieursTiroirs: Story = {
  name: "Sélectionne les réponses pour les questions à plusieurs tiroirs",
  args: { idDiagnostic: identifiantQuestionAPlusieursTiroirs },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Lorsque le diagnostic est récupéré depuis l’API", async () => {
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /choix 2/i,
          }),
        ),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /choix 4/i,
          }),
        ),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /tiroir 21/i,
          }),
        ),
      ).toBeChecked();
    });

    await step("Lorsque l’utilisateur modifie la réponse", async () => {
      await userEvent.click(canvas.getByRole("checkbox", { name: /choix 3/i }));
      await userEvent.click(
        canvas.getByRole("checkbox", { name: /tiroir 22/i }),
      );

      expect(
        canvas.getByRole("radio", { name: /plusieurs tiroirs/i }),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /choix 2/i,
          }),
        ),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /choix 3/i,
          }),
        ),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /choix 4/i,
          }),
        ),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /tiroir 21/i,
          }),
        ),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /tiroir 22/i,
          }),
        ),
      ).toBeChecked();
      entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
        reponseDonnee: {
          reponse: "plusieurs-tiroirs",
          questions: [
            {
              identifiant: "la-question",
              reponses: ["choix-2", "choix-4", "choix-3"],
            },
            {
              identifiant: "second-tiroir",
              reponses: ["tiroir-21", "tiroir-22"],
            },
          ],
        },
        identifiantQuestion: "qcm",
      });
    });
  },
};

export const SelectionneLaReponsePourLaQuestionsATiroirAvecReponseUnique: Story =
  {
    name: "Sélectionne la réponse pour la question à tiroir avec une réponse unique",
    args: { idDiagnostic: identifiantQuestionATiroirAvecReponseUnique },
    play: async ({ canvasElement, step }) => {
      const canvas = within(canvasElement);

      await step(
        "Lorsque le diagnostic est récupéré depuis l’API",
        async () => {
          expect(
            await waitFor(() =>
              canvas.getByRole("radio", {
                name: /choix 1/i,
              }),
            ),
          ).not.toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole("radio", {
                name: /choix 2/i,
              }),
            ),
          ).toBeChecked();
          expect(
            await waitFor(() =>
              canvas.getByRole("radio", {
                name: /choix 3/i,
              }),
            ),
          ).not.toBeChecked();
        },
      );

      await step("Lorsque l’utilisateur modifie la réponse", async () => {
        await userEvent.click(canvas.getByRole("radio", { name: /choix 3/i }));

        expect(
          canvas.getByRole("radio", { name: /tiroir à choix unique ?/i }),
        ).toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole("radio", {
              name: /choix 1/i,
            }),
          ),
        ).not.toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole("radio", {
              name: /choix 2/i,
            }),
          ),
        ).not.toBeChecked();
        expect(
          await waitFor(() =>
            canvas.getByRole("radio", {
              name: /choix 3/i,
            }),
          ),
        ).toBeChecked();
        entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
          reponseDonnee: {
            reponse: "tiroir-a-choix-unique-",
            questions: [
              {
                identifiant: "le-choix-unique-",
                reponses: ["choix-3"],
              },
            ],
          },
          identifiantQuestion: "qcm",
        });
      });
    },
  };

export const SelectionneLaReponsePourUneQuestionAChoixMultiple: Story = {
  name: "Sélectionne la réponse pour une question à choix multiple",
  args: { idDiagnostic: identifiantQuestionAChoixMultiple },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Lorsque le diagnostic est récupéré depuis l’API", async () => {
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /réponse 1/i,
          }),
        ),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /réponse 2/i,
          }),
        ),
      ).not.toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /réponse 3/i,
          }),
        ),
      ).not.toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /réponse 4/i,
          }),
        ),
      ).not.toBeChecked();
    });

    await step("Lorsque l’utilisateur modifie la réponse", async () => {
      await userEvent.click(
        canvas.getByRole("checkbox", { name: /réponse 3/i }),
      );

      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /réponse 1/i,
          }),
        ),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /réponse 2/i,
          }),
        ),
      ).not.toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /réponse 3/i,
          }),
        ),
      ).toBeChecked();
      expect(
        await waitFor(() =>
          canvas.getByRole("checkbox", {
            name: /réponse 4/i,
          }),
        ),
      ).not.toBeChecked();
      entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
        reponseDonnee: ["reponse-1", "reponse-3"],
        identifiantQuestion: "question-a-choix-multiple-",
      });
    });
  },
};
