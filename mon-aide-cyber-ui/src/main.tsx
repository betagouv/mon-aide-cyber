import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/styles/index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FournisseurEntrepots } from "./fournisseurs/FournisseurEntrepot.ts";
import { ComposantDiagnostic } from "./composants/ComposantDiagnostic.tsx";
import { ComposantIntercepteur } from "./composants/intercepteurs/ComposantIntercepteur.tsx";
import { APIEntrepotDiagnostic } from "./infrastructure/entrepots/EntrepotsAPI.ts";

const routeur = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
