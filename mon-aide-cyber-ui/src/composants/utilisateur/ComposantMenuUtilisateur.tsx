import { Utilisateur } from '../../domaine/authentification/Authentification.ts';
import { useCallback } from 'react';
import { useMACAPI, useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useErrorBoundary } from 'react-error-boundary';
import { ReponseHATEOAS } from '../../domaine/Lien.ts';
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
      .then((reponse) =>
        navigationMAC.navigue(
          new MoteurDeLiens(reponse.liens),
          'afficher-accueil',
        ),
      )
      .catch((erreur) => showBoundary(erreur));
  }, [macapi, navigationMAC, showBoundary]);

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
