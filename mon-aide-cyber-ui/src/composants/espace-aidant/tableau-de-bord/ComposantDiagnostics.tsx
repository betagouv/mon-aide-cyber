import {
  ComposantBoutonCreerDiagnostic,
  ComposantLancerDiagnostic,
  ComposantLienCreerDiagnostic,
} from '../../diagnostic/ComposantLancerDiagnostic.tsx';
import { ComposantIdentifiantDiagnostic } from '../../ComposantIdentifiantDiagnostic.tsx';
import { Diagnostic } from './TableauDeBord.tsx';
import { useCallback } from 'react';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../../domaine/MoteurDeLiens.ts';
import { UUID } from '../../../types/Types.ts';

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
      <div className="fr-col-10 tableau fr-col-offset-2">
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
      <div className="fr-col-10 fr-col-offset-2">
        <h4>Vous n’avez pas encore effectué de diagnostic. </h4>
        <ComposantLancerDiagnostic composant={ComposantBoutonCreerDiagnostic} />
      </div>
    );

  return (
    <>
      <div className="bandeau-violet-clair">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-10 fr-col-offset-2">
              <div className="fr-grid-row">
                <div className="encart-gauche fr-col-12">
                  <h2>Mes Diagnostics</h2>
                  <div>
                    Retrouvez ici l’ensemble des diagnostics que vous avez
                    menés.
                    <br />
                    <br />
                    Vous souhaitez créer un diagnostic ? Il est impératif que le
                    contact de l’entité souhaitant bénéficier du diagnostic
                    valide les CGU avant de le réaliser. Cliquez sur le bouton
                    ci-dessous pour effectuer une demande de création de
                    diagnostic et de validation des CGU :
                  </div>
                  <br />
                  <ComposantLancerDiagnostic
                    composant={ComposantLienCreerDiagnostic}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--gutters">
          {tableauDiagnostics}
        </div>
      </div>
    </>
  );
};
