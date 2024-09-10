import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { LienMAC } from '../LienMAC';
import { Footer } from './Footer';
import { useLayoutEffect } from 'react';

export type LienNavigation = {
  route: string;
  nom: string;
};

export const liensNavigation: LienNavigation[] = [
  {
    route: '/',
    nom: 'Accueil',
  },
  {
    route: '/demandes/etre-aide',
    nom: 'Bénéficier du dispositif',
  },
  {
    route: '/devenir-aidant',
    nom: 'Devenir aidant',
  },
  {
    route: '/a-propos/kit-de-communication',
    nom: 'Kit de communication',
  },
];
export const LayoutPublic = () => {
  const location = useLocation();

  // scroll to top of page after a page transition.
  useLayoutEffect(() => {
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <Header lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />} />
      <Outlet />
      <Footer />
    </>
  );
};
