import { useNavigationMAC } from './hooks.ts';
import { ReactElement, useEffect, useState } from 'react';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { Outlet } from 'react-router-dom';
import { Lien } from '../domaine/Lien.ts';

export const RequiertAidantSansEspace = () => {
  const navigationMAC = useNavigationMAC();
  // const authentification = useAuthentification();
  const [redirection, setRedirection] = useState<ReactElement>(<></>);

  useEffect(() => {
    const moteurDeLiens = new MoteurDeLiens(navigationMAC.etat);
    moteurDeLiens.trouve(
      'creer-espace-aidant',
      (_lien: Lien) => setRedirection(<Outlet />),
      () =>
        moteurDeLiens.trouve('lancer-diagnostic', (_lien) =>
          navigationMAC.navigue(moteurDeLiens, 'lancer-diagnostic'),
        ),
    );
    // authentification
    //   .appelleUtilisateur()
    //   .then((utilisateur) => {
    //     const moteurDeLiens = new MoteurDeLiens(utilisateur.liens);
    //     const creerEspaceAidant = moteurDeLiens.trouve('creer-espace-aidant');
    //
    //     if (!creerEspaceAidant) {
    //       navigationMAC.navigue(moteurDeLiens, 'lancer-diagnostic');
    //     } else {
    //       setRedirection(<Outlet />);
    //     }
    //   })
    //   .catch(() => {
    //     navigationMAC.retourAccueil();
    //   });
  }, [navigationMAC]);

  return redirection;
};
