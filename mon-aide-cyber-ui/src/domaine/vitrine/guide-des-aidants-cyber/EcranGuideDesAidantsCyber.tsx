import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { useQuery } from '@tanstack/react-query';
import { Toast } from '../../../composants/communs/Toasts/Toast.tsx';
import './article-crisp.scss';
import './synchro-menu-crisp.js';
import { MenuCrispMobile } from './MenuCrispMobile.tsx';
import { ReponseArticle } from './Crisp.types.ts';
import { MenuCrispDesktop } from './MenuCrispDesktop.tsx';

export const EcranGuideDesAidantsCyber = () => {
  const macAPI = useMACAPI();

  const {
    data: articleJson,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['afficher-guide-aidant-cyber'],
    queryFn: (): Promise<ReponseArticle> =>
      macAPI.execute<ReponseArticle, ReponseArticle>(
        constructeurParametresAPI()
          .url('/api/articles/guide-aidant-cyber')
          .methode('GET')
          .construis(),
        async (reponse) => {
          const contenu = await reponse;
          return {
            ...contenu,
            tableDesMatieres: contenu.tableDesMatieres.filter(
              (e) => e.profondeur === 2
            ),
          };
        }
      ),
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
    <main role="main" className="page-crisp">
      <div className="chapeau">
        <h1 className="fr-container">{articleJson?.titre}</h1>
      </div>
      <MenuCrispMobile tableDesMatieres={articleJson?.tableDesMatieres} />
      <div className="article fr-container">
        <div className="contenu-section">
          <MenuCrispDesktop tableDesMatieres={articleJson?.tableDesMatieres} />

          <div
            className="contenu"
            dangerouslySetInnerHTML={{ __html: articleJson?.contenu || '' }}
          ></div>
        </div>
      </div>
    </main>
  );
};
