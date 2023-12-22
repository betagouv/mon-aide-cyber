import { useCallback, useEffect, useReducer } from 'react';
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
    <div
      className={`fr-pr-2w ${
        etatBouton.borneThematique ? `invisible` : `visible`
      }`}
    >
      <button className={`fr-btn bouton-mac ${style}`} onClick={surClick}>
        {titre}
      </button>
    </div>
  );
};
