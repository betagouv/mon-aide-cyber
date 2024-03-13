import React, { useCallback } from 'react';
import { useModale } from '../../fournisseurs/hooks.ts';
import { FormulaireAuthentification } from './FormulaireAuthentification.tsx';

export const SeConnecter = () => {
  const { affiche, ferme } = useModale();

  const afficheModaleConnexion = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      affiche({
        titre: 'Connectez vous',
        corps: (
          <FormulaireAuthentification
            surAnnuler={ferme}
            surSeConnecter={ferme}
          />
        ),
      });
    },
    [affiche, ferme],
  );

  return (
    <a
      href="/"
      className="violet-fonce"
      onClick={(event) => afficheModaleConnexion(event)}
    >
      Se connecter
    </a>
  );
};
