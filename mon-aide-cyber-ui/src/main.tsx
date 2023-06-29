import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/styles/index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ComposantDiagnostique } from "./composants/ComposantDiagnostique.tsx";

const routeur = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "diagnostique/:idDiagnostique",
    element: <ComposantDiagnostique />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={routeur} />
  </React.StrictMode>,
);
