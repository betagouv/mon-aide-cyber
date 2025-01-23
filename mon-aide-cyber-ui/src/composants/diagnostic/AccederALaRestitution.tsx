import { UUID } from '../../types/Types.ts';
import { useCallback } from 'react';
import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { useNavigueVersLaRestitution } from '../../fournisseurs/ContexteNavigationMAC.tsx';
import Button from '../atomes/Button/Button.tsx';

export const AccederALaRestitution = ({
  idDiagnostic,
  route,
  surAnnuler,
}: {
  idDiagnostic: UUID;
  route: '/mon-espace/diagnostic' | '/diagnostic';
  surAnnuler: () => void;
}) => {
  const navigationMAC = useNavigationMAC();
  const { navigue } = useNavigueVersLaRestitution(route);

  const surQuitterLeDiagnostic = useCallback(() => {
    surAnnuler();
    navigue(idDiagnostic);
  }, [idDiagnostic, navigationMAC.etat, surAnnuler]);

  return (
    <>
      <section>
        <div>
          Vous vous apprêtez à quitter le diagnostic et accéder à la
          restitution. Votre progression est enregistrée, vous pourrez reprendre
          et modifier le diagnostic à votre convenance.
        </div>
        <div className="fr-pt-4w">
          <Button
            variant="secondary"
            type="button"
            className="fr-mr-2w"
            key="annule-acceder-a-la-restitution"
            onClick={surAnnuler}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            type="button"
            key="connexion-aidant"
            onClick={surQuitterLeDiagnostic}
          >
            Accéder à la restitution
          </Button>
        </div>
      </section>
    </>
  );
};
