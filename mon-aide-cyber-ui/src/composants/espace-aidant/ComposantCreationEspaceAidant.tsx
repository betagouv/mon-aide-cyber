import { Header } from '../Header.tsx';
import { Footer } from '../Footer.tsx';
import { FormEvent, useCallback, useEffect, useReducer } from 'react';
import { useActionsUtilisateur, useMACAPI } from '../../fournisseurs/hooks.ts';
import {
  extraisLesActions,
  ReponseHATEOAS,
  trouveParmiLesLiens,
} from '../../domaine/Actions.ts';
import { useNavigate } from 'react-router-dom';
import {
  motDePasseTemporaireSaisi,
  cguCliquees,
  creationEspaceAidantInvalidee,
  creationEspaceAidantTransmise,
  creationEspaceAidantValidee,
  initialiseReducteur,
  nouveauMotDePasseConfirme,
  nouveauMotDePasseSaisi,
  reducteurCreationEspaceAidant,
} from './reducteurCreationEspaceAidant.tsx';

import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { CreationEspaceAidant } from '../../domaine/espace-aidant/EspaceAidant.ts';

export const ComposantCreationEspaceAidant = () => {
  const actions = useActionsUtilisateur();
  const [etatCreationEspaceAidant, envoie] = useReducer(
    reducteurCreationEspaceAidant,
    initialiseReducteur(),
  );
  const navigate = useNavigate();
  const macapi = useMACAPI();

  const creeEspaceAidant = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    envoie(creationEspaceAidantValidee());
  }, []);

  useEffect(() => {
    const lien = trouveParmiLesLiens(actions, 'finaliser-creation-compte');
    if (!lien) {
      navigate('/');
    }
    if (
      etatCreationEspaceAidant.saisieValide() &&
      etatCreationEspaceAidant.creationEspaceAidantATransmettre
    ) {
      const lien = trouveParmiLesLiens(actions, 'finaliser-creation-compte');
      const parametresAPI = constructeurParametresAPI<CreationEspaceAidant>()
        .url(lien.url)
        .methode(lien.methode!)
        .corps({
          cguSignees: etatCreationEspaceAidant.cguSignees,
          motDePasse: etatCreationEspaceAidant.nouveauMotDePasse,
          motDePasseTemporaire: etatCreationEspaceAidant.motDePasseTemporaire,
        })
        .construis();
      macapi
        .appelle<ReponseHATEOAS, CreationEspaceAidant>(
          parametresAPI,
          async (json) => (await json) as unknown as ReponseHATEOAS,
        )
        .then((reponse) => {
          envoie(creationEspaceAidantTransmise());
          return navigate(reponse.liens.suite.url, {
            state: extraisLesActions(reponse.liens),
          });
        })
        .catch((erreur) => envoie(creationEspaceAidantInvalidee(erreur)));
    }
  }, [actions, etatCreationEspaceAidant, macapi, navigate]);

  const surCGUSignees = useCallback(() => {
    envoie(cguCliquees());
  }, []);

  const surSaisieNouveauMotDePasse = useCallback((motDePasse: string) => {
    envoie(nouveauMotDePasseSaisi(motDePasse));
  }, []);
  const surSaisieConfirmationMotDePasse = useCallback((motDePasse: string) => {
    envoie(nouveauMotDePasseConfirme(motDePasse));
  }, []);
  const surSaisieMotDePasseTemporaire = useCallback((motDePasse: string) => {
    envoie(motDePasseTemporaireSaisi(motDePasse));
  }, []);
  return (
    <>
      <Header />
      <main role="main">
        <div className="mode-fonce fr-pt-md-6w fr-pb-md-7w">
          <div className="fr-container">
            <div className="fr-grid-row">
              <div>
                <h3>Création de votre espace Aidant MonAideCyber</h3>
                <p>Bienvenue dans la communauté !</p>
              </div>
            </div>
          </div>
        </div>
        <div className="fond-clair-mac creation-espace-aidant">
          <div className="fr-container">
            <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
              <div className="fr-col-8">
                <form onSubmit={creeEspaceAidant}>
                  <fieldset className="fr-fieldset section">
                    <div>
                      <div>
                        <label className="fr-label">
                          <h5>Création de votre espace Aidant</h5>
                        </label>
                      </div>
                      <div className="bienvenue">
                        <p>
                          Bienvenue dans la communauté !
                          <br />
                          <br />
                          Pour finaliser la création de votre espace Aidant,
                          vous devez définir un nouveau mot de passe. Le mot de
                          passe doit comporter <b>16 caractères minimum</b>,
                          dont au moins :
                          <ul>
                            <li>1 majuscule</li>
                            <li>1 minuscule</li>
                            <li>1 chiffre</li>
                            <li>
                              1 caractère spécial parmi
                              &#35;?!@&#36;&#37;^&amp;*-&apos;+_&#40;&#41;[]
                            </li>
                          </ul>
                        </p>
                      </div>
                      <div className="mac-callout mac-callout-information">
                        <i className="mac-icone-information" />
                        <div>
                          Évitez d’utiliser des mots du dictionnaire, des suites
                          de lettres, des suites de chiffres, des dates, des
                          informations personnelles (ex: nom, prénom, date de
                          naissance).
                        </div>
                      </div>
                    </div>
                    <div className="fr-fieldset__content">
                      <div className="champs-obligatoire">
                        <span className="asterisque">*</span>
                        <span> Champ obligatoire</span>
                      </div>
                      <div
                        className={`fr-input-group ${
                          etatCreationEspaceAidant.erreur
                            ? etatCreationEspaceAidant.erreur?.motDePasse
                                ?.className
                            : ''
                        }`}
                      >
                        <label className="fr-label" htmlFor="mot-de-passe">
                          <span className="asterisque">*</span>
                          <span> Saisissez votre mot de passe temporaire</span>
                        </label>
                        <input
                          className="fr-input"
                          type="password"
                          role="textbox"
                          id="ancien-mot-de-passe"
                          name="ancien-mot-de-passe"
                          autoComplete={'current-password'}
                          value={etatCreationEspaceAidant.motDePasseTemporaire}
                          onChange={(e) =>
                            surSaisieMotDePasseTemporaire(e.target.value)
                          }
                        />
                      </div>
                      <div
                        className={`fr-input-group ${
                          etatCreationEspaceAidant.erreur
                            ? etatCreationEspaceAidant.erreur?.motDePasse
                                ?.className
                            : ''
                        }`}
                      >
                        <label className="fr-label" htmlFor="mot-de-passe">
                          <span className="asterisque">*</span>
                          <span> Choisissez un nouveau mot de passe</span>
                        </label>
                        <input
                          className="fr-input"
                          type="password"
                          role="textbox"
                          id="nouveau-mot-de-passe"
                          name="nouveau-mot-de-passe"
                          autoComplete={'new-password'}
                          value={etatCreationEspaceAidant.nouveauMotDePasse}
                          onChange={(e) =>
                            surSaisieNouveauMotDePasse(e.target.value)
                          }
                        />
                      </div>
                      <div
                        className={`fr-input-group ${
                          etatCreationEspaceAidant.erreur
                            ? etatCreationEspaceAidant.erreur?.motDePasse
                                ?.className
                            : ''
                        }`}
                      >
                        <label className="fr-label" htmlFor="mot-de-passe">
                          <span className="asterisque">*</span>
                          <span> Confirmez votre nouveau mot de passe</span>
                        </label>
                        <input
                          className="fr-input"
                          type="password"
                          role="textbox"
                          id="confirmation-mot-de-passe"
                          name="confirmation-mot-de-passe"
                          autoComplete={'new-password'}
                          value={etatCreationEspaceAidant.motDePasseConfirme}
                          onChange={(e) =>
                            surSaisieConfirmationMotDePasse(e.target.value)
                          }
                        />
                        {
                          etatCreationEspaceAidant.erreur?.motDePasse
                            ?.texteExplicatif
                        }
                      </div>
                      <div className="fr-checkbox-group mac-radio-group">
                        <input
                          type="checkbox"
                          id="cgu-aidant"
                          name="cgu-aidant"
                          onClick={surCGUSignees}
                          checked={etatCreationEspaceAidant.cguSignees}
                        />
                        <label className="fr-label" htmlFor="cgu-aidant">
                          J&apos;accepte les &nbsp;
                          <b>
                            <a href="/cgu">
                              conditions générales d&apos;utilisation
                            </a>
                          </b>
                          &nbsp; de MonAideCyber
                        </label>
                        {
                          etatCreationEspaceAidant.erreur?.cguSignees
                            ?.texteExplicatif
                        }
                      </div>
                      <div className="fr-grid-row fr-grid-row--right">
                        <button
                          type="submit"
                          key="creation-espace-aidant"
                          className="fr-btn bouton-mac bouton-mac-primaire"
                        >
                          Valider
                        </button>
                      </div>
                    </div>
                    <div className="fr-mt-2w">
                      {etatCreationEspaceAidant.champsErreur}
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
