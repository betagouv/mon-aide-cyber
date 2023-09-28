import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/styles/index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FournisseurEntrepots } from "./fournisseurs/FournisseurEntrepot.ts";
import { ComposantIntercepteur } from "./composants/intercepteurs/ComposantIntercepteur.tsx";
import { APIEntrepotDiagnostics } from "./infrastructure/entrepots/EntrepotsAPI.ts";
import { ComposantAffichageErreur } from "./composants/erreurs/ComposantAffichageErreur.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { EntrepotDiagnostics } from "./domaine/diagnostic/Diagnostics.ts";
import { ComposantDiagnostic } from "./composants/diagnostic/ComposantDiagnostic.tsx";
import { ComposantDiagnostics } from "./composants/ComposantDiagnostics.tsx";
import { APIEntrepotDiagnostic } from "./infrastructure/entrepots/APIEntrepotDiagnostic.ts";

import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
startReactDsfr({ defaultColorScheme: "system" });

const routeur = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
        <App />
      </ErrorBoundary>
    ),
  },
  {
    path: "diagnostics",
    element: (
      <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
        <ComposantDiagnostics />
      </ErrorBoundary>
    ),
  },
  {
    path: "diagnostic/:idDiagnostic",
    element: <ComposantIntercepteur composant={ComposantDiagnostic} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FournisseurEntrepots.Provider
      value={{
        diagnostic: () => new APIEntrepotDiagnostic(),
        diagnostics: (): EntrepotDiagnostics => new APIEntrepotDiagnostics(),
      }}
    >
      <Header
        brandTop={
          <>
            République
            <br />
            Française
          </>
        }
        homeLinkProps={{
          href: "/",
          title: "Accueil - MonAideCyber",
        }}
        id="fr-header-simple-header-with-service-title-and-tagline"
        serviceTagline="baseline - précisions sur l'organisation"
        serviceTitle="MonAideCyber"
        operatorLogo={{
          alt: "ANSSI",
          imgUrl: "/images/logo_anssi.png",
          orientation: "vertical",
        }}
      />
      <main role="main">
        <div className="fr-container">
          <div className="fr-grid-row">
            <RouterProvider router={routeur} />
          </div>
        </div>
      </main>
      <Footer
        accessibility="non compliant"
        contentDescription="
    Ce message est à remplacer par les informations de votre site.

    Comme exemple de contenu, vous pouvez indiquer les informations
    suivantes : Le site officiel d’information administrative pour les entreprises.
    Retrouvez toutes les informations et démarches administratives nécessaires à la création,
    à la gestion et au développement de votre entreprise.
    "
        bottomItems={[]}
      />
    </FournisseurEntrepots.Provider>
  </React.StrictMode>,
);
