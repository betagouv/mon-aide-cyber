import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/styles/index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  APIEntrepotDiagnostique,
  FournisseurEntrepots,
} from "./fournisseurs/FournisseurEntrepot.ts";
import { ComposantDiagnostiqueIntercepteur } from "./composants/intercepteurs/ComposantDiagnostiqueIntercepteur.tsx";

const routeur = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "diagnostique/:idDiagnostique",
    element: <ComposantDiagnostiqueIntercepteur />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FournisseurEntrepots.Provider
      value={{ diagnostique: () => new APIEntrepotDiagnostique() }}
    >
      <RouterProvider router={routeur} />
    </FournisseurEntrepots.Provider>
  </React.StrictMode>,
);
