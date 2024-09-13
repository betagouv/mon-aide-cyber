import { useCallback, useEffect, useReducer } from 'react';
import {
  initialiseReducteur,
  MessagesErreurs,
  creationMotDePasseValidee,
  nouveauMotDePasseConfirme,
  nouveauMotDePasseSaisi,
  reducteurCreationMotDePasse,
  reinitialiseLeReducteur,
} from './reducteurCreationMotDePasse.tsx';

export type CreationMotDePasse = {
  valide: boolean;
  nouveauMotDePasse: string;
  confirmationNouveauMotDePasse: string;
};
type ProprieteseComposantMotDePasse = {
  messagesErreurs: MessagesErreurs;
  reinitialise?: () => void;
  surValidation?: (creationMotDePasse: CreationMotDePasse) => void;
};
export const ComposantCreationMotDePasse = ({
  messagesErreurs,
  reinitialise,
  surValidation,
}: ProprieteseComposantMotDePasse) => {
  const [etatCreationMotDePasse, envoie] = useReducer(
    reducteurCreationMotDePasse,
    initialiseReducteur(messagesErreurs)
  );

  useEffect(() => {
    if (surValidation) {
      envoie(creationMotDePasseValidee());
      surValidation({
        nouveauMotDePasse: etatCreationMotDePasse.nouveauMotDePasse,
        confirmationNouveauMotDePasse:
          etatCreationMotDePasse.motDePasseConfirme,
        valide: etatCreationMotDePasse.saisieValide(),
      });
    }
  }, [etatCreationMotDePasse, surValidation]);

  useEffect(() => {
    if (reinitialise) {
      envoie(reinitialiseLeReducteur());
    }
  }, [reinitialise]);

  const surSaisieNouveauMotDePasse = useCallback((motDePasse: string) => {
    envoie(nouveauMotDePasseSaisi(motDePasse));
  }, []);
  const surSaisieConfirmationMotDePasse = useCallback((motDePasse: string) => {
    envoie(nouveauMotDePasseConfirme(motDePasse));
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
          etatCreationMotDePasse.erreur
            ? etatCreationMotDePasse.erreur?.motDePasse?.className
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
          value={etatCreationMotDePasse.nouveauMotDePasse}
          onChange={(e) => surSaisieNouveauMotDePasse(e.target.value)}
        />
      </div>
      <div
        className={`fr-input-group ${
          etatCreationMotDePasse.erreur
            ? etatCreationMotDePasse.erreur?.motDePasse?.className
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
          value={etatCreationMotDePasse.motDePasseConfirme}
          onChange={(e) => surSaisieConfirmationMotDePasse(e.target.value)}
        />
        {etatCreationMotDePasse.erreur?.motDePasse?.texteExplicatif}
      </div>
    </div>
  );
};
