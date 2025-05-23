import { useEffect } from 'react';
import { ReponseArticle } from './Crisp.types.ts';
import { MenuCrispMobile } from './MenuCrispMobile.tsx';
import { MenuCrispDesktop } from './MenuCrispDesktop.tsx';
import './article-crisp.scss';
import useDefilementFluide from '../../hooks/useDefilementFluide.ts';

const synchroniseMenuEtContenu = () => {
  const observateurDIntersection = new IntersectionObserver(
    (entries) => {
      entries.forEach((section) => {
        const titreDeLaSection = section.target.querySelector('h2');
        const lesLiens = document.querySelectorAll(
          `.sommaire ul li a[href='#${titreDeLaSection!.id}']`
        );

        if (!lesLiens) return;

        if (section.isIntersecting)
          lesLiens.forEach((l) => l.parentElement!.classList.add('actif'));
        else
          lesLiens.forEach((l) => l.parentElement!.classList.remove('actif'));
      });
    },
    { rootMargin: '-30% 0% -62% 0%' }
  );

  const lesSections = document.querySelectorAll('.contenu section');
  lesSections.forEach((s) => observateurDIntersection.observe(s));
  return () =>
    lesSections.forEach((s) => observateurDIntersection.unobserve(s));
};

export function ArticleCrisp(props: { article: ReponseArticle }) {
  useDefilementFluide();
  useEffect(() => synchroniseMenuEtContenu(), []);

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
