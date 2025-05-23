import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { useQuery } from '@tanstack/react-query';
import { Toast } from '../../../composants/communs/Toasts/Toast.tsx';
import './article-crisp.scss';
import { MenuLateralCrispMobile } from './MenuLateralCrispMobile.tsx';
import { ReponseArticle } from './Crisp.types.ts';

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
    <main role="main" className="page-crisp">
      <div className="chapeau">
        <h1 className="fr-container">{data?.titre}</h1>
      </div>
      <MenuLateralCrispMobile
        tableDesMatieres={data?.tableDesMatieres.filter(
          (e) => e.profondeur === 2
        )}
      />
      <div className="article fr-container">
        <div className="contenu-section">
          <div className="sommaire sommaire-deplie">
            <ul>
              {data?.tableDesMatieres
                .filter((e) => e.profondeur === 2)
                .map((entree) => (
                  <li key={entree.id}>
                    <a href={`#${entree.id}`}>{entree.texte}</a>
                  </li>
                ))}
            </ul>
          </div>
          <div
            className="contenu"
            dangerouslySetInnerHTML={{ __html: data?.contenu || '' }}
          ></div>
        </div>
      </div>
    </main>
  );
};
