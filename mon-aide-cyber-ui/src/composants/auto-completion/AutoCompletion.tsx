import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  focusEnCours,
  initialiseEtatAutoCompletion,
  suggestionChoisie,
  reducteurAutoCompletion,
  toucheClavierAppuyee,
  suggestionsInitialesChargees,
  valeurSaisie,
  surClickEnDehors,
} from './reducteurAutoCompletion.ts';

type ProprietesAutoCompletion<T extends object | string> = {
  nom: string;
  mappeur: (valeur: T | string) => string;
  surSelection: (valeur: T) => void;
  surSaisie: (valeur: T | string) => void;
  valeurSaisie: T;
  suggestionsInitiales: T[];
};

export const AutoCompletion = <T extends object | string>(
  proprietes: PropsWithChildren<ProprietesAutoCompletion<T>>,
) => {
  const referenceConteneur = useRef<HTMLDivElement | null>(null);
  const [etat, envoie] = useReducer(
    reducteurAutoCompletion<T>(),
    initialiseEtatAutoCompletion<T>()(proprietes.nom, proprietes.valeurSaisie),
  );
  const [suggestionsEnCoursDeChargement, setSuggestionsEnCoursDeChargement] =
    useState(true);

  useEffect(() => {
    if (suggestionsEnCoursDeChargement) {
      envoie(
        suggestionsInitialesChargees({
          suggestionsInitiales: proprietes.suggestionsInitiales,
        }),
      );
      setSuggestionsEnCoursDeChargement(false);
    }
  }, [proprietes, suggestionsEnCoursDeChargement]);

  const clickEnDehors = useCallback((e: MouseEvent) => {
    if (
      referenceConteneur &&
      referenceConteneur.current &&
      !referenceConteneur.current.contains(e.target as Node)
    ) {
      envoie(surClickEnDehors());
    }
  }, []);

  useEffect(() => {
    addEventListener('click', clickEnDehors, true);

    return () => {
      removeEventListener('click', clickEnDehors);
    };
  });

  const surSelection = useCallback(
    (valeur: T) => {
      envoie(suggestionChoisie(valeur, proprietes.surSelection));
    },
    [proprietes],
  );

  const surSaisie = useCallback(
    (valeur: string) => {
      envoie(valeurSaisie(valeur, proprietes.surSaisie));
    },
    [proprietes],
  );

  const surToucheClavierPressee = useCallback((touche: string) => {
    envoie(toucheClavierAppuyee(touche));
  }, []);

  const surSelectionClavier = useCallback(
    (touche: string, valeur: T) => {
      if (touche === 'Enter') {
        surSelection(valeur);
      }
      if (touche === 'ArrowDown' || touche === 'ArrowUp') {
        surToucheClavierPressee(touche);
      }
    },
    [surSelection, surToucheClavierPressee],
  );

  const liste = (
    <div className={`autocomplete-items ${etat.suggestionsVisibles}`}>
      {etat.suggestions.map((valeur, index) => (
        <Suggestion
          key={`option-${proprietes.nom}-${index}`}
          suggestion={valeur}
          suggestionCourante={etat.elementNavigationCourant}
          surSelection={surSelection}
          surSelectionClavier={surSelectionClavier}
          mappeur={proprietes.mappeur}
        />
      ))}
    </div>
  );

  return (
    <div className="autocomplete fr-col-12" ref={referenceConteneur}>
      <input
        className="fr-input"
        type="text"
        id={etat.nom}
        name={etat.nom}
        onFocus={() =>
          envoie(focusEnCours(proprietes.suggestionsInitiales as T[]))
        }
        onChange={(e) => surSaisie(e.target.value)}
        onKeyDown={(e) => surToucheClavierPressee(e.key)}
        value={proprietes.mappeur(etat.valeurSaisie)}
      />
      {liste}
    </div>
  );
};

const Suggestion = <T extends object | string>(proprietes: {
  suggestion: T;
  suggestionCourante?: { valeur: T; index: number };
  surSelection: (valeur: T) => void;
  surSelectionClavier: (touche: string, valeur: T) => void;
  mappeur: (valeur: T) => string;
}) => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (
      proprietes.suggestion === proprietes.suggestionCourante?.valeur &&
      ref.current
    ) {
      ref.current.focus();
    }
  }, [proprietes.suggestionCourante?.valeur, proprietes.suggestion]);
  return (
    <button
      ref={ref}
      key={`auto-completion-${proprietes.suggestionCourante?.index}`}
      onClick={() => proprietes.surSelection(proprietes.suggestion)}
      onKeyDown={(e) =>
        proprietes.surSelectionClavier(e.key, proprietes.suggestion)
      }
    >
      {proprietes.mappeur(proprietes.suggestion)}
    </button>
  );
};
