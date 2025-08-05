import { useQuery } from '@tanstack/react-query';
import { useMACAPI } from '../../fournisseurs/api/useMACAPI.ts';
import { ReponseArticle } from './Crisp.types.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { Alerte } from '../../composants/communs/messages/Alerte.tsx';
import { ArticleCrisp } from './ArticleCrisp.tsx';
import { Titres, useDonneesSEO } from '../../hooks/useDonneesSEO.ts';

export const PageCrisp = ({
  idArticle,
  titre,
}: {
  idArticle: string;
  titre: Titres;
}) => {
  useDonneesSEO(titre);
  const macAPI = useMACAPI();

  const {
    data: articleJson,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['afficher-page-crisp'],
    queryFn: (): Promise<ReponseArticle> =>
      macAPI.execute<ReponseArticle, ReponseArticle>(
        constructeurParametresAPI()
          .url(`/api/articles/${idArticle}`)
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
    return <Alerte className="w-100" type="ERREUR" message={error.message} />;
  }

  return <ArticleCrisp article={articleJson} />;
};
