import { Utilisateur } from '../../domaine/authentification/Authentification.ts';
import { useCallback } from 'react';
import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useErrorBoundary } from 'react-error-boundary';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { macAPI } from '../../fournisseurs/api/macAPI.ts';
import { useMoteurDeLiens } from '../../hooks/useMoteurDeLiens.ts';

type ProprietesMenuUtilisateur = {
  utilisateur: Utilisateur;
};
export const ComposantMenuUtilisateur = ({
  utilisateur,
}: ProprietesMenuUtilisateur) => {
  const navigationMAC = useNavigationMAC();
  const { showBoundary, resetBoundary } = useErrorBoundary();

  let nomUtilisateur = utilisateur.nomPrenom;
  if (utilisateur.nomPrenom.includes(' ')) {
    const nomPrenom = utilisateur.nomPrenom.split(' ');
    nomUtilisateur = `${nomPrenom[0]} ${nomPrenom[1].at(0)?.toUpperCase()}.`;
  }

  const deconnecter = useCallback(() => {
    resetBoundary();
    macAPI
      .execute<void, void>(
        constructeurParametresAPI()
          .url('/api/token')
          .methode('DELETE')
          .construis(),
        (reponse) => reponse
      )
      .then(() => navigationMAC.retourAccueil())
      .catch((erreur) => showBoundary(erreur));
  }, [navigationMAC, resetBoundary, showBoundary]);

  const afficherProfil = useCallback(() => {
    resetBoundary();
    navigationMAC.navigue(
      new MoteurDeLiens(navigationMAC.etat),
      'afficher-profil'
    );
  }, [navigationMAC, resetBoundary]);

  const { accedeALaRessource: peutAfficherTableauDeBord } = useMoteurDeLiens(
    'afficher-tableau-de-bord'
  );
  const { accedeALaRessource: peutAfficherLeProfil } =
    useMoteurDeLiens('afficher-profil');

  const afficherTableauDeBord = useCallback(() => {
    resetBoundary();
    navigationMAC.navigue(
      new MoteurDeLiens(navigationMAC.etat),
      'afficher-tableau-de-bord'
    );
  }, [navigationMAC, resetBoundary]);

  return (
    <div className="menu-utilisateur">
      <div className="menu-utilisateur-contenu">
        <details>
          <summary>
            <button type="button">{nomUtilisateur}</button>
          </summary>
          <div id="conteneur">
            {peutAfficherTableauDeBord ? (
              <input
                type="button"
                onClick={afficherTableauDeBord}
                value="Mes diagnostics"
              />
            ) : null}
            {peutAfficherLeProfil ? (
              <input
                type="button"
                onClick={afficherProfil}
                value="Mon Profil"
              />
            ) : null}
            <input type="button" onClick={deconnecter} value="Me Déconnecter" />
          </div>
        </details>
      </div>
    </div>
  );
};
