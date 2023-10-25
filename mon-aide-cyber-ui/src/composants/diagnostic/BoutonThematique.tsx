import { useCallback, useEffect, useReducer } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import {
  ActionBouton,
  etapeChargee,
  etapeSuivanteCliquee,
  EtatBouton,
} from './reducteurThematiqueSuivante.ts';

type ProprietesBoutonThematique = {
  onClick: (thematique: string) => void;
  reducteur: (etat: EtatBouton, action: ActionBouton) => EtatBouton;
  thematiqueCourante: string;
  thematiques: string[];
  titre: string;
};

export const BoutonThematique = ({
  onClick,
  reducteur,
  thematiqueCourante,
  thematiques,
  titre,
}: ProprietesBoutonThematique) => {
  const [etatBouton, envoie] = useReducer(reducteur, {
    onClick,
    thematiques,
    thematiqueCourante,
    derniereThematique: false,
  });

  useEffect(() => {
    envoie(etapeChargee(thematiqueCourante, thematiques));
  }, [envoie, thematiqueCourante, thematiques]);

  const etapeSuivante = useCallback(() => {
    envoie(etapeSuivanteCliquee());
  }, [envoie]);

  return (
    <Button
      className={`bouton-mac bouton-mac-primaire ${
        etatBouton.derniereThematique ? `invisible` : `visible`
      }`}
      onClick={etapeSuivante}
    >
      {titre}
    </Button>
  );
};
