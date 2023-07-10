import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/styles/index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FournisseurEntrepots } from "./fournisseurs/FournisseurEntrepot.ts";
import { ComposantIntercepteur } from "./composants/intercepteurs/ComposantIntercepteur.tsx";
import { APIEntrepotDiagnostic } from "./infrastructure/entrepots/EntrepotsAPI.ts";
import { ComposantAffichageErreur } from "./composants/erreurs/ComposantAffichageErreur.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ComposantDiagnostic } from "./composants/diagnostic/ComposantDiagnostic.tsx";

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
    path: "diagnostic/:idDiagnostic",
    element: <ComposantIntercepteur composant={ComposantDiagnostic} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FournisseurEntrepots.Provider
      value={{ diagnostic: () => new APIEntrepotDiagnostic() }}
    >
      <RouterProvider router={routeur} />
    </FournisseurEntrepots.Provider>
  </React.StrictMode>,
);
