import HeroBloc from '../../../../composants/communs/HeroBloc.tsx';
import { TypographieH1 } from '../../../../composants/communs/typographie/TypographieH1/TypographieH1.tsx';
import { Link } from 'react-router-dom';
import duoAidants from '../../../../../public/images/illustration-deux-personnes.svg';

export const HeroRealiserDesDiagnosticsAnssi = () => {
  return (
    <HeroBloc>
      <div id="corps" className="fr-container hero-layout">
        <section>
          <TypographieH1>Réaliser des diagnostics ANSSI</TypographieH1>
          <p>
            Clef-en-main et pédagogique, MonAideCyber a été pensée pour rendre
            la cybersécurité accessible à toutes les entités. À l’issue d’un
            diagnostic d’environ une heure que vous animez, six mesures de
            sécurité concrètes et priorisées sont proposées.
          </p>
          <div>
            <Link to="#formulaire-formation">
              <button
                type="button"
                className="bouton-mac bouton-mac-primaire-inverse"
              >
                Je réalise des diagnostics
              </button>
            </Link>
          </div>
        </section>
        <section>
          <img
            src={duoAidants}
            alt="illustration de deux personnes de face bras croisés et souriants"
          />
        </section>
      </div>
    </HeroBloc>
  );
};
