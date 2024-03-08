import { FormEvent, useCallback, useEffect, useReducer } from 'react';
import {
  cguCliquees,
  creationEspaceAidantInvalidee,
  creationEspaceAidantTransmise,
  creationEspaceAidantValidee,
  initialiseReducteur,
  motDePasseTemporaireSaisi,
  nouveauMotDePasseConfirme,
  nouveauMotDePasseSaisi,
  reducteurCreationEspaceAidant,
} from './reducteurCreationEspaceAidant.tsx';
import { useMACAPI, useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { CreationEspaceAidant } from '../../domaine/espace-aidant/EspaceAidant.ts';
import { ReponseHATEOAS } from '../../domaine/Lien.ts';

export const ComposantFormulaireCreationEspaceAidant = () => {
  const [etatCreationEspaceAidant, envoie] = useReducer(
    reducteurCreationEspaceAidant,
    initialiseReducteur(),
  );
  const navigationMAC = useNavigationMAC();
  const macapi = useMACAPI();

  const creeEspaceAidant = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    envoie(creationEspaceAidantValidee());
  }, []);

  useEffect(() => {
    const moteurDeLiens = new MoteurDeLiens(navigationMAC.etat);
    const lien = moteurDeLiens.trouve('creer-espace-aidant');
    if (!lien) {
      navigationMAC.navigue(moteurDeLiens, 'lancer-diagnostic');
    }
    if (
      etatCreationEspaceAidant.saisieValide() &&
      etatCreationEspaceAidant.creationEspaceAidantATransmettre
    ) {
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
          navigationMAC.navigue(
            new MoteurDeLiens(reponse.liens),
            'lancer-diagnostic',
            ['creer-espace-aidant'],
          );
        })
        .catch((erreur) => envoie(creationEspaceAidantInvalidee(erreur)));
    }
  }, [navigationMAC, etatCreationEspaceAidant, macapi]);

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
              Pour finaliser la création de votre espace Aidant, vous devez
              définir un nouveau mot de passe. Le mot de passe doit comporter{' '}
              <b>16 caractères minimum</b>, dont au moins :
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
              Évitez d’utiliser des mots du dictionnaire, des suites de lettres,
              des suites de chiffres, des dates, des informations personnelles
              (ex: nom, prénom, date de naissance).
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
                ? etatCreationEspaceAidant.erreur?.motDePasse?.className
                : ''
            }`}
          >
            <label className="fr-label" htmlFor="ancien-mot-de-passe">
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
              onChange={(e) => surSaisieMotDePasseTemporaire(e.target.value)}
            />
          </div>
          <div
            className={`fr-input-group ${
              etatCreationEspaceAidant.erreur
                ? etatCreationEspaceAidant.erreur?.motDePasse?.className
                : ''
            }`}
          >
            <label className="fr-label" htmlFor="nouveau-mot-de-passe">
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
              onChange={(e) => surSaisieNouveauMotDePasse(e.target.value)}
            />
          </div>
          <div
            className={`fr-input-group ${
              etatCreationEspaceAidant.erreur
                ? etatCreationEspaceAidant.erreur?.motDePasse?.className
                : ''
            }`}
          >
            <label className="fr-label" htmlFor="confirmation-mot-de-passe">
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
              onChange={(e) => surSaisieConfirmationMotDePasse(e.target.value)}
            />
            {etatCreationEspaceAidant.erreur?.motDePasse?.texteExplicatif}
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
                <a href="/cgu">conditions générales d&apos;utilisation</a>
              </b>
              &nbsp; de MonAideCyber
            </label>
            {etatCreationEspaceAidant.erreur?.cguSignees?.texteExplicatif}
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
        <div className="fr-mt-2w">{etatCreationEspaceAidant.champsErreur}</div>
      </fieldset>
    </form>
  );
};
