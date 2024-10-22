import './pagination.scss';
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
import { AidantAnnuaire } from '../../../AidantAnnuaire.ts';
import { BoutonActif, BoutonInactif, BoutonsNumerotation } from './boutons.tsx';

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

  const surClickAccesPage = useCallback(
    (e: React.MouseEvent, indexPage: number) => {
      e.preventDefault();
      envoie(accedeALaPage(indexPage));
    },
    []
  );

  const accedePremierePage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    envoie(accedeALaPremierePage());
  }, []);

  const accedeDernierePage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    envoie(accedeALaDernierePage());
  }, []);

  return (
    <div className="pagination">
      <nav role="navigation" className="fr-pagination" aria-label="Pagination">
        <ul className="fr-pagination__list">
          {etatPagination.pagePrecedente ? (
            <>
              <li>
                <BoutonActif
                  titreBouton="Première page"
                  titreSurvol="Première page"
                  action={(e) => accedePremierePage(e)}
                />
              </li>
              <li>
                <BoutonActif
                  titreBouton="Page précédente"
                  titreSurvol="Page précédente"
                  action={(e) => pagePrecedente(e)}
                />
              </li>
            </>
          ) : (
            <>
              <li>
                <BoutonInactif
                  titreBouton="Première page"
                  ariaCurrent={false}
                />
              </li>
              <li>
                <BoutonInactif
                  titreBouton="Page précédente"
                  ariaCurrent={false}
                />
              </li>
            </>
          )}
          <BoutonsNumerotation
            indexations={etatPagination.indexation}
            surClick={surClickAccesPage}
          />
          {etatPagination.pageSuivante ? (
            <>
              <li>
                <BoutonActif
                  titreBouton="Page suivante"
                  titreSurvol="Page suivante"
                  action={(e) => pageSuivante(e)}
                />
              </li>
              <li>
                <BoutonActif
                  titreBouton="Dernière page"
                  titreSurvol="Dernière page"
                  action={(e) => accedeDernierePage(e)}
                />
              </li>
            </>
          ) : (
            <>
              <li>
                <BoutonInactif
                  titreBouton="Page suivante"
                  ariaCurrent={false}
                />
              </li>
              <li>
                <BoutonInactif
                  titreBouton="Dernière page"
                  ariaCurrent={false}
                />
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};
