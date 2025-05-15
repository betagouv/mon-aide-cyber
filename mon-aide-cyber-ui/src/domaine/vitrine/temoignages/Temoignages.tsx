import { PropsWithChildren, useState } from 'react';
import { TypographieH5 } from '../../../composants/communs/typographie/TypographieH5/TypographieH5.tsx';

export type Verbatim = {
  id: number;
  auteur: string;
  commentaire: string;
};

export const Temoignage = ({
  children,
  ...proprietesRestantes
}: PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
  return <div {...proprietesRestantes}>{children}</div>;
};

export const Temoignages = ({
  verbatims,
  ...proprietes
}: PropsWithChildren<
  React.HTMLAttributes<HTMLElement> & { verbatims: Verbatim[] }
>) => {
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const { className } = proprietes;
  const [nombreElementsParPage, setNombreElementsParPage] = useState(2);

  mobileQuery.onchange = (e) => {
    if (e.matches) {
      setNombreElementsParPage(1);
    } else {
      setNombreElementsParPage(2);
    }
  };

  const nombreDePagesDeVerbatims = Math.round(
    verbatims.length / nombreElementsParPage
  );

  const [page, setPage] = useState(0);

  const verbatimsSelectionnes = verbatims.slice(
    page * nombreElementsParPage,
    page * nombreElementsParPage + nombreElementsParPage
  );

  const pagePrecedente = () => {
    if (page === 0) return;
    setPage((prev) => prev - 1);
  };

  const pageSuivante = () => {
    if (page + 1 === nombreDePagesDeVerbatims) return;
    setPage((prev) => prev + 1);
  };

  if (!verbatims || verbatims.length === 0) return null;

  return (
    <section className={`${className} w-100`}>
      <div className="fr-container temoignages-layout">
        <TypographieH5>Témoignages de nos Aidants</TypographieH5>
        <div className="temoignages-liste">
          {verbatimsSelectionnes?.map((v) => (
            <Temoignage key={v.id} className="flex flex-column">
              <div className="temoignage-contenu">
                <img src="/images/Quotes.svg" alt="Icone de guillements" />
                <p>{v.commentaire}</p>
              </div>
              <span className="temoignage-auteur">{v.auteur}</span>
            </Temoignage>
          ))}
        </div>
        <div className="temoignages-boutons-pagination">
          <button
            disabled={page === 0}
            className="bouton-mac bouton-mac-secondaire"
            onClick={pagePrecedente}
          >
            <span className="fr-icon-arrow-left-line"></span>
            <span className="temoignages-bouton-pagination-texte">
              Témoignages précédents
            </span>
          </button>
          <button
            disabled={nombreDePagesDeVerbatims === page + 1}
            className="bouton-mac bouton-mac-secondaire"
            onClick={pageSuivante}
          >
            <span className="temoignages-bouton-pagination-texte">
              Témoignages suivants
            </span>
            <span className="fr-icon-arrow-right-line"></span>
          </button>
        </div>
      </div>
    </section>
  );
};
