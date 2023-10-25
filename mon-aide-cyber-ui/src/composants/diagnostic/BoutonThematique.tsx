import { useCallback, useEffect, useReducer } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import {
  ActionBouton,
  thematiqueChargee,
  boutonThematiqueCliquee,
  EtatBouton,
} from './reducteurBoutonThematique.ts';

type ProprietesBoutonThematique = {
  onClick: (thematique: string) => void;
  reducteur: (etat: EtatBouton, action: ActionBouton) => EtatBouton;
  style: string;
  thematiqueCourante: string;
  thematiques: string[];
  titre: string;
};

export const BoutonThematique = ({
  onClick,
  reducteur,
  style,
  thematiqueCourante,
  thematiques,
  titre,
}: ProprietesBoutonThematique) => {
  const [etatBouton, envoie] = useReducer(reducteur, {
    onClick,
    thematiques,
    thematiqueCourante,
    borneThematique: false,
  });

  useEffect(() => {
    envoie(thematiqueChargee(thematiqueCourante, thematiques));
  }, [envoie, thematiqueCourante, thematiques]);

  const surClick = useCallback(() => {
    envoie(boutonThematiqueCliquee());
  }, [envoie]);

  return (
    <Button
      className={`bouton-mac ${style} ${
        etatBouton.borneThematique ? `invisible` : `visible`
      }`}
      onClick={surClick}
    >
      {titre}
    </Button>
  );
};
