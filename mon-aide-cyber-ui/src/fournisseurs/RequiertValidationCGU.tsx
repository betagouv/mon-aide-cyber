import { useNavigationMAC } from './hooks.ts';
import { ReactElement, useEffect, useState } from 'react';
import { MoteurDeLiens, ROUTE_AIDANT } from '../domaine/MoteurDeLiens.ts';
import { Outlet } from 'react-router-dom';

export const RequiertValidationCGU = () => {
  const navigationMAC = useNavigationMAC();
  const [redirection, setRedirection] = useState<ReactElement>(<></>);

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'valider-signature-cgu',
      () =>
        navigationMAC.navigue(
          `${ROUTE_AIDANT}/valide-signature-cgu`,
          navigationMAC.etat
        ),
      () => setRedirection(<Outlet />)
    );
  }, [navigationMAC]);

  return redirection;
};
