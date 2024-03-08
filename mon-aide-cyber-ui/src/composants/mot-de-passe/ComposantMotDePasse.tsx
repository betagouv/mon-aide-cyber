import { useCallback, useEffect, useReducer } from 'react';
import {
  initialiseReducteur,
  ancienMotDePasseSaisi,
  nouveauMotDePasseConfirme,
  nouveauMotDePasseSaisi,
  reducteurModificationMotDePasse,
  MessagesErreurs,
  modificationMotDePasseValidee,
} from './reducteurModificationMotDePasse.tsx';

export type ModificationMotDePasse = {
  valide: boolean;
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
  confirmationNouveauMotDePasse: string;
};
type ProprieteseComposantMotDePasse = {
  messagesErreurs: MessagesErreurs;
  surValidation?: (modificationMotDePasse: ModificationMotDePasse) => void;
  titreSaisieAncienMotDePasse: string;
};

export const ComposantMotDePasse = ({
  messagesErreurs,
  surValidation,
  titreSaisieAncienMotDePasse,
}: ProprieteseComposantMotDePasse) => {
  const [etatModificationMotDePasse, envoie] = useReducer(
    reducteurModificationMotDePasse,
    initialiseReducteur(messagesErreurs),
  );

  useEffect(() => {
    if (surValidation) {
      envoie(modificationMotDePasseValidee());
      surValidation({
        ancienMotDePasse: etatModificationMotDePasse.ancienMotDePasse,
        nouveauMotDePasse: etatModificationMotDePasse.nouveauMotDePasse,
        confirmationNouveauMotDePasse:
          etatModificationMotDePasse.motDePasseConfirme,
        valide: etatModificationMotDePasse.saisieValide(),
      });
    }
  }, [etatModificationMotDePasse, surValidation]);

  const surSaisieNouveauMotDePasse = useCallback((motDePasse: string) => {
    envoie(nouveauMotDePasseSaisi(motDePasse));
  }, []);
  const surSaisieConfirmationMotDePasse = useCallback((motDePasse: string) => {
    envoie(nouveauMotDePasseConfirme(motDePasse));
  }, []);
  const surSaisieAncienMotDePasse = useCallback((motDePasse: string) => {
    envoie(ancienMotDePasseSaisi(motDePasse));
  }, []);

  return (
    <div className="mot-de-passe">
      <div>
        Le mot de passe doit comporter <b>16 caractères minimum</b>, dont au
        moins :
        <ul>
          <li>1 majuscule</li>
          <li>1 minuscule</li>
          <li>1 chiffre</li>
          <li>
            1 caractère spécial parmi
            &#35;?!@&#36;&#37;^&amp;*-&apos;+_&#40;&#41;[]
          </li>
        </ul>
      </div>
      <div className="mac-callout mac-callout-information">
        <i className="mac-icone-information" />
        <div>
          Évitez d’utiliser des mots du dictionnaire, des suites de lettres, des
          suites de chiffres, des dates, des informations personnelles (ex: nom,
          prénom, date de naissance).
        </div>
      </div>
      <div className="champs-obligatoire">
        <span className="asterisque">*</span>
        <span> Champ obligatoire</span>
      </div>
      <div
        className={`fr-input-group ${
          etatModificationMotDePasse.erreur
            ? etatModificationMotDePasse.erreur?.motDePasse?.className
            : ''
        }`}
      >
        <label className="fr-label" htmlFor="ancien-mot-de-passe">
          <span className="asterisque">*</span>
          <span> {titreSaisieAncienMotDePasse}</span>
        </label>
        <input
          className="fr-input"
          type="password"
          role="textbox"
          id="ancien-mot-de-passe"
          name="ancien-mot-de-passe"
          autoComplete={'current-password'}
          value={etatModificationMotDePasse.ancienMotDePasse}
          onChange={(e) => surSaisieAncienMotDePasse(e.target.value)}
        />
      </div>
      <div
        className={`fr-input-group ${
          etatModificationMotDePasse.erreur
            ? etatModificationMotDePasse.erreur?.motDePasse?.className
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
          value={etatModificationMotDePasse.nouveauMotDePasse}
          onChange={(e) => surSaisieNouveauMotDePasse(e.target.value)}
        />
      </div>
      <div
        className={`fr-input-group ${
          etatModificationMotDePasse.erreur
            ? etatModificationMotDePasse.erreur?.motDePasse?.className
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
          value={etatModificationMotDePasse.motDePasseConfirme}
          onChange={(e) => surSaisieConfirmationMotDePasse(e.target.value)}
        />
        {etatModificationMotDePasse.erreur?.motDePasse?.texteExplicatif}
      </div>
    </div>
  );
};
