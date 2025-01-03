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
import { Lien, ReponseHATEOAS } from '../../Lien.ts';
import {
  constructeurParametresAPI,
  ParametresAPI,
} from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ComposantCreationMotDePasse } from '../../../composants/mot-de-passe/ComposantCreationMotDePasse.tsx';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { useContexteNavigation } from '../../../hooks/useContexteNavigation.ts';

type CreationEspaceAidant = {
  cguSignees: boolean;
  motDePasse: string;
  confirmationMotDePasse: string;
  token: string;
};
type ProprietesFormulaireCreationEspaceAidant = {
  token: string;
};

type ProprietesComposantCreationEspaceAidant =
  ProprietesFormulaireCreationEspaceAidant & {
    macAPI: {
      execute: <REPONSE, REPONSEAPI, CORPS = void>(
        parametresAPI: ParametresAPI<CORPS>,
        transcris: (contenu: Promise<REPONSEAPI>) => Promise<REPONSE>
      ) => Promise<REPONSE>;
    };
  };

export const ComposantCreationEspaceAidant = ({
  macAPI,
  token,
}: ProprietesComposantCreationEspaceAidant) => {
  const [etatCreationEspaceAidant, envoie] = useReducer(
    reducteurCreationEspaceAidant,
    initialiseReducteur()
  );
  const [boutonValiderClique, setBoutonValiderClique] = useState(false);
  const navigationMAC = useNavigationMAC();
  const contexteNavigation = useContexteNavigation(macAPI);

  const creeEspaceAidant = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setBoutonValiderClique(true);
  }, []);

  useEffect(() => {
    contexteNavigation
      .recupereContexteNavigation({
        contexte: 'demande-devenir-aidant:finalise-creation-espace-aidant',
      })
      .then((reponse) =>
        navigationMAC.ajouteEtat((reponse as ReponseHATEOAS).liens)
      )
      .catch();
  }, []);

  useEffect(() => {
    if (
      etatCreationEspaceAidant.saisieValide() &&
      etatCreationEspaceAidant.creationEspaceAidantATransmettre
    ) {
      new MoteurDeLiens(navigationMAC.etat).trouve(
        'finalise-creation-espace-aidant',
        (lien: Lien) => {
          const parametresAPI =
            constructeurParametresAPI<CreationEspaceAidant>()
              .url(lien.url)
              .methode(lien.methode!)
              .corps({
                cguSignees: etatCreationEspaceAidant.cguSignees,
                motDePasse:
                  etatCreationEspaceAidant.motDePasse!.nouveauMotDePasse,
                confirmationMotDePasse:
                  etatCreationEspaceAidant.motDePasse!
                    .confirmationNouveauMotDePasse,
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
      );
    }
  }, [navigationMAC, etatCreationEspaceAidant, token]);

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
  token,
}: ProprietesFormulaireCreationEspaceAidant) => {
  return <ComposantCreationEspaceAidant token={token} macAPI={useMACAPI()} />;
};
