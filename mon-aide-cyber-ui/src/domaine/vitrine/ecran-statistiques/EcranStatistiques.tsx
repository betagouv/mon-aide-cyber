import { useEffect, useState } from 'react';
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
import { useTitreDePage } from '../../../hooks/useTitreDePage.ts';

export type Statistiques = {
  metabase: string;
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
      <section className="fond-clair-mac">
        <div className="fr-container fr-pt-8w">
          <div className="carte ">
            <TypographieH3>Les statistiques MonAideCyber</TypographieH3>
            <iframe src={statistiques?.metabase || ''}></iframe>
          </div>
        </div>
      </section>
      <section className="fond-clair-mac fr-pt-4w participer">
        <div className="fr-container conteneur-participer fr-pb-8w">
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
    </main>
  );
};
