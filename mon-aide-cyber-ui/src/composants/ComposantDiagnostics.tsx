import { useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { ComposantLancerDiagnostic } from './diagnostic/ComposantLancerDiagnostic.tsx';
import { actions, routage } from '../domaine/Actions.ts';
import { Diagnostics } from '../domaine/diagnostic/Diagnostics.ts';
import { Footer } from './Footer.tsx';
import { Header } from './Header.tsx';

import { useMACAPI } from '../fournisseurs/hooks.ts';

import { constructeurParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';

export const ComposantDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<Diagnostics | undefined>(undefined);
  const { showBoundary } = useErrorBoundary();
  const macapi = useMACAPI();
  useEffect(() => {
    if (!diagnostics) {
      macapi
        .appelle<Diagnostics>(
          constructeurParametresAPI().url('/api/diagnostics/').methode('GET').construis(),
          async (reponse) => (await reponse) as Diagnostics,
        )
        .then((diagnostics) => setDiagnostics(diagnostics))
        .catch((erreur) => showBoundary(erreur));
    }
  }, [diagnostics, macapi, setDiagnostics, showBoundary]);
  return (
    <>
      <Header />
      <main role="main">
        <div className="fr-container">
          <div className="fr-grid-row">
            <div className="conteneur-diagnostics">
              <div className="droite">
                <ComposantLancerDiagnostic style="bouton-mac bouton-mac-primaire" />
              </div>
              <div className="diagnostics">
                <div className="en-tete un">ID</div>
                <div className="en-tete deux">Création</div>
                <div className="en-tete trois">Statut</div>
                <div className="en-tete quatre">Lorem</div>
                <div className="en-tete cinq">Ipsum</div>
                <div className="en-tete six">Dolor</div>
                {diagnostics?.map((diagnostic) => {
                  return (
                    <div className="identifiant" key={diagnostic.identifiant}>
                      <a href={routage.pour(diagnostic.actions, actions.diagnostics().AFFICHER).lien()}>
                        {diagnostic.identifiant}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
