import { ActionsPiedDePage } from '../../../composants/communs/ActionsPiedDePage';
import { FormulaireDeContact } from '../../../composants/communs/FormulaireDeContact/FormulaireDeContact';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2';
import { HeroStatistiques } from './composants/HeroStatistiques';
import './ecran-statistiques.scss';

export const EcranStatistiques = () => {
  return (
    <main role="main" className="ecran-statistiques">
      <HeroStatistiques />
      <section className="fond-clair-mac" style={{ padding: '2.5rem 0' }}>
        <div
          className="fr-container"
          style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}
        >
          <div className="statistiques trois-colonnes">
            <article className="statistique">
              <div>
                <TypographieH2 className="valeur">1145</TypographieH2>
              </div>
              <div className="description">
                <span>diagnostics effectués</span>
              </div>
            </article>
            <article className="statistique">
              <div>
                <TypographieH2 className="valeur">1312</TypographieH2>
              </div>
              <div className="description">
                <span>Aidants Cyber formés</span>
              </div>
            </article>
            <article className="statistique">
              <div>
                <TypographieH2 className="valeur">30%</TypographieH2>
              </div>

              <div className="description">
                <span>mesures prioritaires mises en oeuvre sous 3 mois</span>
              </div>
            </article>
          </div>
          <div className="statistique">Carte des diagnostics</div>
        </div>
      </section>
      <ActionsPiedDePage className="fond-clair-mac fr-pt-4w" />
      <FormulaireDeContact />
    </main>
  );
};
