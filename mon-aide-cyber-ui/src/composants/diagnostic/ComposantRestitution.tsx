import { Header } from '../Header.tsx';
import { Footer } from '../Footer.tsx';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { useEntrepots } from '../../fournisseurs/hooks.ts';
import { useNavigate } from 'react-router-dom';
import { useErrorBoundary } from 'react-error-boundary';
import '../../assets/styles/_restitution.scss';
import '../../assets/styles/_commun.scss';
import {
  reducteurRestitution,
  restitutionChargee,
  rubriqueCliquee,
} from '../../domaine/diagnostic/reducteurRestitution.ts';
import { UUID } from '../../types/Types.ts';

type ProprietesComposantRestitution = {
  idDiagnostic: UUID;
};

export const ComposantRestitution = ({
  idDiagnostic,
}: ProprietesComposantRestitution) => {
  const entrepots = useEntrepots();
  const { showBoundary } = useErrorBoundary();
  const navigate = useNavigate();
  const [etatRestitution, envoie] = useReducer(reducteurRestitution, {});
  const [boutonDesactive, setBoutonDesactive] = useState<boolean>(false);

  useEffect(() => {
    entrepots
      .diagnostic()
      .restitution(idDiagnostic)
      .then((restitution) => {
        envoie(restitutionChargee(restitution));
      })
      .catch((erreur) => showBoundary(erreur));
  }, [entrepots, envoie, idDiagnostic, showBoundary]);

  const modifierLeDiagnostic = useCallback(
    () => navigate(`/diagnostic/${idDiagnostic}`),
    [idDiagnostic, navigate],
  );

  const rubriqueCliqueee = useCallback(
    (rubrique: string) => envoie(rubriqueCliquee(rubrique)),
    [envoie],
  );

  const telechargerRestitution = useCallback(() => {
    setBoutonDesactive(true);
    const action = etatRestitution.restitution?.actions.find(
      (a) => a.action === 'restituer',
    )?.types['pdf'];
    if (action) {
      return entrepots
        .diagnostic()
        .restitution(idDiagnostic, action)
        .then(() => {
          setBoutonDesactive(false);
        });
    }
  }, [entrepots, etatRestitution, idDiagnostic]);
  return (
    <>
      <Header />
      <main role="main">
        <div className="bandeau-violet fr-pt-md-4w fr-pb-md-8w">
          <div className="fr-container">
            <div className="fr-grid-row">
              <div>
                <i className="mac-icone-retour" />
                <a href="/tableau-de-bord">
                  Retour à la liste des bénéficiaires
                </a>
              </div>
            </div>
            <div className="fr-grid-row fr-pt-md-2w">
              <div className="identifiant-diagnostic">
                ID {idDiagnostic?.substring(0, 8)}
              </div>
            </div>
            <div className="fr-grid-row fr-grid-row--right">
              <div className="fr-pl-2w">
                <button
                  className={`fr-btn--icon-left fr-icon-download-line bouton-mac bouton-mac-secondaire-inverse`}
                  onClick={telechargerRestitution}
                  disabled={boutonDesactive}
                >
                  Télécharger
                </button>
              </div>
              <div className="fr-pl-2w">
                <button
                  className={`fr-btn--icon-left fr-icon-pencil-line bouton-mac bouton-mac-primaire-inverse`}
                  onClick={modifierLeDiagnostic}
                >
                  Modifier le diagnostic
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="fond-clair-mac">
          <div className="fr-container restitution">
            <div className="fr-grid-row">
              <div className="fr-col-md-3 fr-col-3">
                <nav
                  className="fr-sidemenu fr-sidemenu--sticky"
                  aria-labelledby="fr-sidemenu-title"
                >
                  <div className="fr-sidemenu__inner">
                    <div className="fr-collapse" id="fr-sidemenu-wrapper">
                      <ul className="fr-sidemenu__list">
                        <li
                          className={`fr-sidemenu__item ${
                            etatRestitution.rubrique === 'informations'
                              ? 'fr-sidemenu__item--active'
                              : ''
                          }`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#informations"
                            target="_self"
                            {...(etatRestitution.rubrique ===
                              'informations' && { 'aria-current': 'page' })}
                            onClick={() => rubriqueCliqueee('informations')}
                          >
                            Informations
                          </a>
                        </li>
                        <li
                          className={`fr-sidemenu__item ${
                            etatRestitution.rubrique === 'indicateurs'
                              ? 'fr-sidemenu__item--active'
                              : ''
                          }`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#indicateurs"
                            target="_self"
                            {...(etatRestitution.rubrique === 'indicateurs' && {
                              'aria-current': 'page',
                            })}
                            onClick={() => rubriqueCliqueee('indicateurs')}
                          >
                            Indicateurs de maturité
                          </a>
                        </li>
                        <li
                          className={`fr-sidemenu__item ${
                            etatRestitution.rubrique === 'mesures-prioritaires'
                              ? 'fr-sidemenu__item--active'
                              : ''
                          }`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#mesures-prioritaires"
                            target="_self"
                            {...(etatRestitution.rubrique ===
                              'mesures-prioritaires' && {
                              'aria-current': 'page',
                            })}
                            onClick={() =>
                              rubriqueCliqueee('mesures-prioritaires')
                            }
                          >
                            Les 6 mesures prioritaires
                          </a>
                        </li>
                        <li
                          className={`fr-sidemenu__item ${
                            etatRestitution.rubrique === 'autres-mesures'
                              ? 'fr-sidemenu__item--active'
                              : ''
                          }`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#autres-mesures"
                            target="_self"
                            {...(etatRestitution.rubrique ===
                              'autres-mesures' && { 'aria-current': 'page' })}
                            onClick={() => rubriqueCliqueee('autres-mesures')}
                          >
                            Les autres mesures
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>
              <div className="fr-col-md-9 fr-col-9 section">
                <h3>Récapitulatif</h3>
                <div
                  id="informations"
                  dangerouslySetInnerHTML={{
                    __html: etatRestitution.restitution?.informations || '',
                  }}
                ></div>
                <div
                  id="indicateurs"
                  dangerouslySetInnerHTML={{
                    __html: etatRestitution.restitution?.indicateurs || '',
                  }}
                ></div>
                <div
                  id="mesures-prioritaires"
                  dangerouslySetInnerHTML={{
                    __html:
                      etatRestitution.restitution?.mesuresPrioritaires || '',
                  }}
                ></div>
                <hr className="intersection" />
                <div className="contact-et-liens-utiles">
                  <h4>Contacts et liens utiles</h4>
                  <div className="contact-ou-lien-utile">
                    <div className="logo">
                      <img
                        src="/images/logo_acyma.svg"
                        alt="logo de Cybermalveillance"
                        className="fr-responsive-img"
                      />
                    </div>
                    <div className="titre">Cybermalveillance</div>
                    <div className="corps">
                      Pour vous aider dans vos démarches de sécurisation avec
                      des prestataires de confiance, Cybermalveillance vous
                      accompagne avec des professionnels référencés.
                    </div>
                    <div className="lien">
                      <a
                        href="https://www.cybermalveillance.gouv.fr/accompagnement"
                        target="_blank"
                        rel="noopener external noreferrer"
                      >
                        cybermalveillance.gouv.fr/accompagnement
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  id="autres-mesures"
                  dangerouslySetInnerHTML={{
                    __html: etatRestitution.restitution?.autresMesures || '',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
