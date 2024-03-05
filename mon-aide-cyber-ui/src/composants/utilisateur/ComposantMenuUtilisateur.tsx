import { Utilisateur } from '../../domaine/authentification/Authentification.ts';
import { useCallback } from 'react';
import { useNavigationMAC, useMACAPI } from '../../fournisseurs/hooks.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useErrorBoundary } from 'react-error-boundary';

type ProprietesMenuUtilisateur = {
  utilisateur: Utilisateur;
};
export const ComposantMenuUtilisateur = ({
  utilisateur,
}: ProprietesMenuUtilisateur) => {
  const macapi = useMACAPI();
  const navigationMAC = useNavigationMAC();
  const { showBoundary } = useErrorBoundary();

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

  return (
    <div className="menu-utilisateur">
      <div className="menu-utilisateur-contenu">
        <details>
          <summary>{nomUtilisateur}</summary>
          <ul>
            <li>
              <input
                type="submit"
                onClick={deconnecter}
                value="Me Déconnecter"
              />
            </li>
          </ul>
        </details>
      </div>
    </div>
  );
};
