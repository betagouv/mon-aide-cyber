import { useNavigationMAC } from './hooks.ts';
import { ReactElement, useEffect, useState } from 'react';
import { MoteurDeLiens, ROUTE_MON_ESPACE } from '../domaine/MoteurDeLiens.ts';
import { Outlet } from 'react-router-dom';
import { useMoteurDeLiens } from '../hooks/useMoteurDeLiens.ts';

export const NecessiteValidationCGU = () => {
  const navigationMAC = useNavigationMAC();
  const [redirection, setRedirection] = useState<ReactElement>(<></>);

  const { accedeALaRessource: doitValiderProfilAidant } = useMoteurDeLiens(
    'valider-profil-aidant'
  );
  const { accedeALaRessource: doitValiderProfilUtilisateurInscrit } =
    useMoteurDeLiens('valider-profil-utilisateur-inscrit');

  useEffect(() => {
    if (doitValiderProfilAidant && doitValiderProfilUtilisateurInscrit) {
      setRedirection(<Outlet />);
      return;
    }

    const moteurDeLiens = new MoteurDeLiens(navigationMAC.etat);

    moteurDeLiens.trouve(
      'valider-signature-cgu',
      () => setRedirection(<Outlet />),
      () =>
        moteurDeLiens.trouve('lancer-diagnostic', () =>
          navigationMAC.navigue(
            `${ROUTE_MON_ESPACE}/tableau-de-bord`,
            navigationMAC.etat
          )
        )
    );
  }, [navigationMAC.etat]);

  return redirection;
};
