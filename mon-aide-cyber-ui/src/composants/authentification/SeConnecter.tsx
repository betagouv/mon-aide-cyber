import React, { FormEvent, useCallback, useReducer } from 'react';
import { useAuthentification, useModale } from '../../fournisseurs/hooks.ts';
import { useNavigate } from 'react-router-dom';
import {
  authentificationInvalidee,
  identifiantSaisi,
  motDePasseSaisi,
  reducteurAuthentification,
  saisieInvalidee,
} from './reducteurAuthentification.tsx';
import { extraisLesActions } from '../../domaine/Actions.ts';

const Authentification = ({ surFermeture }: { surFermeture: () => void }) => {
  const authentification = useAuthentification();
  const navigate = useNavigate();

  const [etatAuthentification, envoie] = useReducer(reducteurAuthentification, {
    identifiant: '',
    motDePasse: '',
    champsErreur: <></>,
    saisieValide: () => false,
  });

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
        try {
          const reponse = await authentification.authentifie({
            identifiant: etatAuthentification.identifiant,
            motDePasse: etatAuthentification.motDePasse,
          });
          surFermeture();
          navigate(reponse.liens.suite.url, {
            state: {
              ...extraisLesActions(reponse.liens),
            },
          });
        } catch (erreur) {
          envoie(authentificationInvalidee(erreur as Error));
        }
      }
    },
    [authentification, etatAuthentification, navigate, surFermeture, envoie],
  );

  const erreur = etatAuthentification.erreur;
  return (
    <>
      <form onSubmit={connexion}>
        <section>
          <div>
            <fieldset className="fr-mb-5w">
              <div
                className={`fr-input-group ${
                  erreur ? erreur?.identifiant?.className : ''
                }`}
              >
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
              <div
                className={`fr-input-group ${
                  erreur ? erreur?.motDePasse?.className : ''
                }`}
              >
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
              onClick={surFermeture}
            >
              Annuler
            </button>
            <button
              type="submit"
              key="connexion-aidant"
              className="fr-btn bouton-mac bouton-mac-primaire"
            >
              Se connecter
            </button>
          </div>
          <div className="fr-mt-2w">{etatAuthentification.champsErreur}</div>
        </section>
      </form>
    </>
  );
};
export const SeConnecter = () => {
  const { affiche, ferme } = useModale();

  const afficheModaleConnexion = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      affiche({
        titre: 'Connectez vous',
        corps: <Authentification surFermeture={ferme} />,
      });
    },
    [affiche, ferme],
  );

  return (
    <a href="/" onClick={(event) => afficheModaleConnexion(event)}>
      Se connecter
    </a>
  );
};
