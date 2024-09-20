import {
  ComposantBoutonCreerDiagnostic,
  ComposantLancerDiagnostic,
} from '../../diagnostic/ComposantLancerDiagnostic.tsx';
import { ComposantIdentifiantDiagnostic } from '../../ComposantIdentifiantDiagnostic.tsx';
import { useCallback } from 'react';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../../domaine/MoteurDeLiens.ts';
import { UUID } from '../../../types/Types.ts';
import { Diagnostic } from '../../../domaine/espace-aidant/ecran-diagnostics/EcranDiagnostics.tsx';

export const ComposantDiagnostics = ({
  diagnostics,
}: {
  diagnostics: Diagnostic[];
}) => {
  const navigationMAC = useNavigationMAC();
  const afficherDiagnostic = useCallback(
    (idDiagnostic: UUID) =>
      navigationMAC.navigue(
        new MoteurDeLiens(navigationMAC.etat),
        `afficher-diagnostic-${idDiagnostic}`
      ),
    [navigationMAC]
  );

  const tableauDiagnostics =
    diagnostics.length > 0 ? (
      <div className="fr-col-12 tableau">
        <div className="fr-grid-row">
          <div className="fr-col-2">ID</div>
          <div className="fr-col-2">Date</div>
          <div className="fr-col-3">Secteur géographique</div>
          <div className="fr-col-5">Secteur d&apos;activité</div>
        </div>
        {diagnostics.map((diag, index) => (
          <div
            key={index}
            className="fr-grid-row rang"
            onClick={() => afficherDiagnostic(diag.identifiant)}
          >
            <div className="fr-col-2">
              <ComposantIdentifiantDiagnostic identifiant={diag.identifiant} />
            </div>
            <div className="fr-col-2">{diag.dateCreation}</div>
            <div className="fr-col-3">{diag.secteurGeographique}</div>
            <div className="fr-col-5">{diag.secteurActivite}</div>
          </div>
        ))}
      </div>
    ) : (
      <div className="fr-col-10">
        <h4>Vous n’avez pas encore effectué de diagnostic. </h4>
        <ComposantLancerDiagnostic composant={ComposantBoutonCreerDiagnostic} />
      </div>
    );

  return <div className="fr-grid-row">{tableauDiagnostics}</div>;
};
