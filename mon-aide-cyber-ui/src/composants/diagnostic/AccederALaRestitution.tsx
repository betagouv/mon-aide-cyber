import { UUID } from '../../types/Types.ts';
import { useCallback } from 'react';
import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';

export const AccederALaRestitution = ({
  idDiagnostic,
  surAnnuler,
}: {
  idDiagnostic: UUID;
  surAnnuler: () => void;
}) => {
  const navigationMAC = useNavigationMAC();

  const surQuitterLeDiagnostic = useCallback(() => {
    surAnnuler();
    navigationMAC.navigue(
      new MoteurDeLiens(navigationMAC.etat),
      `afficher-diagnostic-${idDiagnostic}`
    );
  }, [idDiagnostic, navigationMAC, surAnnuler]);
  return (
    <>
      <section>
        <div>
          Vous vous apprêtez à quitter le diagnostic et accéder à la
          restitution. Votre progression est enregistrée, vous pourrez reprendre
          et modifier le diagnostic à votre convenance.
        </div>
        <div className="fr-pt-4w">
          <button
            type="button"
            key="annule-acceder-a-la-restitution"
            className="fr-btn bouton-mac bouton-mac-secondaire fr-mr-2w"
            onClick={surAnnuler}
          >
            Annuler
          </button>
          <button
            type="button"
            key="connexion-aidant"
            className="fr-btn bouton-mac bouton-mac-primaire"
            onClick={surQuitterLeDiagnostic}
          >
            Accéder à la restitution
          </button>
        </div>
      </section>
    </>
  );
};
