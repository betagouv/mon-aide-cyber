import { useEffect, useState } from 'react';
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
import { TypographieH3 } from '../../../composants/communs/typographie/TypographieH3/TypographieH3';
import TuileActionDemandeAide from '../../../composants/communs/tuiles/TuileActionDemandeAide';
import TuileActionKitDeCommunication from '../../../composants/communs/tuiles/TuileActionKitDeCommunication';

export type Statistiques = {
  nombreDiagnostics: number;
  nombreAidantsFormes: number;
  nombreSessionFamiliarisation: number;
  metabase: string;
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
                  <span>Aidants Cyber référencés</span>
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
          <div className="carte">
            <TypographieH3>
              Répartition des diagnostics par territoire
            </TypographieH3>
            <iframe src={statistiques?.metabase || ''}></iframe>
          </div>
        </div>
      </section>
      <section className="fond-clair-mac fr-pt-4w participer">
        <div className="fr-container conteneur-participer">
          <div className="fr-col-12">
            <TypographieH2>Vous souhaitez participer ?</TypographieH2>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-6">
              <TuileActionDemandeAide />
            </div>
            <div className="fr-col-12 fr-col-md-6">
              <TuileActionKitDeCommunication />
            </div>
          </div>
        </div>
      </section>
      <FormulaireDeContact />
    </main>
  );
};
