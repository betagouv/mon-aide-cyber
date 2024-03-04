import { Header } from '../Header.tsx';
import { Footer } from '../Footer.tsx';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import '../../assets/styles/_restitution.scss';
import '../../assets/styles/_commun.scss';
import {
  reducteurRestitution,
  restitutionChargee,
  rubriqueCliquee,
} from '../../domaine/diagnostic/reducteurRestitution.ts';
import { UUID } from '../../types/Types.ts';
import { Restitution } from '../../domaine/diagnostic/Restitution.ts';

import {
  useContexteNavigationMAC,
  useMACAPI,
  useNavigationMAC,
} from '../../fournisseurs/hooks.ts';

import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';

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
  const contexteNavigationMAC = useContexteNavigationMAC();

  useEffect(() => {
    if (!etatRestitution.restitution) {
      macapi
        .appelle<Restitution>(
          constructeurParametresAPI()
            .url(`/api/diagnostic/${idDiagnostic}/restitution`)
            .methode('GET')
            .construis(),
          async (json) => Promise.resolve((await json) as Restitution),
        )
        .then((restitution) => {
          contexteNavigationMAC.setEtat(
            new MoteurDeLiens(restitution.liens).extrais(),
          );
          envoie(restitutionChargee(restitution));
        })
        .catch((erreur) => showBoundary(erreur));
    }
  }, [
    contexteNavigationMAC,
    envoie,
    etatRestitution,
    idDiagnostic,
    macapi,
    showBoundary,
  ]);

  const modifierLeDiagnostic = useCallback(() => {
    return navigationMAC.navigue(
      new MoteurDeLiens(etatRestitution.restitution!.liens),
      'modifier-diagnostic',
    );
  }, [etatRestitution, navigationMAC]);

  const rubriqueCliqueee = useCallback(
    (rubrique: string) => envoie(rubriqueCliquee(rubrique)),
    [envoie],
  );

  const telechargerRestitution = useCallback(() => {
    const restitutionPdf = new MoteurDeLiens(
      etatRestitution.restitution!.liens,
    ).trouve('restitution-pdf');
    setBoutonDesactive(true);
    if (restitutionPdf) {
      const parametresAPI = constructeurParametresAPI()
        .url(restitutionPdf.url)
        .methode(restitutionPdf.methode!)
        .accept(restitutionPdf.contentType!)
        .construis();
      macapi
        .appelle<Window>(
          parametresAPI,
          async (blob) => window.open(URL.createObjectURL(await blob))!,
        )
        .then(() => {
          setBoutonDesactive(false);
        });
    }
  }, [etatRestitution.restitution, macapi]);

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
      <Header />
      <main role="main">
        <div className="mode-fonce fr-pt-md-4w fr-pb-md-8w">
          <div className="fr-container">
            <div className="fr-grid-row">
              <div>
                <i className="mac-icone-retour" />
                <a href="#" onClick={navigueVersTableauDeBord}>
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
                            etatRestitution.rubrique ===
                            'contacts-et-liens-utiles'
                              ? 'fr-sidemenu__item--active'
                              : ''
                          }`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#contacts-et-liens-utiles"
                            target="_self"
                            {...(etatRestitution.rubrique ===
                              'contacts-et-liens-utiles' && {
                              'aria-current': 'page',
                            })}
                            onClick={() =>
                              rubriqueCliqueee('contacts-et-liens-utiles')
                            }
                          >
                            Contacts et liens utiles
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
                <div id="contacts-et-liens-utiles-conteneur">
                  <h4>Contacts et liens utiles</h4>
                  <div id="contacts-et-liens-utiles">
                    <div className="contact-ou-lien-utile">
                      <div className="logo">
                        <img
                          src="/images/logo_acyma.svg"
                          alt="logo de Cybermalveillance"
                          className="fr-responsive-img"
                        />
                      </div>
                      <div className="titre">Cybermalveillance.gouv.fr</div>
                      <div className="corps">
                        Pour vous aider dans vos démarches de sécurisation avec
                        des prestataires de confiance, Cybermalveillance.gouv.fr
                        vous met en relation avec des professionnels labellisés
                        ExpertCyber.
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
                    <div className="contact-ou-lien-utile">
                      <div className="logos">
                        <img
                          src="/images/logo_anssi.png"
                          alt="logo de l'ANSSI"
                          className="fr-responsive-img"
                        />
                      </div>
                      <div className="titre">L&apos;ANSSI</div>
                      <div className="corps">
                        L’Agence nationale de la sécurité des systèmes
                        d’informations. Son action pour la protection de la
                        Nation face aux cyberattaques se traduit en quatre
                        grandes missions : défendre, connaître, partager,
                        accompagner.
                      </div>
                      <div className="lien">
                        <a
                          href="https://cyber.gouv.fr/"
                          target="_blank"
                          rel="noopener external noreferrer"
                        >
                          cyber.gouv.fr/
                        </a>
                      </div>
                    </div>
                    <div className="contact-ou-lien-utile">
                      <div className="logos">
                        <img
                          src="/images/logo_republique_française.png"
                          alt="logo et devise la République française"
                          className="fr-responsive-img"
                        />
                        <img
                          src="/images/logo_gendarmerie_nationale.svg"
                          alt="logo de la gendarmerie nationale"
                          className="fr-responsive-img"
                        />
                        <img
                          src="/images/logo_police_nationale.svg"
                          alt="logo de la police nationale"
                          className="fr-responsive-img"
                        />
                      </div>
                      <div className="titre">
                        Ma sécurité, service de l&apos;État
                      </div>
                      <div className="corps">
                        La gendarmerie et la police nationales vous accompagnent
                        dans vos démarches de sécurité cyber.
                      </div>
                      <div className="lien">
                        <a
                          href="https://www.masecurite.interieur.gouv.fr/fr"
                          target="_blank"
                          rel="noopener external noreferrer"
                        >
                          masecurite.interieur.gouv.fr/fr
                        </a>
                      </div>
                    </div>
                    <div className="contact-ou-lien-utile">
                      <div className="titre">La charte de L&apos;aidant</div>
                      <div className="corps">
                        <p>
                          Vous avez effectué un diagnostic Mon Aide Cyber auprès
                          d’un Aidant. Ce dernier doit respecter des règles,
                          établies dans une charte.
                        </p>
                        <p>
                          Le diagnostic MonAideCyber est une démarche gratuite
                          et bénévole. Aucune proposition commerciale ne peut
                          être établie à l’initiative de l’aidant ayant réalisé
                          le diagnostic sauf s’il s’agit d’une demande de
                          l’entité aidée, de sa propre initiative et en dehors
                          du cadre de la démarche MonAideCyber.
                        </p>
                        <p>
                          Il vous est possible à tout moment de prendre contact
                          auprès d’un agent de l’ANSSI pour remonter toute
                          problématique et/ou écart de conduite de l’aidant
                          constaté via le mail suivant :{' '}
                          <a href="mailto:monaidecyber@ssi.gouv.fr">
                            monaidecyber@ssi.gouv.fr
                          </a>
                          .
                        </p>
                        <p>
                          L’Aidant observe un devoir de confidentialité des
                          échanges avec vous, et fait preuve de discrétion
                          professionnelle de tous les faits et informations dont
                          il a pris connaissance.
                        </p>{' '}
                        <br />
                        Pour accéder à la charte de l’Aidant :
                      </div>
                      <div className="lien">
                        <a
                          href="https://monaidecyber.ssi.gouv.fr/charte-aidant"
                          target="_blank"
                          rel="noopener external noreferrer"
                        >
                          monaidecyber.ssi.gouv.fr/charte-aidant
                        </a>
                      </div>
                    </div>
                    <div className="contact-ou-lien-utile">
                      <div className="logos">
                        <img
                          src="/images/logo_mac.svg"
                          alt="logo de Mon Aide Cyber"
                          className="fr-responsive-img"
                        />
                      </div>
                      <div className="titre">L&apos;équipe MonAideCyber</div>
                      <div className="corps">
                        Si vous avez des remarques, des questions ou des
                        remontées suite à votre diagnostic à partager, toute
                        l’équipe de MonAideCyber se tient à votre écoute !
                      </div>
                      <div className="lien">
                        <a href="mailto:monaidecyber@ssi.gouv.fr">
                          monaidecyber@ssi.gouv.fr
                        </a>
                      </div>
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
