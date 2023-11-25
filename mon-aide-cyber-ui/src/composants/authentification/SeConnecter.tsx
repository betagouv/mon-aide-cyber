import React, { FormEvent, useCallback, useReducer } from 'react';
import {
  useAuthentification,
  useEntrepots,
  useModale,
} from '../../fournisseurs/hooks.ts';
import Button from '@codegouvfr/react-dsfr/Button';
import { useNavigate } from 'react-router-dom';
import {
  authentificationInvalidee,
  identifiantSaisi,
  motDePasseSaisi,
  reducteurAuthentification,
  saisieInvalidee,
} from './reducteurAuthentification.tsx';

const Authentification = ({ surFermeture }: { surFermeture: () => void }) => {
  const entrepots = useEntrepots();
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
        await entrepots
          .authentification()
          .connexion({
            identifiant: etatAuthentification.identifiant,
            motDePasse: etatAuthentification.motDePasse,
          })
          .then((utilisateur) => {
            authentification.authentifie(utilisateur);
            surFermeture();
            navigate('diagnostics');
          })
          .catch((erreur) => {
            envoie(authentificationInvalidee(erreur));
          });
      }
    },
    [
      authentification,
      entrepots,
      etatAuthentification,
      navigate,
      surFermeture,
      envoie,
    ],
  );

  return (
    <>
      <form onSubmit={connexion}>
        <section>
          <div>
            <fieldset className="fr-mb-5w">
              <div
                className={`fr-input-group ${etatAuthentification.erreur?.identifiant?.className}`}
              >
                <label className="fr-label" htmlFor="identifiant-connexion">
                  Votre adresse email
                </label>
                <input
                  className="fr-input"
                  type="text"
                  id={'identifiant-connexion'}
                  name="identifiant-connexion"
                  onChange={(e) => surSaisieIdentifiant(e.target.value)}
                />
                {etatAuthentification.erreur?.identifiant?.texteExplicatif}
              </div>
              <div
                className={`fr-input-group ${etatAuthentification.erreur?.motDePasse?.className}`}
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
                  onChange={(e) => surSaisieMoteDePasse(e.target.value)}
                />
                {etatAuthentification.erreur?.motDePasse?.texteExplicatif}
              </div>
            </fieldset>
          </div>
          <div>
            <Button
              key="annule-connexion-aidant"
              className="bouton-mac bouton-mac-secondaire"
              onClick={surFermeture}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              key="connexion-aidant"
              className="bouton-mac bouton-mac-primaire"
            >
              Se connecter
            </Button>
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
