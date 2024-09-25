import { useNavigationMAC, useUtilisateur } from './hooks.ts';
import { useEffect, useState } from 'react';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { Outlet } from 'react-router-dom';
import { ReponseUtilisateur } from '../domaine/authentification/Authentification.ts';
import { constructeurParametresAPI } from './api/ConstructeurParametresAPI.ts';
import { useMACAPI } from './api/useMACAPI.ts';

export const RequiertAuthentification = () => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const { setUtilisateur } = useUtilisateur();
  const [doitVerifierReconnexion, setDoitVerifierReconnexion] = useState(true);
  const [pagePrecedente, setPagePrecedente] = useState(
    window.location.pathname
  );
  const [chargementUtilisateurEnErreur, setChargementUtilisateurEnErreur] =
    useState(false);

  useEffect(() => {
    if (doitVerifierReconnexion) {
      macAPI
        .execute<ReponseUtilisateur, ReponseUtilisateur>(
          constructeurParametresAPI()
            .url('/api/utilisateur')
            .methode('GET')
            .construis(),
          (json) => json
        )
        .then((utilisateur) => {
          setUtilisateur({
            nomPrenom: utilisateur.nomPrenom,
          });
          navigationMAC.ajouteEtat(utilisateur.liens);
          setPagePrecedente(window.location.pathname);
          setChargementUtilisateurEnErreur(false);
        })
        .catch((erreur) => {
          setChargementUtilisateurEnErreur(true);
          const moteurDeLiens = new MoteurDeLiens(erreur.liens);
          moteurDeLiens.trouve('se-connecter', () =>
            navigationMAC.navigue(moteurDeLiens, 'se-connecter')
          );
        });
    }
    setDoitVerifierReconnexion(
      window.location.pathname !== pagePrecedente &&
        !chargementUtilisateurEnErreur
    );
  }, [
    navigationMAC,
    doitVerifierReconnexion,
    pagePrecedente,
    chargementUtilisateurEnErreur,
  ]);
  return <Outlet />;
};
