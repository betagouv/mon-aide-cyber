import { Footer } from '../../layout/Footer.tsx';
import '../../../assets/styles/_restitution.scss';
import '../../../assets/styles/_restitution_print.scss';
import '../../../assets/styles/_commun.scss';
import { UUID } from '../../../types/Types.ts';
import { ComposantIdentifiantDiagnostic } from '../../ComposantIdentifiantDiagnostic.tsx';
import { useComposantRestitution } from './useComposantRestitution.ts';
import { HeaderEspaceAidant } from '../../espace-aidant/HeaderEspaceAidant.tsx';
import Button from '../../atomes/Button/Button.tsx';
import { useMoteurDeLiens } from '../../../hooks/useMoteurDeLiens.ts';
import { HeaderRestitution } from './HeaderRestitution.tsx';
import { useRecupereContexteNavigation } from '../../../hooks/useRecupereContexteNavigation.ts';
import './restitution.scss';
import {
  requeteEnvoyerRestitutionEntiteAidee,
  requeteTelechargementRestitution,
  useRestitution,
} from './useRestitution.ts';
import { useToast } from '../../../fournisseurs/ToastProvider/FournisseurDeToast.tsx';

type ProprietesComposantRestitution = {
  idDiagnostic: UUID;
  type?: 'libre-acces';
};

export const ComposantRestitution = ({
  idDiagnostic,
  type,
}: ProprietesComposantRestitution) => {
  const { etatRestitution, navigueVersTableauDeBord, modifierLeDiagnostic } =
    useComposantRestitution(idDiagnostic, type === 'libre-acces');

  const toaster = useToast();

  const { accedeALaRessource: peutRetournerAuTableauDeBord } =
    useMoteurDeLiens('lancer-diagnostic');

  const { accedeALaRessource: peutEnvoyerLaRestitutionAEntiteAidee } =
    useMoteurDeLiens('envoyer-restitution-entite-aidee');

  const {
    demanderRestitution,
    enAttenteRestitution: boutonDemanderRestitutionDesactive,
  } = useRestitution<Blob>(
    requeteTelechargementRestitution(idDiagnostic, (blob) => {
      const fichier = URL.createObjectURL(blob);
      const lien = document.createElement('a');
      lien.href = fichier;
      lien.download = `restitution-${idDiagnostic}.pdf`;
      lien.click();
    })
  );

  const {
    demanderRestitution: envoyerDiagnosticAEntiteAidee,
    enAttenteRestitution: boutonEnvoyerDiagnosticAEntiteAideeDesactive,
  } = useRestitution<void>(
    requeteEnvoyerRestitutionEntiteAidee(
      idDiagnostic,
      (reponse) => toaster.success(reponse),
      (reponse) => toaster.erreur(reponse)
    )
  );

  return (
    <>
      {type === 'libre-acces' ? (
        <HeaderRestitution
          idDiagnostic={idDiagnostic}
          typeDiagnostic="libre-acces"
        />
      ) : (
        <HeaderEspaceAidant />
      )}
      <main role="main" className="restitution">
        {type !== 'libre-acces' ? (
          <div className="mode-fonce fr-pt-md-4w fr-pb-md-8w">
            <div className="fr-container">
              <div className="fr-grid-row">
                {peutRetournerAuTableauDeBord ? (
                  <div>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={navigueVersTableauDeBord}
                    >
                      <i className="mac-icone-retour" />
                      <span>Retour à la liste des diagnostics</span>
                    </Button>
                  </div>
                ) : null}
              </div>
              <div className="fr-grid-row fr-pt-md-2w">
                <div className="identifiant-diagnostic">
                  ID{' '}
                  <ComposantIdentifiantDiagnostic identifiant={idDiagnostic} />
                </div>
              </div>
              <div className="fr-grid-row fr-grid-row--right">
                <div className="fr-pl-2w">
                  <button
                    className={`fr-btn--icon-left fr-icon-pencil-line bouton-mac bouton-mac-secondaire-inverse`}
                    onClick={modifierLeDiagnostic}
                  >
                    Modifier le diagnostic
                  </button>
                </div>
                <div className="fr-pl-2w">
                  {peutEnvoyerLaRestitutionAEntiteAidee ? (
                    <Button
                      type="button"
                      variant="primary"
                      className={`bouton-mac bouton-mac-primaire-inverse`}
                      onClick={() => envoyerDiagnosticAEntiteAidee()}
                      disabled={boutonEnvoyerDiagnosticAEntiteAideeDesactive}
                    >
                      <i className="envoi-mail"></i>
                      <span>Envoyer la restitution à l’Aidé</span>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      className={`fr-btn--icon-left  fr-icon-download-line bouton-mac bouton-mac-primaire-inverse`}
                      onClick={() => demanderRestitution()}
                      disabled={boutonDemanderRestitutionDesactive}
                    >
                      Télécharger
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fr-mt-10w"></div>
        )}
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
                            Indicateurs MonAideCyber
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

export const ComposantRestitutionAidant = ({
  idDiagnostic,
}: {
  idDiagnostic: UUID;
}) => {
  return <ComposantRestitution idDiagnostic={idDiagnostic} />;
};
export const ComposantRestitutionLibreAcces = ({
  idDiagnostic,
}: {
  idDiagnostic: UUID;
}) => {
  useRecupereContexteNavigation(
    `utiliser-outil-diagnostic:afficher:${idDiagnostic}`
  );

  return (
    <ComposantRestitution idDiagnostic={idDiagnostic} type="libre-acces" />
  );
};
