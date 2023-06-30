import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/styles/index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  APIEntrepotDiagnostic,
  FournisseurEntrepots,
} from "./fournisseurs/FournisseurEntrepot.ts";
import { ComposantDiagnosticIntercepteur } from "./composants/intercepteurs/ComposantDiagnosticIntercepteur.tsx";

const routeur = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "diagnostic/:idDiagnostic",
    element: <ComposantDiagnosticIntercepteur />,
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
