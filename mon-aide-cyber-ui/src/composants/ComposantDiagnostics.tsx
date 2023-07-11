import { useContext, useEffect, useState } from "react";
import { FournisseurEntrepots } from "../fournisseurs/FournisseurEntrepot.ts";
import { useErrorBoundary } from "react-error-boundary";
import { ComposantLancerDiagnostic } from "./diagnostic/ComposantLancerDiagnostic.tsx";
import { actions, routage } from "../domaine/Actions.ts";
import { Diagnostics } from "../domaine/diagnostic/Diagnostics.ts";

export const ComposantDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<Diagnostics>(
    [] as unknown as Diagnostics,
  );
  const entrepots = useContext(FournisseurEntrepots);
  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    entrepots
      .diagnostics()
      .tous()
      .then((diagnostics) => setDiagnostics(diagnostics))
      .catch((erreur) => showBoundary(erreur));
  }, [entrepots, setDiagnostics, showBoundary]);
  return (
    <>
      <div className="conteneur-diagnostics">
        <div className="droite">
          <ComposantLancerDiagnostic />
        </div>
        <div className="diagnostics">
          <div className="en-tete un">ID</div>
          <div className="en-tete deux">Création</div>
          <div className="en-tete trois">Statut</div>
          <div className="en-tete quatre">Lorem</div>
          <div className="en-tete cinq">Ipsum</div>
          <div className="en-tete six">Dolor</div>
          {diagnostics.map((diagnostic) => {
            return (
              <div className="identifiant" key={diagnostic.identifiant}>
                <a
                  href={routage
                    .pour(diagnostic.actions, actions.diagnostics().AFFICHER)
                    .lien()}
                >
                  {diagnostic.identifiant}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
