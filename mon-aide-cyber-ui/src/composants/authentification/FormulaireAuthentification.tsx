import { useAuthentification } from '../../fournisseurs/hooks.ts';
import { FormEvent, useCallback, useReducer } from 'react';
import {
  authentificationInvalidee,
  identifiantSaisi,
  initialiseReducteur,
  motDePasseSaisi,
  reducteurAuthentification,
  saisieInvalidee,
} from './reducteurAuthentification.tsx';

export const FormulaireAuthentification = ({
  surAnnuler,
  surSeConnecter,
}: {
  surAnnuler: () => void;
  surSeConnecter: () => void;
}) => {
  const authentification = useAuthentification();

  const [etatAuthentification, envoie] = useReducer(reducteurAuthentification, initialiseReducteur());

  const surSaisieMoteDePasse = useCallback((motDePasse: string) => {
    envoie(motDePasseSaisi(motDePasse));
  }, []);

  const surSaisieIdentifiant = useCallback((identifiant: string) => {
    envoie(identifiantSaisi(identifiant));
  }, []);

  const connexion = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const saisieValide = etatAuthentification.saisieValide();
      if (!saisieValide) {
        envoie(saisieInvalidee());
      } else {
        authentification.authentifie(
          {
            identifiant: etatAuthentification.identifiant,
            motDePasse: etatAuthentification.motDePasse,
          },
          surSeConnecter,
          (erreur) => envoie(authentificationInvalidee(erreur)),
        );
      }
    },
    [etatAuthentification, authentification, surSeConnecter],
  );

  const erreur = etatAuthentification.erreur;
  return (
    <>
      <form onSubmit={connexion}>
        <section>
          <div>
            <fieldset className="fr-mb-5w">
              <div className={`fr-input-group ${erreur ? erreur?.identifiant?.className : ''}`}>
                <label className="fr-label" htmlFor="identifiant-connexion">
                  Votre adresse email
                </label>
                <input
                  className="fr-input"
                  type="text"
                  id={'identifiant-connexion'}
                  name="identifiant-connexion"
                  autoComplete={'email'}
                  onChange={(e) => surSaisieIdentifiant(e.target.value)}
                />
                {erreur?.identifiant?.texteExplicatif}
              </div>
              <div className={`fr-input-group ${erreur ? erreur?.motDePasse?.className : ''}`}>
                <label className="fr-label" htmlFor="mot-de-passe">
                  Votre mot de passe
                </label>
                <input
                  className="fr-input"
                  type="password"
                  role="textbox"
                  id="mot-de-passe"
                  name="mot-de-passe"
                  autoComplete={'current-password'}
                  onChange={(e) => surSaisieMoteDePasse(e.target.value)}
                />
                {erreur?.motDePasse?.texteExplicatif}
              </div>
            </fieldset>
          </div>
          <div>
            <button
              type="button"
              key="annule-connexion-aidant"
              className="fr-btn bouton-mac bouton-mac-secondaire fr-mr-2w"
              onClick={surAnnuler}
            >
              Annuler
            </button>
            <button type="submit" key="connexion-aidant" className="fr-btn bouton-mac bouton-mac-primaire">
              Se connecter
            </button>
          </div>
          <div className="fr-mt-2w">{etatAuthentification.champsErreur}</div>
        </section>
      </form>
    </>
  );
};
