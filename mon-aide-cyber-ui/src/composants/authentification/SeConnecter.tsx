import React, { useCallback } from 'react';
import { useModale } from '../../fournisseurs/FournisseurModale.ts';
import { Authentification } from './Authentification.tsx';
import Button from '@codegouvfr/react-dsfr/Button';

export const SeConnecter = () => {
  const { affiche, ferme } = useModale();

  const annuleConnexion = useCallback(() => {
    ferme();
  }, [ferme]);

  const connexion = useCallback(() => {
    console.log('CONNECTE');
  }, []);

  const afficheModaleConnexion = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    affiche({
      titre: 'Connectez vous',
      corps: <Authentification />,
      actions: [
        <Button
          key="annule-connexion-aidant"
          className="bouton-mac bouton-mac-secondaire"
          onClick={() => annuleConnexion()}
        >
          Annuler
        </Button>,
        <Button
          key="connexion-aidant"
          className="bouton-mac bouton-mac-primaire"
          onClick={() => connexion()}
        >
          Se connecter
        </Button>,
      ],
    });
  };

  return (
    <a href="/" onClick={(event) => afficheModaleConnexion(event)}>
      Se connecter
    </a>
  );
};
