import { useCallback, useEffect, useReducer } from 'react';
import {
  ActionBouton,
  boutonThematiqueCliquee,
  EtatBouton,
  thematiqueChargee,
} from './reducteurBoutonThematique.ts';
import { BoutonDiagnostic } from './BoutonDiagnostic.tsx';

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
    <BoutonDiagnostic
      visible={!etatBouton.borneThematique}
      style={style}
      onClick={surClick}
      titre={titre}
    />
  );
};
