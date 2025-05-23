import { ReponseArticle } from './Crisp.types.ts';
import { MenuCrispMobile } from './MenuCrispMobile.tsx';
import { MenuCrispDesktop } from './MenuCrispDesktop.tsx';
import './article-crisp.scss';
import './synchro-menu-crisp.js';

export function ArticleCrisp(props: { article: ReponseArticle }) {
  return (
    <main role="main" className="page-crisp">
      <div className="chapeau">
        <h1 className="fr-container">{props.article?.titre}</h1>
      </div>
      <MenuCrispMobile tableDesMatieres={props.article?.tableDesMatieres} />
      <div className="article fr-container">
        <div className="contenu-section">
          <MenuCrispDesktop
            tableDesMatieres={props.article?.tableDesMatieres}
          />

          <div
            className="contenu"
            dangerouslySetInnerHTML={{
              __html: props.article?.contenu || '',
            }}
          ></div>
        </div>
      </div>
    </main>
  );
}
