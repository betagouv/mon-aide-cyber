import { FormEvent, useCallback, useEffect, useReducer, useState } from 'react';
import {
  cguCliquees,
  creationEspaceAidantValidee,
  initialiseReducteur,
  reducteurCreationEspaceAidant,
} from './reducteurCreationEspaceAidant.tsx';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { ComposantCreationMotDePasse } from '../../../composants/mot-de-passe/ComposantCreationMotDePasse.tsx';

export type CorpsFormulaireCreationEspaceAidant = {
  cguSignees: boolean;
  motDePasse: string;
  confirmationMotDePasse: string;
};

type ProprietesFormulaireCreationEspaceAidant = {
  surSoumission: (formulaire: CorpsFormulaireCreationEspaceAidant) => void;
};

type ProprietesComposantCreationEspaceAidant =
  ProprietesFormulaireCreationEspaceAidant;

export const ComposantCreationEspaceAidant = ({
  surSoumission,
}: ProprietesComposantCreationEspaceAidant) => {
  const [etatCreationEspaceAidant, envoie] = useReducer(
    reducteurCreationEspaceAidant,
    initialiseReducteur()
  );
  const [boutonValiderClique, setBoutonValiderClique] = useState(false);
  const navigationMAC = useNavigationMAC();

  const creeEspaceAidant = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setBoutonValiderClique(true);
  }, []);

  useEffect(() => {
    if (
      etatCreationEspaceAidant.saisieValide() &&
      etatCreationEspaceAidant.creationEspaceAidantATransmettre
    ) {
      surSoumission({
        cguSignees: etatCreationEspaceAidant.cguSignees,
        motDePasse: etatCreationEspaceAidant.motDePasse!.nouveauMotDePasse,
        confirmationMotDePasse:
          etatCreationEspaceAidant.motDePasse!.confirmationNouveauMotDePasse,
      });
    }
  }, [navigationMAC.etat, etatCreationEspaceAidant]);

  const surCGUSignees = useCallback(() => {
    envoie(cguCliquees());
  }, []);

  const jeMeConnecte = useCallback(() => {
    navigationMAC.navigue('/connexion', navigationMAC.etat);
  }, [navigationMAC]);

  return (
    <>
      {etatCreationEspaceAidant.demandeTransmise ? (
        <div className="section confirmation">
          <h4>Votre espace Aidant est disponible !</h4>
          <p>Cliquez sur le bouton ci-dessous pour y accéder.</p>
          <button
            className="fr-btn bouton-mac bouton-mac-primaire"
            onClick={jeMeConnecte}
          >
            Je me connecte
          </button>
        </div>
      ) : (
        <form onSubmit={creeEspaceAidant}>
          <fieldset className="fr-fieldset section">
            <div>
              <div>
                <label className="fr-label">
                  <h5>Première connexion à votre espace Aidant</h5>
                </label>
              </div>
              <div className="bienvenue">
                <p>
                  Bienvenue dans la communauté !
                  <br />
                  <br />
                  Pour finaliser la création de votre espace Aidant, vous devez
                  définir un nouveau mot de passe.
                </p>
              </div>
            </div>
            <div className="fr-fieldset__content">
              <ComposantCreationMotDePasse
                messagesErreurs={{
                  motsDePasseConfirmeDifferent:
                    'La confirmation de votre mot de passe ne correspond pas au mot de passe saisi.',
                  motsDePasseVides: 'Vous devez saisir vos mots de passe.',
                }}
                {...(boutonValiderClique && {
                  surValidation: (creationMotDePasse) => {
                    envoie(creationEspaceAidantValidee(creationMotDePasse));
                    setBoutonValiderClique(false);
                  },
                })}
              />
              <div className="fr-checkbox-group mac-radio-group">
                <input
                  type="checkbox"
                  id="cgu-aidant"
                  name="cgu-aidant"
                  onChange={surCGUSignees}
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
            <div className="fr-mt-2w">
              {etatCreationEspaceAidant.champsErreur}
            </div>
          </fieldset>
        </form>
      )}
    </>
  );
};
export const FormulaireCreationEspaceAidant = ({
  // token,
  surSoumission,
}: ProprietesFormulaireCreationEspaceAidant) => {
  return (
    <ComposantCreationEspaceAidant
      surSoumission={surSoumission}
      // token={token}
    />
  );
};
