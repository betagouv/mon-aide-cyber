import { Header } from '../Header.tsx';
import { Footer } from '../Footer.tsx';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import '../../assets/styles/_restitution.scss';
import '../../assets/styles/_restitution_print.scss';
import '../../assets/styles/_commun.scss';
import {
  reducteurRestitution,
  restitutionChargee,
  rubriqueConsultee,
} from '../../domaine/diagnostic/reducteurRestitution.ts';
import { UUID } from '../../types/Types.ts';
import { Restitution } from '../../domaine/diagnostic/Restitution.ts';

import { useMACAPI, useNavigationMAC } from '../../fournisseurs/hooks.ts';

import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { Lien } from '../../domaine/Lien.ts';
import { LienMAC } from '../LienMAC.tsx';
import { ComposantIdentifiantDiagnostic } from '../ComposantIdentifiantDiagnostic.tsx';

type ProprietesComposantRestitution = {
  idDiagnostic: UUID;
};

export const ComposantRestitution = ({
  idDiagnostic,
}: ProprietesComposantRestitution) => {
  const { showBoundary } = useErrorBoundary();
  const navigationMAC = useNavigationMAC();
  const [etatRestitution, envoie] = useReducer(reducteurRestitution, {});
  const [boutonDesactive, setBoutonDesactive] = useState<boolean>(false);
  const macapi = useMACAPI();

  useEffect(() => {
    if (etatRestitution.restitution) {
      const observateurDIntersection = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const nomRubriqueConsultee = entry.target.parentElement?.id;

              nomRubriqueConsultee &&
                envoie(rubriqueConsultee(nomRubriqueConsultee));
            }
          });
        },
        {
          rootMargin: '-20% 0% -60% 0%',
        }
      );

      const titresRubriques = document.querySelectorAll('.restitution h4');

      titresRubriques.forEach((titreRubrique) =>
        observateurDIntersection.observe(titreRubrique)
      );

      return () => {
        titresRubriques.forEach((titreRubrique) =>
          observateurDIntersection.unobserve(titreRubrique)
        );
      };
    }
  }, [etatRestitution.restitution]);

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      `afficher-diagnostic-${idDiagnostic}`,
      (lien: Lien) => {
        if (!etatRestitution.restitution) {
          macapi
            .appelle<Restitution>(
              constructeurParametresAPI()
                .url(lien.url)
                .methode(lien.methode!)
                .construis(),
              async (json) => Promise.resolve((await json) as Restitution)
            )
            .then((restitution) => {
              navigationMAC.setEtat(
                new MoteurDeLiens(restitution.liens).extrais()
              );
              envoie(restitutionChargee(restitution));
            })
            .catch((erreur) => showBoundary(erreur));
        }
      }
    );
  }, [
    navigationMAC,
    envoie,
    etatRestitution,
    idDiagnostic,
    macapi,
    showBoundary,
  ]);

  useEffect(() => {
    window.addEventListener('beforeprint', () => {
      const details = document.querySelectorAll('details');
      details.forEach((d) => d.setAttribute('open', ''));
    });
  }, []);

  useEffect(() => {
    window.addEventListener('afterprint', () => {
      const details = document.querySelectorAll('details');
      details.forEach((d) => d.removeAttribute('open'));
    });
  }, []);

  const modifierLeDiagnostic = useCallback(() => {
    return navigationMAC.navigue(
      new MoteurDeLiens(etatRestitution.restitution!.liens),
      'modifier-diagnostic'
    );
  }, [etatRestitution, navigationMAC]);

  const telechargerRestitution = useCallback(() => {
    new MoteurDeLiens(etatRestitution.restitution!.liens).trouve(
      'restitution-pdf',
      (lien: Lien) => {
        const parametresAPI = constructeurParametresAPI()
          .url(lien.url)
          .methode(lien.methode!)
          .accept(lien.contentType!)
          .construis();
        macapi
          .appelle<void>(parametresAPI, (blob: Promise<Blob>) => {
            return blob.then((b) => {
              const fichier = URL.createObjectURL(b);
              const lien = document.createElement('a');
              lien.href = fichier;
              lien.download = `restitution-${idDiagnostic}.pdf`;
              lien.click();
            });
          })
          .then(() => {
            setBoutonDesactive(false);
          });
      }
    );
    setBoutonDesactive(true);
  }, [etatRestitution.restitution, idDiagnostic, macapi]);

  const navigueVersTableauDeBord = useCallback(() => {
    const liens = etatRestitution.restitution!.liens;
    const moteurDeLiens = new MoteurDeLiens(liens);
    navigationMAC.navigue(moteurDeLiens, 'lancer-diagnostic', [
      'modifier-diagnostic',
      'restitution-pdf',
      'restitution-json',
      'afficher-diagnostic',
    ]);
  }, [etatRestitution.restitution, navigationMAC]);

  return (
    <>
      <Header
        lienMAC={
          <LienMAC
            titre="Espace Aidant - MonAideCyber"
            route="/tableau-de-bord"
          />
        }
      />
      <main role="main">
        <div className="mode-fonce fr-pt-md-4w fr-pb-md-8w">
          <div className="fr-container">
            <div className="fr-grid-row">
              <div>
                <i className="mac-icone-retour" />
                <a href="#" onClick={navigueVersTableauDeBord}>
                  Retour à la liste des diagnostics
                </a>
              </div>
            </div>
            <div className="fr-grid-row fr-pt-md-2w">
              <div className="identifiant-diagnostic">
                ID <ComposantIdentifiantDiagnostic identifiant={idDiagnostic} />
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
          <div id="restitution" className="fr-container restitution">
            <div className="fr-grid-row">
              <div className="fr-col-md-3 fr-col-3 menu-restitution">
                <nav
                  className="fr-sidemenu fr-sidemenu--sticky"
                  aria-labelledby="fr-sidemenu-title"
                >
                  <div className="fr-sidemenu__inner">
                    <div className="fr-collapse" id="fr-sidemenu-wrapper">
                      <ul className="fr-sidemenu__list">
                        <li
                          className={`fr-sidemenu__item ${
                            etatRestitution.nomRubriqueConsultee ===
                            'informations'
                              ? 'fr-sidemenu__item--active'
                              : ''
                          }`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#informations"
                            target="_self"
                            {...(etatRestitution.nomRubriqueConsultee ===
                              'informations' && { 'aria-current': 'page' })}
                          >
                            Informations
                          </a>
                        </li>
                        <li
                          className={`fr-sidemenu__item ${
                            etatRestitution.nomRubriqueConsultee ===
                            'indicateurs'
                              ? 'fr-sidemenu__item--active'
                              : ''
                          }`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#indicateurs"
                            target="_self"
                            {...(etatRestitution.nomRubriqueConsultee ===
                              'indicateurs' && {
                              'aria-current': 'page',
                            })}
                          >
                            Indicateurs de maturité
                          </a>
                        </li>
                        <li
                          className={`fr-sidemenu__item ${
                            etatRestitution.nomRubriqueConsultee ===
                            'mesures-prioritaires'
                              ? 'fr-sidemenu__item--active'
                              : ''
                          }`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#mesures-prioritaires"
                            target="_self"
                            {...(etatRestitution.nomRubriqueConsultee ===
                              'mesures-prioritaires' && {
                              'aria-current': 'page',
                            })}
                          >
                            Les 6 mesures prioritaires
                          </a>
                        </li>
                        <li
                          className={`fr-sidemenu__item ${
                            etatRestitution.nomRubriqueConsultee ===
                            'contacts-liens-utiles'
                              ? 'fr-sidemenu__item--active'
                              : ''
                          }`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#contacts-liens-utiles"
                            target="_self"
                            {...(etatRestitution.nomRubriqueConsultee ===
                              'contacts-liens-utiles' && {
                              'aria-current': 'page',
                            })}
                          >
                            Contacts et liens utiles
                          </a>
                        </li>
                        <li
                          className={`fr-sidemenu__item ${
                            etatRestitution.nomRubriqueConsultee ===
                            'ressources'
                              ? 'fr-sidemenu__item--active'
                              : ''
                          }`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#ressources"
                            target="_self"
                            {...(etatRestitution.nomRubriqueConsultee ===
                              'ressources' && {
                              'aria-current': 'page',
                            })}
                          >
                            Ressources
                          </a>
                        </li>
                        <li
                          className={`fr-sidemenu__item ${
                            etatRestitution.nomRubriqueConsultee ===
                            'autres-mesures'
                              ? 'fr-sidemenu__item--active'
                              : ''
                          }`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#autres-mesures"
                            target="_self"
                            {...(etatRestitution.nomRubriqueConsultee ===
                              'autres-mesures' && { 'aria-current': 'page' })}
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
                  className="rubrique"
                  dangerouslySetInnerHTML={{
                    __html: etatRestitution.restitution?.informations || '',
                  }}
                ></div>
                <div
                  id="indicateurs"
                  className="rubrique"
                  dangerouslySetInnerHTML={{
                    __html: etatRestitution.restitution?.indicateurs || '',
                  }}
                ></div>
                <div
                  id="mesures-prioritaires"
                  className="rubrique"
                  dangerouslySetInnerHTML={{
                    __html:
                      etatRestitution.restitution?.mesuresPrioritaires || '',
                  }}
                ></div>
                <div
                  id="contacts-liens-utiles"
                  className="rubrique"
                  dangerouslySetInnerHTML={{
                    __html:
                      etatRestitution.restitution?.contactsEtLiensUtiles || '',
                  }}
                ></div>
                <div
                  id="ressources"
                  className="rubrique"
                  dangerouslySetInnerHTML={{
                    __html: etatRestitution.restitution?.ressources || '',
                  }}
                ></div>

                <div
                  id="autres-mesures"
                  className="rubrique fr-pt-md-5w"
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
