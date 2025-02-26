import { useEffect } from 'react';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { useRecupereContexteNavigation } from '../../../hooks/useRecupereContexteNavigation.ts';
import { useMoteurDeLiens } from '../../../hooks/useMoteurDeLiens.ts';
import useDefilementFluide from '../../../hooks/useDefilementFluide.ts';
import { useQuery } from '@tanstack/react-query';
import { ReferentielAssociations } from './EcranRelaisAssociatifs.tsx';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';

const activeSectionsObservesDansMenu = () => {
  const observateurDIntersection = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const lienDeSection = document.querySelector(
          `nav ul li a.${entry.target.id}`
        );

        if (!lienDeSection) {
          return;
        }

        if (entry.isIntersecting) {
          lienDeSection.setAttribute('aria-current', 'page');
        } else {
          lienDeSection.removeAttribute('aria-current');
        }
      });
    },
    {
      rootMargin: '-30% 0% -62% 0%',
    }
  );

  const titresRubriques = document.querySelectorAll(
    '.rubriques-relais section'
  );

  titresRubriques.forEach((titreRubrique) =>
    observateurDIntersection.observe(titreRubrique)
  );

  return () =>
    titresRubriques.forEach((titreRubrique) =>
      observateurDIntersection.unobserve(titreRubrique)
    );
};

export const useEcranRelaisAssociatifs = () => {
  const macAPI = useMACAPI();
  const contexteNavigation = useRecupereContexteNavigation(
    'afficher-associations'
  );
  const action = useMoteurDeLiens('afficher-associations');

  useDefilementFluide();

  const { data: referentiel, isLoading: enCoursDeChargement } = useQuery({
    enabled:
      !!contexteNavigation.contexteRecuperee && action.accedeALaRessource,
    queryKey: ['afficher-associations'],
    queryFn: () => {
      return macAPI.execute<ReferentielAssociations, ReferentielAssociations>(
        constructeurParametresAPI()
          .url(action.ressource.url)
          .methode(action.ressource.methode!)
          .construis(),
        async (json) => {
          return await json;
        }
      );
    },
  });

  useEffect(() => activeSectionsObservesDansMenu(), []);

  return { referentiel, enCoursDeChargement };
};
