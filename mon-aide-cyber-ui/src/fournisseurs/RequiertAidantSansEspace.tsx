import { useNavigationMAC } from './hooks.ts';
import { ReactElement, useEffect, useState } from 'react';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { Outlet } from 'react-router-dom';

export const RequiertAidantSansEspace = () => {
  const navigationMAC = useNavigationMAC();
  const [redirection, setRedirection] = useState<ReactElement>(<></>);

  useEffect(() => {
    const moteurDeLiens = new MoteurDeLiens(navigationMAC.etat);
    moteurDeLiens.trouve(
      'creer-espace-aidant',
      () => setRedirection(<Outlet />),
      () => moteurDeLiens.trouve('lancer-diagnostic', () => navigationMAC.navigue(moteurDeLiens, 'lancer-diagnostic')),
    );
  }, [navigationMAC]);

  return redirection;
};
