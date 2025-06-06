import { Toast } from '../../../composants/communs/Toasts/Toast.tsx';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import { FormulaireAuthentification } from '../../authentification/FormulaireAuthentification.tsx';
import { useSearchParams } from 'react-router-dom';
import {
  MoteurDeLiens,
  ROUTE_MON_ESPACE_VALIDER_CGU,
} from '../../MoteurDeLiens.ts';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { useEffect } from 'react';
import { BoutonProConnect } from './BoutonProConnect.tsx';

export const FormulaireConnexion = () => {
  const navigationMAC = useNavigationMAC();

  const [searchParams] = useSearchParams();
  const erreursRetourPostLogin = searchParams?.get('erreurConnexion');

  useEffect(() => {
    const moteurDeLiens = new MoteurDeLiens(navigationMAC.etat);
    moteurDeLiens.trouve('valider-signature-cgu', () =>
      navigationMAC.navigue(
        `${ROUTE_MON_ESPACE_VALIDER_CGU}`,
        navigationMAC.etat
      )
    );
  }, [navigationMAC.etat]);

  return (
    <>
      <div className="texte-centre">
        <TypographieH2>Connectez-vous</TypographieH2>
      </div>
      <br />

      <BoutonProConnect />

      {erreursRetourPostLogin ? (
        <div>
          <Toast message={erreursRetourPostLogin} type="ERREUR" />
        </div>
      ) : null}

      <div className="texte-centre">
        <hr className="separation-agent-connect" />
      </div>

      <FormulaireAuthentification />
      <br />
      <div className="texte-centre">
        <p>
          Vous n’avez pas encore de compte ?{' '}
          <a href="/inscription">S‘inscrire</a>
        </p>
      </div>
    </>
  );
};
