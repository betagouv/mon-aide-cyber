import { Utilisateur } from '../../domaine/authentification/Authentification.ts';
import { useCallback, useEffect, useState } from 'react';
import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useErrorBoundary } from 'react-error-boundary';
import { MoteurDeLiens, ROUTE_AIDANT } from '../../domaine/MoteurDeLiens.ts';
import { useMACAPI } from '../../fournisseurs/api/useMACAPI.ts';
import { Lien } from '../../domaine/Lien.ts';

type ProprietesMenuUtilisateur = {
  utilisateur: Utilisateur;
};
export const ComposantMenuUtilisateur = ({
  utilisateur,
}: ProprietesMenuUtilisateur) => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const { showBoundary, resetBoundary } = useErrorBoundary();
  const [lienDeconnexion, setLienDeconnexion] = useState<Lien | undefined>();

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'se-deconnecter',
      (lien) => setLienDeconnexion(lien),
      () => setLienDeconnexion(undefined)
    );
  }, [navigationMAC]);

  let nomUtilisateur = utilisateur.nomPrenom;
  if (utilisateur.nomPrenom.includes(' ')) {
    const nomPrenom = utilisateur.nomPrenom.split(' ');
    nomUtilisateur = `${nomPrenom[0]} ${nomPrenom[1].at(0)?.toUpperCase()}.`;
  }

  const afficherProfil = useCallback(() => {
    resetBoundary();
    if (new MoteurDeLiens(navigationMAC.etat).existe('afficher-profil')) {
      navigationMAC.navigue(
        `${ROUTE_AIDANT}/mes-informations`,
        navigationMAC.etat
      );
    }
    if (new MoteurDeLiens(navigationMAC.etat).existe('valider-signature-cgu')) {
      navigationMAC.navigue(
        `${ROUTE_AIDANT}/valide-signature-cgu`,
        navigationMAC.etat
      );
    }
  }, [navigationMAC, resetBoundary]);

  const deconnecter = useCallback(() => {
    resetBoundary();
    if (lienDeconnexion) {
      macAPI
        .execute<void, void>(
          constructeurParametresAPI()
            .url(lienDeconnexion.url)
            .methode(lienDeconnexion.methode!)
            .construis(),
          (reponse) => reponse
        )
        .then(() => window.location.replace('/connexion'))
        .catch((erreur) => showBoundary(erreur));
    }
  }, [navigationMAC, resetBoundary, showBoundary]);

  const boutonSeDeconnecter =
    lienDeconnexion && lienDeconnexion.typeAppel === 'DIRECT' ? (
      <a className="element" href={lienDeconnexion.url}>
        <span className="fr-icon-logout-box-r-line" aria-hidden="true"></span>
        <div>Se déconnecter</div>
      </a>
    ) : (
      <div className="element" onClick={deconnecter}>
        <span className="fr-icon-logout-box-r-line" aria-hidden="true"></span>
        <div>Se déconnecter</div>
      </div>
    );
  return (
    <div className="menu-utilisateur">
      <div className="element" onClick={afficherProfil}>
        <span className="fr-icon-user-line" aria-hidden="true"></span>
        <span>{nomUtilisateur}</span>
      </div>
      {boutonSeDeconnecter}
    </div>
  );
};
