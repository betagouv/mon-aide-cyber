import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/styles/index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FournisseurEntrepots } from "./fournisseurs/FournisseurEntrepot.ts";
import { ComposantIntercepteur } from "./composants/intercepteurs/ComposantIntercepteur.tsx";
import {
  APIEntrepotDiagnostics,
  APIEntrepotDiagnostique,
} from "./infrastructure/entrepots/EntrepotsAPI.ts";
import { ComposantDiagnostique } from "./composants/diagnostic/ComposantDiagnostique.tsx";
import { ComposantAffichageErreur } from "./composants/erreurs/ComposantAffichageErreur.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ComposantDiagnostics } from "./composants/ComposantDiagnostics.tsx";
import { EntrepotDiagnostics } from "./domaine/diagnostique/Diagnostics.ts";

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
    path: "diagnostique/:idDiagnostique",
    element: <ComposantIntercepteur composant={ComposantDiagnostique} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FournisseurEntrepots.Provider
      value={{
        diagnostique: () => new APIEntrepotDiagnostique(),
        diagnostics: (): EntrepotDiagnostics => new APIEntrepotDiagnostics(),
      }}
    >
      <RouterProvider router={routeur} />
    </FournisseurEntrepots.Provider>
  </React.StrictMode>,
);
