import { Utilisateur } from '../../domaine/authentification/Authentification.ts';
import { useCallback } from 'react';
import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useErrorBoundary } from 'react-error-boundary';
import {
  MoteurDeLiens,
  ROUTE_MON_ESPACE,
  ROUTE_MON_ESPACE_VALIDER_CGU,
} from '../../domaine/MoteurDeLiens.ts';
import { useMACAPI } from '../../fournisseurs/api/useMACAPI.ts';
import { useMoteurDeLiens } from '../../hooks/useMoteurDeLiens.ts';

type ProprietesMenuUtilisateur = {
  utilisateur: Utilisateur;
};
export const ComposantMenuUtilisateur = ({
  utilisateur,
}: ProprietesMenuUtilisateur) => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const { showBoundary, resetBoundary } = useErrorBoundary();

  const { accedeALaRessource, ressource } = useMoteurDeLiens('se-deconnecter');

  let nomUtilisateur = utilisateur.nomPrenom;
  if (utilisateur.nomPrenom.includes(' ')) {
    const nomPrenom = utilisateur.nomPrenom.split(' ');
    nomUtilisateur = `${nomPrenom[0]} ${nomPrenom[1].at(0)?.toUpperCase()}.`;
  }

  const afficherProfil = useCallback(() => {
    resetBoundary();
    if (new MoteurDeLiens(navigationMAC.etat).existe('afficher-profil')) {
      navigationMAC.navigue(
        `${ROUTE_MON_ESPACE}/mes-informations`,
        navigationMAC.etat
      );
    }
    if (new MoteurDeLiens(navigationMAC.etat).existe('valider-signature-cgu')) {
      navigationMAC.navigue(
        `${ROUTE_MON_ESPACE_VALIDER_CGU}`,
        navigationMAC.etat
      );
    }
  }, [navigationMAC, resetBoundary]);

  const deconnecter = useCallback(() => {
    resetBoundary();
    if (!accedeALaRessource) return;

    macAPI
      .execute<void, void>(
        constructeurParametresAPI()
          .url(ressource.url)
          .methode(ressource.methode!)
          .construis(),
        (reponse) => reponse
      )
      .then(() => window.location.replace('/connexion'))
      .catch((erreur) => showBoundary(erreur));
  }, [navigationMAC.etat, resetBoundary, showBoundary]);

  const boutonSeDeconnecter =
    ressource && ressource.typeAppel === 'DIRECT' ? (
      <a className="fr-btn entete-lien-se-connecter" href={ressource.url}>
        <span className="fr-icon-logout-box-r-line" aria-hidden="true"></span>
        <div>Se déconnecter</div>
      </a>
    ) : (
      <div className="fr-btn entete-lien-se-connecter" onClick={deconnecter}>
        <span className="fr-icon-logout-box-r-line" aria-hidden="true"></span>
        <div>Se déconnecter</div>
      </div>
    );
  return (
    <div className="fr-ml-1w">
      <div className="fr-btn entete-lien-se-connecter" onClick={afficherProfil}>
        <span className="fr-icon-user-line" aria-hidden="true"></span>
        <span>{nomUtilisateur}</span>
      </div>
      {boutonSeDeconnecter}
    </div>
  );
};
