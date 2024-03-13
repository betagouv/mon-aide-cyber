import { useAuthentification, useModale, useNavigationMAC } from './hooks.ts';
import { useEffect, useState } from 'react';
import { afficheModaleSessionExpiree } from '../composants/authentification/modalesAuthentification.tsx';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { Outlet } from 'react-router-dom';

export const RequiertAuthentification = () => {
  const authentification = useAuthentification();
  const navigationMAC = useNavigationMAC();
  const [doitVerifierReconnexion, setDoitVerifierReconnexion] = useState(true);
  const [pagePrecedente, setPagePrecedente] = useState(
    window.location.pathname,
  );
  const [chargementUtilisateurEnErreur, setChargementUtilisateurEnErreur] =
    useState(false);
  const modale = useModale();

  useEffect(() => {
    if (doitVerifierReconnexion) {
      authentification
        .appelleUtilisateur()
        .then((utilisateur) => {
          navigationMAC.ajouteEtat(utilisateur.liens);
          setPagePrecedente(window.location.pathname);
          setChargementUtilisateurEnErreur(false);
        })
        .catch((erreur) => {
          setChargementUtilisateurEnErreur(true);
          navigationMAC.setEtat(new MoteurDeLiens(erreur.liens).extrais());
          afficheModaleSessionExpiree(modale, () => {
            modale.ferme();
            navigationMAC.retourAccueil();
          });
        });
    }
    setDoitVerifierReconnexion(
      window.location.pathname !== pagePrecedente &&
        !chargementUtilisateurEnErreur,
    );
  }, [
    modale,
    authentification,
    navigationMAC,
    doitVerifierReconnexion,
    pagePrecedente,
    chargementUtilisateurEnErreur,
  ]);
  return <Outlet />;
};
