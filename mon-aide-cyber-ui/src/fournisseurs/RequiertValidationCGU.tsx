import { useNavigationMAC } from './hooks.ts';
import { ReactElement, useEffect, useState } from 'react';
import {
  MoteurDeLiens,
  ROUTE_MON_ESPACE_MON_UTILSATION_DU_SERVICE,
  ROUTE_MON_ESPACE_VALIDER_CGU,
} from '../domaine/MoteurDeLiens.ts';
import { Outlet } from 'react-router-dom';

export const RequiertValidationCGU = () => {
  const navigationMAC = useNavigationMAC();
  const [redirection, setRedirection] = useState<ReactElement>(<></>);

  const post31Janvier = true;
  const doitRevaliderProfil = true;

  useEffect(() => {
    if (post31Janvier && doitRevaliderProfil) {
      return navigationMAC.navigue(
        `${ROUTE_MON_ESPACE_MON_UTILSATION_DU_SERVICE}`,
        navigationMAC.etat
      );
    }

    new MoteurDeLiens(navigationMAC.etat).trouve(
      'valider-signature-cgu',
      () =>
        navigationMAC.navigue(
          `${ROUTE_MON_ESPACE_VALIDER_CGU}`,
          navigationMAC.etat
        ),
      () => setRedirection(<Outlet />)
    );
  }, [navigationMAC.etat]);

  return redirection;
};
