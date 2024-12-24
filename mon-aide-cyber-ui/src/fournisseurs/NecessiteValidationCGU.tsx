import { useNavigationMAC } from './hooks.ts';
import { ReactElement, useEffect, useState } from 'react';
import { MoteurDeLiens, ROUTE_AIDANT } from '../domaine/MoteurDeLiens.ts';
import { Outlet } from 'react-router-dom';

export const NecessiteValidationCGU = () => {
  const navigationMAC = useNavigationMAC();
  const [redirection, setRedirection] = useState<ReactElement>(<></>);

  useEffect(() => {
    const moteurDeLiens = new MoteurDeLiens(navigationMAC.etat);
    moteurDeLiens.trouve(
      'valider-signature-cgu',
      () => setRedirection(<Outlet />),
      () =>
        moteurDeLiens.trouve('lancer-diagnostic', () =>
          navigationMAC.navigue(
            `${ROUTE_AIDANT}/tableau-de-bord`,
            navigationMAC.etat
          )
        )
    );
  }, [navigationMAC]);

  return redirection;
};
