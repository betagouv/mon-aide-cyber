import { Meta, StoryObj } from "@storybook/react";
import { FournisseurEntrepots } from "../fournisseurs/FournisseurEntrepot.ts";
import { unDiagnostic } from "../../test/consructeurs/constructeurDiagnostic.ts";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import {
  EntrepotDiagnosticMemoire,
  EntrepotDiagnosticsMemoire,
} from "../../test/infrastructure/entrepots/EntrepotsMemoire.ts";
import { uneQuestionAChoixUnique } from "../../test/consructeurs/constructeurQuestions.ts";
import { uneReponsePossible } from "../../test/consructeurs/constructeurReponsePossible.ts";
import { ComposantAffichageErreur } from "../composants/erreurs/ComposantAffichageErreur.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { unReferentiel } from "../../test/consructeurs/constructeurReferentiel.ts";
import { ComposantDiagnostic } from "../composants/diagnostic/ComposantDiagnostic.tsx";
import { EntrepotDiagnostics } from "../domaine/diagnostic/Diagnostics.ts";
import { uneAction } from "../../test/consructeurs/constructeurActionDiagnostic.ts";

const entrepotDiagnosticMemoire = new EntrepotDiagnosticMemoire();
const actionRepondre = uneAction().contexte().construis();

const identifiantQuestionAChoixUnique = "6dadad14-8fa0-4be7-a8da-473d538eb6c1";
const reponseDonneeChoixUnique = uneReponsePossible().construis();
const diagnosticAvecUneQuestionAChoixUnique = unDiagnostic()
  .avecIdentifiant(identifiantQuestionAChoixUnique)
  .avecUnReferentiel(
    unReferentiel()
      .ajouteAction(actionRepondre)
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle("Quelle entreprise êtes-vous ?")
          .avecDesReponses([
            uneReponsePossible().avecLibelle("Entreprise privée").construis(),
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
      .ajouteAction(actionRepondre)
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle("Une liste déroulante?")
          .sousFormeDeListe()
          .avecDesReponses([
            uneReponsePossible().avecLibelle("Réponse A").construis(),
            uneReponsePossible().avecLibelle("Réponse C").construis(),
          ])
          .avecLaReponseDonnee(reponseSelectionnee)
          .construis(),
      )
      .construis(),
  )
  .construis();

await entrepotDiagnosticMemoire.persiste(diagnosticAvecUneQuestionAChoixUnique);
await entrepotDiagnosticMemoire.persiste(
  diagnosticAvecQuestionSousFormeDeListeDeroulante,
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
      expect(
        entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
          reponseDonnee: "entreprise-privee",
          identifiantQuestion: "quelle-entreprise-etesvous-",
        }),
      ).toBeTruthy();
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
      expect(
        entrepotDiagnosticMemoire.verifieEnvoiReponse(actionRepondre, {
          reponseDonnee: "reponse-c",
          identifiantQuestion: "une-liste-deroulante",
        }),
      ).toBeTruthy();
    });
  },
};
