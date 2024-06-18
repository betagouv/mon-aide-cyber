import { BoutonDiagnostic } from './BoutonDiagnostic.tsx';
import {
  reducteurBoutonTerminerDiagnostic,
  thematiqueChargee,
} from './reducteurBoutonTerminerDiagnostic.ts';
import { useEffect, useReducer } from 'react';

type ProprietesBoutonTerminerDiagnostic = {
  onClick: () => void;
  style: string;
  thematiqueCourante: string;
  thematiques: string[];
};

export const TerminerDiagnostic = (
  proprietes: ProprietesBoutonTerminerDiagnostic
) => {
  const [etatBouton, envoie] = useReducer(reducteurBoutonTerminerDiagnostic, {
    derniereThematique: false,
    thematiques: proprietes.thematiques,
  });

  useEffect(() => {
    envoie(
      thematiqueChargee(proprietes.thematiqueCourante, proprietes.thematiques)
    );
  }, [proprietes.thematiqueCourante, proprietes.thematiques]);

  return (
    <BoutonDiagnostic
      style={proprietes.style}
      onClick={proprietes.onClick}
      visible={etatBouton.derniereThematique}
      titre="Terminer le diagnostic"
    />
  );
};
