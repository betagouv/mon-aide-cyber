import { HeroStatistiques } from './composants/HeroStatistiques';
import './ecran-statistiques.scss';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI';
import { useTitreDePage } from '../../../hooks/useTitreDePage.ts';
import { useQuery } from '@tanstack/react-query';
import { useMoteurDeLiens } from '../../../hooks/useMoteurDeLiens.ts';
import { useRecupereContexteNavigation } from '../../../hooks/useRecupereContexteNavigation.ts';
import Spinner from '../../../composants/atomes/Spinner.tsx';

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
  useRecupereContexteNavigation('afficher-statistiques');
  const { accedeALaRessource, ressource } = useMoteurDeLiens(
    'afficher-statistiques'
  );

  const { data: statistiques, isLoading } = useQuery({
    enabled: accedeALaRessource,
    queryKey: ['recupere-statistiques'],
    queryFn: (): Promise<Statistiques> => {
      return macAPI.execute<ReponseStatistiques, ReponseStatistiques>(
        constructeurParametresAPI()
          .url(ressource.url)
          .methode(ressource.methode!)
          .construis(),
        (reponse) => reponse
      );
    },
  });

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
                <div className="valeur">
                  {isLoading ? <Spinner /> : statistiques?.nombreAidants}
                </div>
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
                  {isLoading ? (
                    <Spinner />
                  ) : statistiques ? (
                    statistiques.niveauDeSatisfactionDuDiagnostic + '/10'
                  ) : (
                    ''
                  )}
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
                <div className="valeur">
                  {isLoading ? <Spinner /> : statistiques?.nombreDiagnostics}
                </div>
                <div className="description">Diagnostics cyber réalisés</div>
              </div>
            </div>
            <div className="carte-statistique">
              <img
                src="/images/icones/icone-statistiques-mesures-appliquees.svg"
                alt=""
              />
              <div className="statistique">
                <div className="valeur">{isLoading ? <Spinner /> : '30%'}</div>
                <div className="description">Mesures mises en œuvre</div>
              </div>
            </div>
          </div>
          <div className="carte">
            <iframe src={statistiques?.metabase || ''}></iframe>
          </div>
        </div>
      </section>
    </main>
  );
};
