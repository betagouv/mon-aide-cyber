import React from 'react';
import { Indexation } from './reducteurPagination.ts';

type TitreBouton =
  | 'Page suivante'
  | 'Page précédente'
  | 'Première page'
  | 'Dernière page'
  | number;
const classeBoutonPagination: Map<TitreBouton, string> = new Map([
  [
    'Page précédente',
    'fr-pagination__link--prev fr-pagination__link--lg-label',
  ],
  ['Page suivante', 'fr-pagination__link--next fr-pagination__link--lg-label'],
  ['Première page', 'fr-pagination__link--first'],
  ['Dernière page', 'fr-pagination__link--last'],
]);
export const BoutonActif = (proprietesBouton: {
  titreBouton: TitreBouton;
  titreSurvol: string;
  action: (e: React.MouseEvent) => void;
}) => (
  <a
    href="#"
    className={`fr-pagination__link  ${classeBoutonPagination.get(proprietesBouton.titreBouton) || ''}`}
    onClick={proprietesBouton.action}
    aria-disabled={false}
    title={`${proprietesBouton.titreSurvol}`}
  >
    {' '}
    {proprietesBouton.titreBouton}{' '}
  </a>
);
export const BoutonInactif = (proprietesBouton: {
  titreBouton: TitreBouton;
  ariaCurrent: boolean;
}) => (
  <a
    className={`fr-pagination__link ${classeBoutonPagination.get(proprietesBouton.titreBouton) || ''}`}
    aria-disabled={true}
    aria-current={proprietesBouton.ariaCurrent}
  >
    {' '}
    {proprietesBouton.titreBouton}{' '}
  </a>
);
export const BoutonsNumerotation = ({
  indexations,
  surClick,
}: {
  indexations: Indexation[];
  surClick: (e: React.MouseEvent, indexPage: number) => void;
}) => {
  return indexations.map((indexation) => {
    if (indexation.pageCourante) {
      return (
        <li key={`pagination-index-${indexation.indexPage}`}>
          <BoutonInactif
            titreBouton={indexation.indexPage}
            ariaCurrent={true}
          />
        </li>
      );
    }
    if (indexation.pageIntermediaire) {
      return (
        <li key={`pagination-index-intermediare`}>
          <a className="fr-pagination__link fr-displayed-lg">…</a>
        </li>
      );
    }
    return (
      <li key={`pagination-index-${indexation.indexPage}`}>
        <BoutonActif
          titreBouton={indexation.indexPage}
          titreSurvol={`Page ${indexation.indexPage}`}
          action={(e) => surClick(e, indexation.indexPage)}
        />
      </li>
    );
  });
};
