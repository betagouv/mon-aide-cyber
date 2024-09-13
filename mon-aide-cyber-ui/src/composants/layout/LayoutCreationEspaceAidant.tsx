import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { LienMAC } from '../LienMAC';
import { Footer } from './Footer';

export const LayoutCreationEspaceAidant = () => {
  return (
    <>
      <Header
        lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />}
        enteteSimple={true}
      />
      <Outlet />
      <Footer />
    </>
  );
};
