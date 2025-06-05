import { MoteurDeLiens } from '../../MoteurDeLiens.ts';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';

export const BoutonProConnect = () => {
  const navigationMAC = useNavigationMAC();

  const lien = new MoteurDeLiens(navigationMAC.etat).trouveEtRenvoie(
    'se-connecter-avec-pro-connect'
  );

  return (
    <>
      {lien ? (
        <div>
          <div className="fr-connect-group texte-centre">
            <a className="fr-connect" href={lien.url}>
              <span className="fr-connect__login">S’identifier avec</span>{' '}
              <span className="fr-connect__brand">ProConnect</span>
            </a>
            <p>
              <a
                href="https://proconnect.gouv.fr/"
                target="_blank"
                rel="noopener noreferrer"
                title="Qu’est-ce que ProConnect ? - nouvelle fenêtre"
              >
                Qu’est-ce que ProConnect ?
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
};
