import { useQuery } from '@tanstack/react-query';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { Toast } from '../../../composants/communs/Toasts/Toast.tsx';
import { ReponseArticle } from '../../crisp/Crisp.types.ts';
import { ArticleCrisp } from '../../crisp/ArticleCrisp.tsx';

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

  return <ArticleCrisp article={articleJson} />;
};
