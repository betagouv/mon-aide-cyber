import React, { FormEvent, useCallback, useState } from 'react';
import {
  useAuthentification,
  useEntrepots,
  useModale,
} from '../../fournisseurs/hooks.ts';
import Button from '@codegouvfr/react-dsfr/Button';
import { useNavigate } from 'react-router-dom';

const Authentification = ({ surFermeture }: { surFermeture: () => void }) => {
  const entrepots = useEntrepots();
  const authentification = useAuthentification();
  const navigate = useNavigate();

  const [motDePasse, setMotDePasse] = useState('');

  const [identifiant, setIdentifiant] = useState('');

  const surSaisieMoteDePasse = useCallback(
    (motDePasse: string) => {
      setMotDePasse(motDePasse);
    },
    [setMotDePasse],
  );

  const surSaisieIdentifiant = useCallback(
    (identifiant: string) => {
      setIdentifiant(identifiant);
    },
    [setIdentifiant],
  );

  const connexion = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      await entrepots
        .authentification()
        .connexion({
          identifiant,
          motDePasse,
        })
        .then((utilisateur) => {
          authentification.authentifie(utilisateur);
          surFermeture();
          navigate('diagnostics');
        });
    },
    [
      authentification,
      entrepots,
      identifiant,
      motDePasse,
      navigate,
      surFermeture,
    ],
  );

  return (
    <>
      <form onSubmit={connexion}>
        <section>
          <div>
            <fieldset className="fr-mb-5w">
              <label className="fr-label" htmlFor="identifiant-connexion">
                Votre adresse email
              </label>
              <input
                className="fr-input"
                type="text"
                id="identifiant-connexion"
                name="identifiant-connexion"
                onChange={(e) => surSaisieIdentifiant(e.target.value)}
              />
              <label className="fr-label" htmlFor="mot-de-passe">
                Votre mot de passe
              </label>
              <input
                className="fr-input"
                type="password"
                id="mot-de-passe"
                name="mot-de-passe"
                onChange={(e) => surSaisieMoteDePasse(e.target.value)}
              />
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
