import './pagination.scss';
import { CarteAidant } from '../CarteAidant';
import { TypographieH6 } from '../../../../../composants/communs/typographie/TypographieH6/TypographieH6';
import illustrationFAQFemme from '../../../../../../public/images/illustration-faq-femme.svg';
import Button from '../../../../../composants/atomes/Button/Button';
import { Link } from 'react-router-dom';
import { AutoCompletion } from '../../../../../composants/auto-completion/AutoCompletion';
import {
  Departement,
  estDepartement,
} from '../../../../gestion-demandes/departement';
import React, { useCallback, useEffect, useReducer } from 'react';
import { AidantAnnuaire } from '../../AidantAnnuaire.ts';
import { useListeAidants } from './useListeAidants.ts';
import {
  accedeALaPage,
  accedePagePrecedente,
  accedePageSuivante,
  chargeAidants,
  initialiseEtatPagination,
  reducteurPagination,
} from './reducteurPagination.ts';

const afficheUnPlurielSiMultiplesResultats = (tableau: unknown[]) => {
  return tableau && tableau.length > 1 ? 's' : '';
};

export type CartesAidant = {
  aidants: AidantAnnuaire[] | undefined;
  nombreAidants: number | undefined;
  enCoursDeChargement: boolean;
  enErreur: boolean;
  relanceLaRecherche: () => void;
};

export const CartesAidant = ({
  aidants,
  nombreAidants,
  enCoursDeChargement,
  enErreur,
  relanceLaRecherche,
}: CartesAidant) => {
  if (enCoursDeChargement) {
    return (
      <div className="cartes-aidants-messages">
        <TypographieH6>Chargement des Aidants...</TypographieH6>
      </div>
    );
  }

  if (enErreur) {
    return (
      <div className="cartes-aidants-messages">
        <img src={illustrationFAQFemme} alt="" />
        <p>Une erreur est survenue lors de la recherche d&apos;Aidants...</p>
        <Button type="button" onClick={() => relanceLaRecherche()}>
          Relancer la recherche d&apos;Aidants
        </Button>
      </div>
    );
  }

  if (!aidants || aidants?.length === 0) {
    return (
      <div className="cartes-aidants-messages">
        <img src={illustrationFAQFemme} alt="" />
        <p>
          Malheureusement, aucun résultat ne correspond à votre recherche.
          <br />
          Vous pouvez faire une nouvelle recherche dans un territoire proche du
          votre, <br /> ou bien effectuer une demande en ligne, à laquelle un
          aidant répondra !
        </p>
        <Link to="/beneficier-du-dispositif/etre-aide#formulaire-demande-aide">
          <Button type="button">Je fais une demande</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p>
        Il y a actuellement <b>{nombreAidants}</b> Aidant
        {afficheUnPlurielSiMultiplesResultats(aidants)} ayant souhaité
        apparaître publiquement dans l&apos;annuaire de MonAideCyber.
      </p>
      <div className="cartes-aidants">
        {aidants?.map((aidant) => (
          <CarteAidant key={aidant.identifiant} nomPrenom={aidant.nomPrenom} />
        ))}
      </div>
    </div>
  );
};

type TitreBouton = 'Page suivante' | 'Page précédente' | number;
const classeBoutonPagination: Map<TitreBouton, string> = new Map([
  [
    'Page précédente',
    'fr-pagination__link--prev fr-pagination__link--lg-label',
  ],
  ['Page suivante', 'fr-pagination__link--next fr-pagination__link--lg-label'],
]);

export const ListeAidants = () => {
  const {
    aidants,
    nombreAidants,
    enCoursDeChargement,
    enErreur,
    relanceLaRecherche,
    referentielDepartements,
    departementARechercher,
    selectionneDepartement,
  } = useListeAidants();
  const [etatPagination, envoie] = useReducer(
    reducteurPagination,
    initialiseEtatPagination()
  );

  useEffect(() => {
    envoie(chargeAidants(aidants || []));
  }, [aidants]);

  const pageSuivante = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    envoie(accedePageSuivante());
  }, []);

  const pagePrecedente = (e: React.MouseEvent) => {
    e.preventDefault();
    envoie(accedePagePrecedente());
  };

  const pageIndex = (e: React.MouseEvent, indexPage: number) => {
    e.preventDefault();
    envoie(accedeALaPage(indexPage));
  };

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
    <div className="layout-annuaire">
      <div className="filtres">
        <span className="titre">Où est située votre entité ?</span>
        <div className="fr-input-group">
          <AutoCompletion<Departement>
            nom="departement"
            placeholder="Sélectionnez un territoire"
            valeurSaisie={departementARechercher || ({} as Departement)}
            suggestionsInitiales={referentielDepartements}
            mappeur={(departement) => {
              return estDepartement(departement)
                ? `${departement.code} - ${departement.nom}`
                : typeof departement === 'string'
                  ? departement
                  : '';
            }}
            surSelection={(departement) => {
              selectionneDepartement(departement);
            }}
            surSaisie={(departement) => {
              selectionneDepartement(
                estDepartement(departement)
                  ? departement
                  : referentielDepartements.find((x) => x.nom === departement)!
              );
            }}
            clefsFiltrage={['code', 'nom']}
          />
        </div>
      </div>
      <div className="liste-aidants">
        <span className="titre">Aidants trouvés</span>
        <CartesAidant
          aidants={etatPagination.aidantsCourants}
          nombreAidants={nombreAidants}
          enCoursDeChargement={enCoursDeChargement}
          enErreur={enErreur}
          relanceLaRecherche={relanceLaRecherche}
        />
        <div className="pagination">
          <nav
            role="navigation"
            className="fr-pagination"
            aria-label="Pagination"
          >
            <ul className="fr-pagination__list">
              {/*<li>*/}
              {/*  <a*/}
              {/*    className="fr-pagination__link fr-pagination__link--first"*/}
              {/*    aria-disabled="true"*/}
              {/*    role="link"*/}
              {/*  >*/}
              {/*    {' '}*/}
              {/*    Première page{' '}*/}
              {/*  </a>*/}
              {/*</li>*/}
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
              {new Array(etatPagination.nombreDePages)
                .fill(0)
                .map((_, index) => {
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
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};
