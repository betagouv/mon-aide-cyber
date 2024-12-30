import { Toast } from '../../../composants/communs/Toasts/Toast.tsx';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import { FormulaireAuthentification } from '../../authentification/FormulaireAuthentification.tsx';
import Button from '../../../composants/atomes/Button/Button.tsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MoteurDeLiens, ROUTE_AIDANT } from '../../MoteurDeLiens.ts';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { useEffect } from 'react';

export const FormulaireConnexion = () => {
  const navigationMAC = useNavigationMAC();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const erreursRetourPostLogin = searchParams?.get('erreurConnexion');

  useEffect(() => {
    const moteurDeLiens = new MoteurDeLiens(navigationMAC.etat);
    moteurDeLiens.trouve('valider-signature-cgu', () =>
      navigationMAC.navigue(
        `${ROUTE_AIDANT}/valide-signature-cgu`,
        navigationMAC.etat
      )
    );
  }, [navigationMAC.etat]);

  const lien = new MoteurDeLiens(navigationMAC.etat).trouveEtRenvoie(
    'se-connecter-avec-pro-connect'
  );

  return (
    <>
      <div className="texte-centre">
        <TypographieH2>Connectez-vous</TypographieH2>
      </div>
      <br />
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

          {erreursRetourPostLogin ? (
            <div>
              <Toast message={erreursRetourPostLogin} type="ERREUR" />
            </div>
          ) : null}

          <div className="texte-centre">
            <hr className="separation-agent-connect" />
          </div>
        </div>
      ) : null}

      <FormulaireAuthentification />
      <br />
      <div className="texte-centre">
        <p>Vous n’êtes pas encore Aidant MonAideCyber ?</p>
        <Button
          type="button"
          variant="link"
          onClick={() => navigate('/devenir-aidant')}
        >
          S&apos;inscrire
        </Button>
      </div>
    </>
  );
};
