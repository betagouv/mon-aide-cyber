import { useAuthentification, useNavigationMAC } from './hooks.ts';
import { ReactElement, useEffect, useState } from 'react';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { Outlet } from 'react-router-dom';

export const RequiertAidantSansEspace = () => {
  const navigationMAC = useNavigationMAC();
  const authentification = useAuthentification();
  const [redirection, setRedirection] = useState<ReactElement>(<></>);

  useEffect(() => {
    authentification
      .appelleUtilisateur()
      .then((utilisateur) => {
        const moteurDeLiens = new MoteurDeLiens(utilisateur.liens);
        const creerEspaceAidant = moteurDeLiens.trouve('creer-espace-aidant');

        if (!creerEspaceAidant) {
          navigationMAC.navigue(moteurDeLiens, 'lancer-diagnostic');
        } else {
          setRedirection(<Outlet />);
        }
      })
      .catch(() => {
        navigationMAC.retourAccueil();
      });
  }, [authentification, navigationMAC]);

  return redirection;
};
