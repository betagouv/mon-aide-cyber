import {
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { Departement } from '../../../domaine/demande-aide/Aide.ts';
import { estDepartement } from '../../demande-aide/SaisieInformations.tsx';
import {
  useMACAPI,
  useModale,
  useNavigationMAC,
} from '../../../fournisseurs/hooks.ts';
import { Header } from '../../Header.tsx';
import { LienMAC } from '../../LienMAC.tsx';
import { AutoCompletion } from '../../auto-completion/AutoCompletion.tsx';
import { Footer } from '../../Footer.tsx';
import {
  cguValidees,
  confirmation,
  initialiseDemande,
  invalideDemande,
  proposeDepartements,
  reducteurDemandeDevenirAidant,
  saisieDepartement,
  saisieMail,
  saisieNom,
  saisiPrenom,
  valideDemande,
} from './reducteurDevenirAidant.tsx';
import { MoteurDeLiens } from '../../../domaine/MoteurDeLiens.ts';
import { Lien, ReponseHATEOAS } from '../../../domaine/Lien.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ChampsErreur } from '../../alertes/Erreurs.tsx';
import { CorpsCGU } from '../../../vues/ComposantCGU.tsx';

type ReponseDemandeInitiee = ReponseHATEOAS & PreRequisDemande;

type PreRequisDemande = {
  departements: Departement[];
};

type CorpsDemandeDevenirAidant = {
  nom: string;
  prenom: string;
  mail: string;
  departement: string;
  cguValidees: boolean;
};

export const ComposantDemandeDevenirAidant = () => {
  const macAPI = useMACAPI();
  const [prerequisDemande, setPrerequisDemande] = useState<
    PreRequisDemande | undefined
  >();
  const [enCoursDeChargement, setEnCoursDeChargement] = useState(true);
  const [retourEnvoiDemandeDevenirAidant, setRetourEnvoiDemandeDevenirAidant] =
    useState<ReactElement | undefined>(undefined);
  const navigationMAC = useNavigationMAC();
  const [etatDemande, envoie] = useReducer(
    reducteurDemandeDevenirAidant,
    initialiseDemande()
  );

  useEffect(() => {
    if (!etatDemande.pretPourEnvoi) {
      return;
    }
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'envoyer-demande-devenir-aidant',
      (lien: Lien) => {
        macAPI
          .appelle(
            constructeurParametresAPI<CorpsDemandeDevenirAidant>()
              .url(lien.url)
              .methode(lien.methode!)
              .corps({
                nom: etatDemande.nom,
                prenom: etatDemande.prenom,
                mail: etatDemande.mail,
                departement: estDepartement(etatDemande.departementSaisi)
                  ? etatDemande.departementSaisi.nom
                  : etatDemande.departementSaisi,
                cguValidees: etatDemande.cguValidees,
              })
              .construis(),
            (corps) => corps
          )
          .then(() => envoie(confirmation()))
          .catch((erreur) => {
            envoie(invalideDemande());
            setRetourEnvoiDemandeDevenirAidant(
              <ChampsErreur erreur={erreur} />
            );
          });
      }
    );
  }, [etatDemande.pretPourEnvoi, macAPI, navigationMAC.etat]);

  useEffect(() => {
    if (etatDemande.envoiReussi) window.scrollTo({ top: 0 });
  }, [etatDemande.envoiReussi]);

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'demande-devenir-aidant',
      (lien: Lien) => {
        if (enCoursDeChargement) {
          macAPI
            .appelle<ReponseDemandeInitiee>(
              constructeurParametresAPI()
                .url(lien.url)
                .methode(lien.methode!)
                .construis(),
              (corps) => corps
            )
            .then((reponse) => {
              navigationMAC.ajouteEtat(reponse.liens);
              setEnCoursDeChargement(false);
              setPrerequisDemande({ departements: reponse.departements });
            });
        }
      }
    );
  }, [enCoursDeChargement, macAPI, navigationMAC]);

  useEffect(() => {
    if (prerequisDemande) {
      envoie(proposeDepartements(prerequisDemande.departements));
    }
  }, [prerequisDemande]);

  const { affiche } = useModale();
  const afficheModaleCGU = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      affiche({
        corps: <CorpsCGU />,
        taille: 'large',
      });
    },
    [affiche]
  );

  const surSaisiePrenom = useCallback((saisie: string) => {
    envoie(saisiPrenom(saisie));
  }, []);

  const surSaisieNom = useCallback((saisie: string) => {
    envoie(saisieNom(saisie));
  }, []);

  const surSaisieMail = useCallback((saisie: string) => {
    envoie(saisieMail(saisie));
  }, []);

  const surSaisieDepartement = useCallback((saisie: Departement | string) => {
    envoie(saisieDepartement(saisie));
  }, []);

  const surCGUValidees = useCallback(() => {
    envoie(cguValidees());
  }, []);
  return (
    <>
      <Header lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />} />
      <main role="main" className="demande-aide">
        <div className="mode-fonce">
          <div className="fr-container">
            <div className="fr-grid-row contenu">
              <h2>Vous souhaitez devenir Aidant MonAideCyber</h2>
              <p>
                Pour cela, il convient d&apos;effectuer une formation. Complétez
                le formulaire pour être averti de la prochaine formation prévue
                sur votre territoire !
              </p>
            </div>
          </div>
        </div>
        <div className="fond-clair-mac">
          <div className="fr-container">
            <div className="fr-grid-row fr-grid-row--center">
              {etatDemande.envoiReussi ? (
                <div
                  className="fr-col-md-8 fr-col-sm-12 section"
                  style={{ textAlign: 'center' }}
                >
                  <h4>Votre demande a bien été prise en compte !</h4>
                  <p>
                    Celle-ci sera traitée dans les meilleurs délais.
                    <br />
                    <br />
                    Vous allez être mis en relation avec le délégué régional de
                    l&apos;ANSSI de votre territoire, qui reviendra vers vous
                    par mail pour vous indiquer la prochaine date de formation
                    prévue.
                    <br />
                    <br />
                    Pensez à vérifier dans vos spams ou contactez-nous à&nbsp;
                    <a
                      href="mailto:monaidecyber@ssi.gouv.fr"
                      target="_blank"
                      rel="noreferrer"
                    >
                      monaidecyber@ssi.gouv.fr
                    </a>
                  </p>
                  <a href="/">
                    <button className="fr-btn bouton-mac bouton-mac-primaire">
                      Retour à la page d&apos;accueil
                    </button>
                  </a>
                </div>
              ) : (
                <div className="fr-col-md-8 fr-col-sm-12 section">
                  <div className="fr-mb-2w">
                    Demande d&apos;inscription à une formation MonAideCyber
                  </div>
                  <div className="fr-mt-2w">
                    <div>
                      <h5>Vous souhaitez devenir Aidant MonAideCyber</h5>
                      <p>Pour devenir aidant, il est nécessaire de&nbsp;:</p>
                      <ul>
                        <li>
                          participer à une formation animée par l&apos;ANSSI
                        </li>
                        <li>
                          prendre connaissance de la charte de l&apos;aidant,
                          qui rappelle notamment le principe de gratuité du
                          dispositif, et la signer avant ou après la formation
                        </li>
                      </ul>
                      <p>
                        Veuillez compléter les informations ci-dessous pour être
                        averti de la prochaine session de formation prévue sur
                        votre territoire.
                      </p>
                    </div>
                  </div>
                  <div className="champs-obligatoire">
                    <span className="asterisque">*</span>
                    <span> Champ obligatoire</span>
                  </div>
                  <form>
                    <fieldset className="fr-mb-5w">
                      <div className="fr-grid-row fr-grid-row--gutters">
                        <div className="fr-col-12">
                          <div className="fr-input-group">
                            <div
                              className={`fr-input-group ${
                                etatDemande.erreurs
                                  ? etatDemande.erreurs.prenom?.className
                                  : ''
                              }`}
                            >
                              <label className="fr-label" htmlFor="prenom">
                                <span className="asterisque">*</span>
                                <span> Votre prénom :</span>
                              </label>
                              <input
                                className="fr-input"
                                type="text"
                                id="prenom"
                                name="prenom"
                                placeholder="Exemple : Martin"
                                onChange={(e) =>
                                  surSaisiePrenom(e.target.value)
                                }
                              />
                              {etatDemande.erreurs?.prenom?.texteExplicatif}
                            </div>
                          </div>
                        </div>
                        <div className="fr-col-12">
                          <div className="fr-input-group">
                            <div
                              className={`fr-input-group ${
                                etatDemande.erreurs
                                  ? etatDemande.erreurs.nom?.className
                                  : ''
                              }`}
                            >
                              <label className="fr-label" htmlFor="nom">
                                <span className="asterisque">*</span>
                                <span> Votre nom :</span>
                              </label>
                              <input
                                className="fr-input"
                                type="text"
                                id="nom"
                                name="nom"
                                placeholder="Exemple : Dubois"
                                onChange={(e) => surSaisieNom(e.target.value)}
                              />
                              {etatDemande.erreurs?.nom?.texteExplicatif}
                            </div>
                          </div>
                        </div>
                        <div className="fr-col-12">
                          <div className="fr-input-group">
                            <div
                              className={`fr-input-group ${
                                etatDemande.erreurs
                                  ? etatDemande.erreurs.mail?.className
                                  : ''
                              }`}
                            >
                              <label className="fr-label" htmlFor="mail">
                                <span className="asterisque">*</span>
                                <span> Votre adresse électronique :</span>
                              </label>
                              <input
                                className="fr-input"
                                type="text"
                                id="mail"
                                name="mail"
                                placeholder="Exemple : martin@mail.com"
                                onChange={(e) => surSaisieMail(e.target.value)}
                              />
                              {etatDemande.erreurs?.mail?.texteExplicatif}
                            </div>
                          </div>
                        </div>
                        <div className="fr-col-12">
                          <div className="fr-input-group">
                            <div
                              className={`fr-input-group ${
                                etatDemande.erreurs
                                  ? etatDemande.erreurs.departement?.className
                                  : ''
                              }`}
                            >
                              <label
                                className="fr-label"
                                htmlFor="departement-drom-com"
                              >
                                <span className="asterisque">*</span>
                                <span>
                                  {' '}
                                  Dans quel département ou DROM-COM êtes-vous
                                  situé ?
                                </span>
                              </label>

                              <AutoCompletion<Departement>
                                nom="departement"
                                suggestionsInitiales={
                                  prerequisDemande?.departements || []
                                }
                                mappeur={(departement) =>
                                  estDepartement(departement)
                                    ? `${departement.code} - ${departement.nom}`
                                    : departement
                                }
                                surSelection={(departement) => {
                                  surSaisieDepartement(departement);
                                }}
                                surSaisie={(departement) => {
                                  surSaisieDepartement(departement);
                                }}
                                clefsFiltrage={['code', 'nom']}
                                valeurSaisie={
                                  etatDemande.departementSaisi as Departement
                                }
                                placeholder="Exemple : Gironde"
                              />
                              {
                                etatDemande.erreurs?.departement
                                  ?.texteExplicatif
                              }
                            </div>
                          </div>
                        </div>
                        <div className="fr-col-12">
                          <div
                            className={`fr-checkbox-group mac-radio-group ${
                              etatDemande.erreurs
                                ? etatDemande.erreurs.cguValidees?.className
                                : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="cgu-demande-devenir-aidant"
                              name="cgu-demande-devenir-aidant"
                              onClick={surCGUValidees}
                              checked={etatDemande.cguValidees}
                            />
                            <label
                              className="fr-label"
                              htmlFor="cgu-demande-devenir-aidant"
                            >
                              <div>
                                <span className="asterisque">*</span>
                                <span>
                                  {' '}
                                  J&apos;accepte les{' '}
                                  <b>
                                    <a href="#" onClick={afficheModaleCGU}>
                                      conditions générales d&apos;utilisation
                                    </a>
                                  </b>{' '}
                                  de MonAideCyber au nom de l&apos;entité que je
                                  représente
                                </span>
                              </div>
                            </label>
                            {etatDemande.erreurs?.cguValidees?.texteExplicatif}
                          </div>
                        </div>
                      </div>
                      <div className="fr-grid-row fr-grid-row--right fr-pt-3w">
                        <button
                          type="button"
                          key="envoyer-demande-devenir-aidant"
                          className="fr-btn bouton-mac bouton-mac-primaire"
                          onClick={() => envoie(valideDemande())}
                        >
                          Envoyer
                        </button>
                      </div>
                    </fieldset>
                  </form>
                  <div>{retourEnvoiDemandeDevenirAidant}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
