import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { LienMAC } from '../LienMAC';
import { Footer } from './Footer';
import { useLayoutEffect } from 'react';

export type LienNavigation = {
  clef?: number;
  route: string;
  nom: string;
  enfants?: LienNavigation[];
};

export const liensNavigation: LienNavigation[] = [
  {
    route: '/',
    nom: 'Accueil',
  },
  {
    route: '/beneficier-du-dispositif/etre-aide',
    nom: 'Bénéficier du dispositif',
  },
  {
    route: '/devenir-aidant',
    nom: 'Devenir aidant',
  },
  {
    route: '/a-propos',
    nom: 'À propos',
    clef: 776,
    enfants: [
      {
        route: '/a-propos/kit-de-communication',
        nom: 'Kit de communication',
      },
      {
        route: '/a-propos/statistiques',
        nom: 'Statistiques',
      },
    ],
  },
];

export const LayoutPublic = ({
  afficheNavigation = true,
}: {
  afficheNavigation?: boolean;
}) => {
  const location = useLocation();

  // scroll to top of page after a page transition.
  useLayoutEffect(() => {
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <Header
        lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />}
        afficheNavigation={afficheNavigation}
      />
      <Outlet />
      <Footer />
    </>
  );
};
