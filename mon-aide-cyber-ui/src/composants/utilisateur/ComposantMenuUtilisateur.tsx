import { Utilisateur } from '../../domaine/authentification/Authentification.ts';
import { useCallback } from 'react';
import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useErrorBoundary } from 'react-error-boundary';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { useMACAPI } from '../../fournisseurs/api/useMACAPI.ts';

type ProprietesMenuUtilisateur = {
  utilisateur: Utilisateur;
};
export const ComposantMenuUtilisateur = ({
  utilisateur,
}: ProprietesMenuUtilisateur) => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const { showBoundary, resetBoundary } = useErrorBoundary();

  let nomUtilisateur = utilisateur.nomPrenom;
  if (utilisateur.nomPrenom.includes(' ')) {
    const nomPrenom = utilisateur.nomPrenom.split(' ');
    nomUtilisateur = `${nomPrenom[0]} ${nomPrenom[1].at(0)?.toUpperCase()}.`;
  }

  const afficherProfil = useCallback(() => {
    resetBoundary();
    navigationMAC.navigue(
      new MoteurDeLiens(navigationMAC.etat),
      'afficher-profil'
    );
  }, [navigationMAC, resetBoundary]);

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
      .then(() => window.location.replace('/connexion'))
      .catch((erreur) => showBoundary(erreur));
  }, [navigationMAC, resetBoundary, showBoundary]);

  return (
    <div className="menu-utilisateur">
      <div className="element" onClick={afficherProfil}>
        <span className="fr-icon-user-line" aria-hidden="true"></span>
        <span>{nomUtilisateur}</span>
      </div>
      <div className="element" onClick={deconnecter}>
        <span className="fr-icon-logout-box-r-line" aria-hidden="true"></span>
        <div>Se déconnecter</div>
      </div>
    </div>
  );
};
