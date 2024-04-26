import { Utilisateur } from '../../domaine/authentification/Authentification.ts';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useMACAPI, useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useErrorBoundary } from 'react-error-boundary';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';

type ProprietesMenuUtilisateur = {
  utilisateur: Utilisateur;
};
export const ComposantMenuUtilisateur = ({
  utilisateur,
}: ProprietesMenuUtilisateur) => {
  const macapi = useMACAPI();
  const navigationMAC = useNavigationMAC();
  const { showBoundary } = useErrorBoundary();
  const [boutonAfficherMonProfil, setBoutonAfficherMonProfil] =
    useState<ReactElement>(<></>);
  const [boutonAfficherTableauDeBord, setBoutonAfficherTableauDeBord] =
    useState<ReactElement>(<></>);

  let nomUtilisateur = utilisateur.nomPrenom;
  if (utilisateur.nomPrenom.includes(' ')) {
    const nomPrenom = utilisateur.nomPrenom.split(' ');
    nomUtilisateur = `${nomPrenom[0]} ${nomPrenom[1].at(0)?.toUpperCase()}.`;
  }

  const deconnecter = useCallback(() => {
    macapi
      .appelle<void>(
        constructeurParametresAPI()
          .url('/api/token')
          .methode('DELETE')
          .construis(),
        (reponse) => reponse,
      )
      .then(() => navigationMAC.retourAccueil())
      .catch((erreur) => showBoundary(erreur));
  }, [macapi, navigationMAC, showBoundary]);

  const afficherProfil = useCallback(() => {
    navigationMAC.navigue(
      new MoteurDeLiens(navigationMAC.etat),
      'afficher-profil',
    );
  }, [navigationMAC]);

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'afficher-profil',
      () =>
        setBoutonAfficherMonProfil(
          <input type="button" onClick={afficherProfil} value="Mon Profil" />,
        ),
      () => setBoutonAfficherMonProfil(<></>),
    );
  }, [afficherProfil, navigationMAC.etat]);

  const afficherTableauDeBord = useCallback(() => {
    navigationMAC.navigue(
      new MoteurDeLiens(navigationMAC.etat),
      'afficher-tableau-de-bord',
    );
  }, [navigationMAC]);

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'afficher-tableau-de-bord',
      () =>
        setBoutonAfficherTableauDeBord(
          <input
            type="button"
            onClick={afficherTableauDeBord}
            value="Diagnostics"
          />,
        ),
      () => setBoutonAfficherTableauDeBord(<></>),
    );
  }, [afficherTableauDeBord, navigationMAC.etat]);

  return (
    <div className="menu-utilisateur">
      <div className="menu-utilisateur-contenu">
        <details>
          <summary>{nomUtilisateur}</summary>
          <div id="conteneur">
            {boutonAfficherTableauDeBord}
            {boutonAfficherMonProfil}
            <input type="button" onClick={deconnecter} value="Me Déconnecter" />
          </div>
        </details>
      </div>
    </div>
  );
};
