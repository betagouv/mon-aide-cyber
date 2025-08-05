import { CapteurFormulaireDemandeAutodiagnostic } from './formulaire-demande-auto-diagnostic/CapteurFormulaireDemandeAutodiagnostic.tsx';
import './ecran-demande-autodiagnostic.scss';
import illustrationAutodiag from '../../../public/images/illustration-autodiag.svg';
import { TypographieH3 } from '../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import { Link } from 'react-router-dom';
import { useDonneesSEO } from '../../hooks/useDonneesSEO.ts';
import { liensMesServicesCyber } from '../../infrastructure/mes-services-cyber/liens.ts';

export const EcranDemandeAutodiagnostic = () => {
  useDonneesSEO('Diagnostic libre accès');

  return (
    <main role="main" className="ecran-demande-autodiagnostic-layout">
      <div className="fr-container ecran-demande-autodiagnostic">
        <div className="formulaire-colonne-gauche">
          <div className="formulaire-colonne-gauche-contenu">
            <div>
              <TypographieH3 className="text-center violet-fonce">
                Utiliser l&apos;Outil de diagnostic de MonAideCyber
              </TypographieH3>
              <p>
                Pour utiliser l&apos;outil de diagnostic MonAideCyber, veuillez
                accepter les conditions générales d&apos;utilisation
              </p>
              <CapteurFormulaireDemandeAutodiagnostic />
            </div>
            <div className="text-center">
              <p>
                Vous préférez faire un diagnostic accompagné ?
                <br />
                <Link
                  to={liensMesServicesCyber().cyberDepartAvecTracking}
                  target="_blank"
                  rel="noreferrer"
                >
                  Faire une demande en ligne
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="fond-clair-mac icone-colonne-droite">
          <img
            src={illustrationAutodiag}
            alt="Une personne devant un écran d'ordinateur"
          />
        </div>
      </div>
    </main>
  );
};
