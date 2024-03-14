import { useNavigationMAC } from './hooks.ts';
import { ReactElement, useEffect, useState } from 'react';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { Outlet } from 'react-router-dom';
import { Lien } from '../domaine/Lien.ts';

export const RequiertEspaceAidant = () => {
  const navigationMAC = useNavigationMAC();
  // const authentification = useAuthentification();
  const [redirection, setRedirection] = useState<ReactElement>(<></>);

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'creer-espace-aidant',
      (_lien: Lien) =>
        navigationMAC.navigue(
          new MoteurDeLiens(navigationMAC.etat),
          'creer-espace-aidant',
        ),
      () => setRedirection(<Outlet />),
    );
    // authentification
    //   .appelleUtilisateur()
    //   .then((utilisateur) => {
    //     const moteurDeLiens = new MoteurDeLiens(utilisateur.liens);
    //     const creerEspaceAidant = moteurDeLiens.trouve('creer-espace-aidant');
    //
    //     if (creerEspaceAidant) {
    //       navigationMAC.navigue(moteurDeLiens, 'creer-espace-aidant');
    //     } else {
    //       setRedirection(<Outlet />);
    //     }
    //   })
    //   .catch(() => {
    //     // navigationMAC.retourAccueil();
    //   });
  }, [navigationMAC]);

  return redirection;
};
