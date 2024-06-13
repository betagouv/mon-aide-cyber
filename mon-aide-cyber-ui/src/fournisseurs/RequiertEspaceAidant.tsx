import { useNavigationMAC } from './hooks.ts';
import { ReactElement, useEffect, useState } from 'react';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { Outlet } from 'react-router-dom';

export const RequiertEspaceAidant = () => {
  const navigationMAC = useNavigationMAC();
  const [redirection, setRedirection] = useState<ReactElement>(<></>);

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'creer-espace-aidant',
      () =>
        navigationMAC.navigue(
          new MoteurDeLiens(navigationMAC.etat),
          'creer-espace-aidant'
        ),
      () => setRedirection(<Outlet />)
    );
  }, [navigationMAC]);

  return redirection;
};
