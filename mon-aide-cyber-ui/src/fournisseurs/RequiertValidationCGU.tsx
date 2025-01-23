import { useNavigationMAC } from './hooks.ts';
import { ReactElement, useEffect, useState } from 'react';
import { MoteurDeLiens, ROUTE_MON_ESPACE } from '../domaine/MoteurDeLiens.ts';
import { Outlet } from 'react-router-dom';

export const RequiertValidationCGU = () => {
  const navigationMAC = useNavigationMAC();
  const [redirection, setRedirection] = useState<ReactElement>(<></>);

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'valider-signature-cgu',
      () =>
        navigationMAC.navigue(
          `${ROUTE_MON_ESPACE}/valide-signature-cgu`,
          navigationMAC.etat
        ),
      () => setRedirection(<Outlet />)
    );
  }, [navigationMAC]);

  return redirection;
};
