import { ReactElement } from 'react';

export type ClasseErreurInputGroup = 'fr-input-group--error';
type ProprietesTexteExplicatif = {
  id: string;
  texte: string;
};
export const TexteExplicatif = (proprietes: ProprietesTexteExplicatif) => {
  return (
    <p id={proprietes.id} className="fr-error-text">
      {proprietes.texte}
    </p>
  );
};
export const ChampsErreur = ({ erreur }: { erreur: Error }) => {
  return (
    <div className="fr-alert fr-alert--error fr-alert--sm">
      <p>{erreur.message}</p>
    </div>
  );
};
export type PresentationErreur = {
  texteExplicatif: ReactElement;
  className: ClasseErreurInputGroup;
};
export const construisErreur = (
  clef: string,
  texteExplicatif: { identifiantTexteExplicatif: string; texte: string }
) => {
  return {
    [clef]: {
      texteExplicatif: (
        <TexteExplicatif
          id={texteExplicatif.identifiantTexteExplicatif}
          texte={texteExplicatif.texte}
        />
      ),
      className: 'fr-input-group--error' as ClasseErreurInputGroup,
    },
  };
};

export type ErreurFormulaire = string;

export const construisErreurSimple = (clef: string, message: string) => {
  return {
    [clef]: message,
  };
};
