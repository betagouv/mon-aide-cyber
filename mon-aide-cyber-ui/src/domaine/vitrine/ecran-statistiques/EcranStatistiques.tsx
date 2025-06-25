import { useEffect, useState } from 'react';
import { HeroStatistiques } from './composants/HeroStatistiques';
import './ecran-statistiques.scss';
import { MoteurDeLiens } from '../../MoteurDeLiens';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI';
import { useNavigationMAC } from '../../../fournisseurs/hooks';
import { Lien, ReponseHATEOAS } from '../../Lien';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI';
import { useContexteNavigation } from '../../../hooks/useContexteNavigation';
import { useTitreDePage } from '../../../hooks/useTitreDePage.ts';

export type Statistiques = {
  metabase: string;
  nombreAidants: string;
  nombreDiagnostics: string;
  niveauDeSatisfactionDuDiagnostic: string;
};
export type ReponseStatistiques = Statistiques;

export const EcranStatistiques = () => {
  useTitreDePage('Statistiques');

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
      <section>
        <div className="fr-container statistiques">
          <div className="grille-trois-colonnes">
            <div className="carte-statistique">
              <img
                src="/images/icones/icone-statistique-nombre-aidants.svg"
                alt=""
              />
              <div className="statistique">
                <div className="valeur">{statistiques?.nombreAidants}</div>
                <div className="description">Aidants cyber</div>
              </div>
            </div>
            <div className="carte-statistique">
              <img
                src="/images/icones/icone-statistiques-satisfaction-diagnostic.svg"
                alt=""
              />
              <div className="statistique">
                <div className="valeur">
                  {statistiques?.niveauDeSatisfactionDuDiagnostic}/10
                </div>
                <div className="description">Taux de satisfaction</div>
              </div>
            </div>
            <div className="carte-statistique">
              <img
                src="/images/icones/icone-statistiques-nombre-diagnostics.svg"
                alt=""
              />
              <div className="statistique">
                <div className="valeur">{statistiques?.nombreDiagnostics}</div>
                <div className="description">Diagnostics cyber réalisés</div>
              </div>
            </div>
            <div className="carte-statistique">
              <img
                src="/images/icones/icone-statistiques-mesures-appliquees.svg"
                alt=""
              />
              <div className="statistique">
                <div className="valeur">30%</div>
                <div className="description">Mesures mises en œuvre</div>
              </div>
            </div>
          </div>
          <div className="carte ">
            <iframe src={statistiques?.metabase || ''}></iframe>
          </div>
        </div>
      </section>
    </main>
  );
};
