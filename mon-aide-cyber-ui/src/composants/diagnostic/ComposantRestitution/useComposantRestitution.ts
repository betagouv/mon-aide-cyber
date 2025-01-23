import { useCallback, useEffect } from 'react';
import {
  MoteurDeLiens,
  ROUTE_MON_ESPACE,
} from '../../../domaine/MoteurDeLiens';
import { useNavigationMAC } from '../../../fournisseurs/hooks';
import { rubriqueConsultee } from '../../../domaine/diagnostic/reducteurRestitution';
import { UUID } from '../../../types/Types';
import { useRecupereLaRestitution } from './useRecupereLaRestitution';
import { useNavigueVersModifierDiagnostic } from '../../../fournisseurs/ContexteNavigationMAC.tsx';
import { useTelechargerRestitution } from './useTelechargerRestitution.ts';

export const useComposantRestitution = (
  idDiagnostic: UUID,
  estLibreAcces: boolean
) => {
  const navigationMAC = useNavigationMAC();
  const { navigue } = useNavigueVersModifierDiagnostic(
    estLibreAcces ? '/diagnostic' : `${ROUTE_MON_ESPACE}/diagnostic`
  );

  const { etatRestitution, envoie } = useRecupereLaRestitution(
    idDiagnostic,
    estLibreAcces
  );

  const { telechargerRestitution, chargeLeFichier: boutonDesactive } =
    useTelechargerRestitution(idDiagnostic);

  useEffect(() => {
    if (etatRestitution.restitution) {
      const observateurDIntersection = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const nomRubriqueConsultee = entry.target.parentElement?.id;

              nomRubriqueConsultee &&
                envoie(rubriqueConsultee(nomRubriqueConsultee));
            }
          });
        },
        {
          rootMargin: '-20% 0% -60% 0%',
        }
      );

      const titresRubriques = document.querySelectorAll('.restitution h4');

      titresRubriques.forEach((titreRubrique) =>
        observateurDIntersection.observe(titreRubrique)
      );

      return () => {
        titresRubriques.forEach((titreRubrique) =>
          observateurDIntersection.unobserve(titreRubrique)
        );
      };
    }
  }, [etatRestitution.restitution, envoie]);

  useEffect(() => {
    window.addEventListener('beforeprint', () => {
      const details = document.querySelectorAll('details');
      details.forEach((d) => d.setAttribute('open', ''));
    });
  }, []);

  useEffect(() => {
    window.addEventListener('afterprint', () => {
      const details = document.querySelectorAll('details');
      details.forEach((d) => d.removeAttribute('open'));
    });
  }, []);

  const modifierLeDiagnostic = useCallback(() => {
    navigue(etatRestitution.restitution!.liens['modifier-diagnostic']);
  }, [etatRestitution, navigationMAC]);

  const navigueVersTableauDeBord = useCallback(() => {
    const liens = etatRestitution.restitution!.liens;
    const moteurDeLiens = new MoteurDeLiens(liens);
    if (moteurDeLiens.existe('lancer-diagnostic')) {
      navigationMAC.navigue(`${ROUTE_MON_ESPACE}/tableau-de-bord`, liens, [
        'modifier-diagnostic',
        'restitution-pdf',
        'restitution-json',
      ]);
    }
  }, [etatRestitution.restitution, navigationMAC.etat]);

  return {
    etatRestitution,
    navigueVersTableauDeBord,
    telechargerRestitution,
    modifierLeDiagnostic,
    boutonDesactive,
  };
};
