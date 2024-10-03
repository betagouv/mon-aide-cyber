import { useEffect, useState } from 'react';
import { ActionsPiedDePage } from '../../../composants/communs/ActionsPiedDePage';
import { FormulaireDeContact } from '../../../composants/communs/FormulaireDeContact/FormulaireDeContact';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2';
import { HeroStatistiques } from './composants/HeroStatistiques';
import './ecran-statistiques.scss';
import { MoteurDeLiens } from '../../MoteurDeLiens';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI';
import { useNavigationMAC } from '../../../fournisseurs/hooks';
import { Lien, ReponseHATEOAS } from '../../Lien';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI';
import { useContexteNavigation } from '../../../hooks/useContexteNavigation';

export type Statistiques = {
  nombreDiagnostics: number;
  nombreAidantsFormes: number;
  nombreSessionFamiliarisation: number;
};
export type ReponseStatistiques = Statistiques;

export const EcranStatistiques = () => {
  const macAPI = useMACAPI();
  const navigationMAC = useNavigationMAC();
  const { recupereContexteNavigation } = useContexteNavigation();

  const [enCoursDeChargement, setEnCoursDeChargement] = useState(true);
  const [statistiques, setStatistiques] = useState<Statistiques | undefined>();

  useEffect(() => {
    recupereContexteNavigation({ contexte: 'afficher-statistiques' }).then(
      (reponse) => {
        navigationMAC.ajouteEtat((reponse as ReponseHATEOAS).liens);
      }
    );
  }, []);

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'afficher-statistiques',
      (lien: Lien) => {
        if (enCoursDeChargement) {
          macAPI
            .execute<ReponseStatistiques, ReponseStatistiques>(
              constructeurParametresAPI()
                .url(lien.url)
                .methode(lien.methode!)
                .construis(),
              (reponse) => reponse
            )
            .then((reponse) => {
              setStatistiques(reponse);
            })
            .catch((erreur: ReponseHATEOAS) => {
              console.log(erreur);
            })
            .finally(() => {
              setEnCoursDeChargement(false);
            });
        }
      }
    );
  }, [navigationMAC.etat]);

  return (
    <main role="main" className="ecran-statistiques">
      <HeroStatistiques />
      <section className="fond-clair-mac" style={{ padding: '2.5rem 0' }}>
        <div
          className="fr-container"
          style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}
        >
          {!enCoursDeChargement ? (
            <div className="statistiques trois-colonnes">
              <article className="statistique">
                <div>
                  <TypographieH2 className="valeur">
                    {statistiques?.nombreDiagnostics}
                  </TypographieH2>
                </div>
                <div className="description">
                  <span>diagnostics effectués</span>
                </div>
              </article>
              <article className="statistique">
                <div>
                  <TypographieH2 className="valeur">
                    {statistiques?.nombreAidantsFormes}
                  </TypographieH2>
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
                  <span>
                    des mesures prioritaires mises en œuvre sous 3 mois
                  </span>
                </div>
              </article>
            </div>
          ) : (
            <>Chargement...</>
          )}
          <div className="statistique">Carte des diagnostics</div>
        </div>
      </section>
      <ActionsPiedDePage className="fond-clair-mac fr-pt-4w" />
      <FormulaireDeContact />
    </main>
  );
};
