import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { useQuery } from '@tanstack/react-query';
import { ReponseHATEOAS } from '../../Lien.ts';
import { TypographieH1 } from '../../../composants/communs/typographie/TypographieH1/TypographieH1.tsx';
import { Toast } from '../../../composants/communs/Toasts/Toast.tsx';
import HeroBloc from '../../../composants/communs/HeroBloc.tsx';
import './ecran-guide-des-aidants-cyber.scss';
import Sidemenu from '../../../composants/communs/Sidemenu/Sidemenu.tsx';

type ReponseArticle = ReponseHATEOAS & {
  titre: string;
  contenu: string | null;
  description: string;
  tableDesMatieres: any[];
};

export const EcranGuideDesAidantsCyber = () => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();

  const { data, isPending, isError, error } = useQuery({
    enabled: new MoteurDeLiens(navigationMAC.etat).existe(
      'afficher-guide-aidant-cyber'
    ),
    queryKey: ['afficher-guide-aidant-cyber'],
    queryFn: (): Promise<ReponseArticle> => {
      const afficherGuideAidantCyber = new MoteurDeLiens(
        navigationMAC.etat
      ).trouveEtRenvoie('afficher-guide-aidant-cyber');

      if (!afficherGuideAidantCyber)
        throw new Error(
          `Une erreur est survenue lors de la récupération du guide de l’Aidant cyber`
        );

      return macAPI.execute<ReponseArticle, ReponseArticle>(
        constructeurParametresAPI()
          .url(afficherGuideAidantCyber.url)
          .methode(afficherGuideAidantCyber.methode!)
          .construis(),
        (reponse) => reponse
      );
    },
  });

  if (isPending) {
    return (
      <main role="main">
        <section>En cours de chargement…</section>
      </main>
    );
  }

  if (isError) {
    return <Toast className="w-100" type="ERREUR" message={error.message} />;
  }
  return (
    <main role="main" className="ecran-guide-des-aidants-cyber">
      <HeroBloc>
        <div className="fr-container hero-layout">
          <section>
            <TypographieH1>{data?.titre}</TypographieH1>
          </section>
        </div>
      </HeroBloc>
      <section className="fond-clair-mac">
        <div className="fr-container">
          <div className="fr-grid-row">
            <Sidemenu
              sticky={true}
              className="fr-col-12 fr-col-lg-3"
              aria-labelledby="fr-sidemenu-title"
            >
              <>
                {data?.tableDesMatieres
                  ? data.tableDesMatieres?.map(
                      (element: { texte: string; id: string }) => (
                        <Sidemenu.Link
                          key={element.id}
                          to={`#${element.id}`}
                          anchorId={element.id}
                        >
                          {element.texte}
                        </Sidemenu.Link>
                      )
                    )
                  : null}
              </>
            </Sidemenu>
            <div
              className="fr-col-12 fr-col-lg-9 section"
              dangerouslySetInnerHTML={{ __html: data?.contenu || '' }}
            />
          </div>
        </div>
      </section>
    </main>
  );
};
