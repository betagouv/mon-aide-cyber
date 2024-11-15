import {
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useModale, useNavigationMAC } from '../../../../fournisseurs/hooks';
import { CorpsCGU } from '../../../../vues/ComposantCGU';
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
} from '../../../../composants/gestion-demandes/devenir-aidant/reducteurDevenirAidant';
import { Departement, estDepartement } from '../../departement';
import { MoteurDeLiens } from '../../../MoteurDeLiens';
import { Lien, ReponseHATEOAS } from '../../../Lien';
import {
  CorpsDemandeDevenirAidant,
  PreRequisDemande,
  ReponseDemandeInitiee,
} from '../DevenirAidant';
import { constructeurParametresAPI } from '../../../../fournisseurs/api/ConstructeurParametresAPI';
import { ChampsErreur } from '../../../../composants/alertes/Erreurs';
import { AutoCompletion } from '../../../../composants/auto-completion/AutoCompletion';
import { TypographieH5 } from '../../../../composants/communs/typographie/TypographieH5/TypographieH5';
import { TypographieH4 } from '../../../../composants/communs/typographie/TypographieH4/TypographieH4';
import { useContexteNavigation } from '../../../../hooks/useContexteNavigation.ts';
import { MACAPIType } from '../../../../fournisseurs/api/useMACAPI.ts';

type ProprietesFormulaireDevenirAidant = {
  macAPI: MACAPIType;
};

export const FormulaireDevenirAidant = ({
  macAPI,
}: ProprietesFormulaireDevenirAidant) => {
  const navigationMAC = useNavigationMAC();
  const navigationUtilisateur = useContexteNavigation(macAPI);
  const [prerequisDemande, setPrerequisDemande] = useState<
    PreRequisDemande | undefined
  >();
  const [enCoursDeChargement, setEnCoursDeChargement] = useState(true);

  const [retourEnvoiDemandeDevenirAidant, setRetourEnvoiDemandeDevenirAidant] =
    useState<ReactElement | undefined>(undefined);

  const [etatDemande, envoie] = useReducer(
    reducteurDemandeDevenirAidant,
    initialiseDemande()
  );

  useEffect(() => {
    navigationUtilisateur
      .recupereContexteNavigation({
        contexte: 'demande-devenir-aidant:demande-devenir-aidant',
      })
      .then((reponse) =>
        navigationMAC.ajouteEtat((reponse as ReponseHATEOAS).liens)
      )
      .catch();
  }, []);

  useEffect(() => {
    if (!etatDemande.pretPourEnvoi) {
      return;
    }
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'envoyer-demande-devenir-aidant',
      (lien: Lien) => {
        macAPI
          .execute<void, void, CorpsDemandeDevenirAidant>(
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
  }, [etatDemande.pretPourEnvoi, navigationMAC.etat]);

  useEffect(() => {
    if (etatDemande.envoiReussi) window.scrollTo({ top: 0 });
  }, [etatDemande.envoiReussi]);

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'demande-devenir-aidant',
      (lien: Lien) => {
        if (enCoursDeChargement) {
          macAPI
            .execute<ReponseDemandeInitiee, ReponseDemandeInitiee>(
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
  }, [enCoursDeChargement, navigationMAC]);

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
    <div className="fr-container fr-grid-row fr-grid-row--center formulaire-devenir-aidant-layout">
      {etatDemande.envoiReussi ? (
        <div className="fr-col-md-8 fr-col-sm-12 section confirmation">
          <TypographieH4>
            Votre demande a bien été prise en compte !
          </TypographieH4>
          <p>
            Celle-ci sera traitée dans les meilleurs délais.
            <br />
            <br />
            Vous allez être mis en relation avec le délégué régional de
            l&apos;ANSSI de votre territoire, qui reviendra vers vous par mail
            pour vous indiquer la prochaine date prévue de l&apos;atelier
            Devenir Aidant.
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
            Demande d&apos;inscription à un atelier Devenir Aidant MonAideCyber
          </div>
          <div className="fr-mt-2w introduction">
            <div>
              <TypographieH5>
                Vous souhaitez devenir Aidant MonAideCyber
              </TypographieH5>
              <p>Pour devenir aidant, il est nécessaire de&nbsp;:</p>
              <ul>
                <li>
                  participer à un atelier devenir Aidant MonAideCyber animé par
                  l&apos;ANSSI
                </li>
                <li>
                  prendre connaissance de{' '}
                  <a href="/charte-aidant">la charte de l&apos;aidant</a>, qui
                  rappelle notamment le principe de gratuité du dispositif, et
                  la signer avant ou après l&apos;atelier
                </li>
                <br />
              </ul>
              <p>
                Veuillez compléter les informations ci-dessous pour être averti
                de la prochaine session prévue sur votre territoire.
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
                <div className="fr-col-12 champs">
                  <div className="fr-input-group">
                    <div
                      className={`${
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
                        onChange={(e) => surSaisiePrenom(e.target.value)}
                      />
                      {etatDemande.erreurs?.prenom?.texteExplicatif}
                    </div>
                  </div>
                </div>
                <div className="fr-col-12 champs">
                  <div className="fr-input-group">
                    <div
                      className={`${
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
                <div className="fr-col-12 champs">
                  <div className="fr-input-group">
                    <div
                      className={`${
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
                <div className="fr-col-12 champs">
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
                          Dans quel département ou DROM-COM êtes-vous situé ?
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
                      {etatDemande.erreurs?.departement?.texteExplicatif}
                    </div>
                  </div>
                </div>
                <div className="fr-col-12 champs">
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
                      onChange={surCGUValidees}
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
  );
};
