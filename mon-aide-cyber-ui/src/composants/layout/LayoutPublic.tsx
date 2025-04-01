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

export const LayoutPublic = ({
  afficheNavigation = true,
  enteteSimple = false,
}: {
  afficheNavigation?: boolean;
  enteteSimple?: boolean;
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
        enteteSimple={enteteSimple}
      />
      <Outlet />
      <Footer />
      <lab-anssi-centre-aide
        nomService="MonAideCyber"
        liens={JSON.stringify([
          {
            texte: '💬 Nous contacter par chat',
            href: 'https://aide.monaide.cyber.gouv.fr/fr/?chat=ouvert',
          },
          {
            texte: '🙌 Consulter la F.A.Q',
            href: 'https://aide.monaide.cyber.gouv.fr/fr/',
          },
        ])}
      ></lab-anssi-centre-aide>
    </>
  );
};
