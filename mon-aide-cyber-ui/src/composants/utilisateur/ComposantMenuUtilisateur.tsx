import { Utilisateur } from '../../domaine/authentification/Authentification.ts';
import { useCallback } from 'react';
import { useMACAPI } from '../../fournisseurs/hooks.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ReponseHATEOAS } from '../../domaine/Actions.ts';
import { useNavigate } from 'react-router-dom';
import { useErrorBoundary } from 'react-error-boundary';

type ProprietesMenuUtilisateur = {
  utilisateur: Utilisateur;
};
export const ComposantMenuUtilisateur = ({
  utilisateur,
}: ProprietesMenuUtilisateur) => {
  const macapi = useMACAPI();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

  let nomUtilisateur = utilisateur.nomPrenom;
  if (utilisateur.nomPrenom.includes(' ')) {
    const nomPrenom = utilisateur.nomPrenom.split(' ');
    nomUtilisateur = `${nomPrenom[0]} ${nomPrenom[1].at(0)?.toUpperCase()}.`;
  }

  const deconnecter = useCallback(() => {
    macapi
      .appelle<ReponseHATEOAS>(
        constructeurParametresAPI()
          .url('/api/token/')
          .methode('DELETE')
          .construis(),
        async (reponse) => await reponse,
      )
      .then((reponse) => navigate(reponse.liens.suite.url))
      .catch((erreur) => showBoundary(erreur));
  }, [macapi, navigate, showBoundary]);

  return (
    <div className="menu-utilisateur">
      <div className="menu-utilisateur-contenu">
        <details>
          <summary>{nomUtilisateur}</summary>
          <ul>
            <li>
              <form onSubmit={deconnecter}>
                <input type="submit" value="Me Déconnecter" />
              </form>
            </li>
          </ul>
        </details>
      </div>
    </div>
  );
};
