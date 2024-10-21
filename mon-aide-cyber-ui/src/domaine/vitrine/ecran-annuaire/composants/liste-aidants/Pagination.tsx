import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import {
  accedeALaDernierePage,
  accedeALaPage,
  accedeALaPremierePage,
  accedePagePrecedente,
  accedePageSuivante,
  chargeAidants,
  initialiseEtatPagination,
  reducteurPagination,
} from './reducteurPagination.ts';
import { AidantAnnuaire } from '../../AidantAnnuaire.ts';

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
type ProprietesPagination = {
  elements: AidantAnnuaire[];
  surClick: (elements: AidantAnnuaire[]) => void;
};
export const Pagination = ({
  elements,
  surClick,
}: PropsWithChildren<ProprietesPagination>) => {
  const [etatPagination, envoie] = useReducer(
    reducteurPagination,
    initialiseEtatPagination()
  );

  useEffect(() => {
    envoie(chargeAidants(elements || []));
  }, [elements]);

  useEffect(() => {
    surClick(etatPagination.aidantsCourants);
  }, [etatPagination.aidantsCourants, surClick]);

  const pageSuivante = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    envoie(accedePageSuivante());
  }, []);

  const pagePrecedente = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    envoie(accedePagePrecedente());
  }, []);

  const pageIndex = useCallback((e: React.MouseEvent, indexPage: number) => {
    e.preventDefault();
    envoie(accedeALaPage(indexPage));
  }, []);

  const accedePremierePage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    envoie(accedeALaPremierePage());
  }, []);

  const accedeDernierePage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    envoie(accedeALaDernierePage());
  }, []);

  const boutonActif = (proprietesBouton: {
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
  const boutonInactif = (proprietesBouton: {
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

  return (
    <div className="pagination">
      <nav role="navigation" className="fr-pagination" aria-label="Pagination">
        <ul className="fr-pagination__list">
          <li>
            {etatPagination.pagePrecedente
              ? boutonActif({
                  titreBouton: 'Première page',
                  titreSurvol: 'Première page',
                  action: (e) => accedePremierePage(e),
                })
              : boutonInactif({
                  titreBouton: 'Première page',
                  ariaCurrent: false,
                })}
          </li>
          <li>
            {etatPagination.pagePrecedente
              ? boutonActif({
                  titreBouton: 'Page précédente',
                  titreSurvol: 'Page précédente',
                  action: (e) => pagePrecedente(e),
                })
              : boutonInactif({
                  titreBouton: 'Page précédente',
                  ariaCurrent: false,
                })}
          </li>
          {new Array(etatPagination.nombreDePages).fill(0).map((_, index) => {
            if (etatPagination.page === index + 1) {
              return (
                <li key={`pagination-index-${index}`}>
                  {boutonInactif({
                    titreBouton: index + 1,
                    ariaCurrent: true,
                  })}
                </li>
              );
            }
            return (
              <li key={`pagination-index-${index}`}>
                {boutonActif({
                  titreBouton: index + 1,
                  titreSurvol: `Page ${index + 1}`,
                  action: (e) => pageIndex(e, index + 1),
                })}
              </li>
            );
          })}
          <li>
            {etatPagination.pageSuivante
              ? boutonActif({
                  titreBouton: 'Page suivante',
                  titreSurvol: 'Page suivante',
                  action: (e) => pageSuivante(e),
                })
              : boutonInactif({
                  titreBouton: 'Page suivante',
                  ariaCurrent: false,
                })}
          </li>
          <li>
            {etatPagination.pageSuivante
              ? boutonActif({
                  titreBouton: 'Dernière page',
                  titreSurvol: 'Dernière page',
                  action: (e) => accedeDernierePage(e),
                })
              : boutonInactif({
                  titreBouton: 'Dernière page',
                  ariaCurrent: false,
                })}
          </li>
        </ul>
      </nav>
    </div>
  );
};
