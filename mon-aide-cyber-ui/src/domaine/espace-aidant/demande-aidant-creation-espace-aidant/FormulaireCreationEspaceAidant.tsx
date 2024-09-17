import { FormEvent, useCallback, useEffect, useReducer, useState } from 'react';
import {
  cguCliquees,
  creationEspaceAidantInvalidee,
  creationEspaceAidantTransmise,
  creationEspaceAidantValidee,
  initialiseReducteur,
  reducteurCreationEspaceAidant,
} from './reducteurCreationEspaceAidant.tsx';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../MoteurDeLiens.ts';
import { ReponseHATEOAS } from '../../Lien.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { macAPI } from '../../../fournisseurs/api/macAPI.ts';
import { ComposantCreationMotDePasse } from '../../../composants/mot-de-passe/ComposantCreationMotDePasse.tsx';

type CreationEspaceAidant = {
  cguSignees: boolean;
  motDePasse: string;
  confirmationMotDePasse: string;
  token: string;
};
type ProprietesComposantFormulaireCreationEspaceAidant = {
  token: string;
};
export const FormulaireCreationEspaceAidant = ({
  token,
}: ProprietesComposantFormulaireCreationEspaceAidant) => {
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
      const parametresAPI = constructeurParametresAPI<CreationEspaceAidant>()
        .url('/api/demandes/devenir-aidant/creation-espace-aidant')
        .methode('POST')
        .corps({
          cguSignees: etatCreationEspaceAidant.cguSignees,
          motDePasse: etatCreationEspaceAidant.motDePasse!.nouveauMotDePasse,
          confirmationMotDePasse:
            etatCreationEspaceAidant.motDePasse!.confirmationNouveauMotDePasse,
          token,
        })
        .construis();
      macAPI
        .execute<ReponseHATEOAS, ReponseHATEOAS, CreationEspaceAidant>(
          parametresAPI,
          async (json) => await json
        )
        .then((reponse) => {
          envoie(creationEspaceAidantTransmise());
          navigationMAC.ajouteEtat(reponse.liens);
        })
        .catch((erreur) => envoie(creationEspaceAidantInvalidee(erreur)));
    }
  }, [navigationMAC, etatCreationEspaceAidant, token]);

  const surCGUSignees = useCallback(() => {
    envoie(cguCliquees());
  }, []);

  const jeMeConnecte = useCallback(() => {
    navigationMAC.navigue(
      new MoteurDeLiens(navigationMAC.etat),
      'se-connecter'
    );
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
            <div className="fr-mt-2w">
              {etatCreationEspaceAidant.champsErreur}
            </div>
          </fieldset>
        </form>
      )}
    </>
  );
};
