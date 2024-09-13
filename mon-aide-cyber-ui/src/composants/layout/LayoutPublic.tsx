import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { LienMAC } from '../LienMAC';
import { Footer } from './Footer';

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
    route: '/demandes/devenir-aidant',
    nom: 'Devenir aidant',
  },
  {
    route: '/a-propos/kit-de-communication',
    nom: 'Kit de communication',
  },
];
export const LayoutPublic = () => {
  return (
    <>
      <Header lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />} />
      <Outlet />
      <Footer />
    </>
  );
};
