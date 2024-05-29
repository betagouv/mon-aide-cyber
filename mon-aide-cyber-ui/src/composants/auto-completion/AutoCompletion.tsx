import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  basculeAffichageValeurs,
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
  clefsFiltrage?: (keyof T)[];
};

export const AutoCompletion = <T extends object | string>(
  proprietes: PropsWithChildren<ProprietesAutoCompletion<T>>,
) => {
  const referenceConteneur = useRef<HTMLDivElement | null>(null);
  const referenceChampSaisie = useRef<HTMLInputElement | null>(null);
  const [etat, envoie] = useReducer(
    reducteurAutoCompletion<T>(),
    initialiseEtatAutoCompletion<T>()(
      proprietes.nom,
      proprietes.valeurSaisie,
      proprietes.clefsFiltrage,
    ),
  );
  const [suggestionsEnCoursDeChargement, setSuggestionsEnCoursDeChargement] =
    useState(true);
  const [iconeFlecheBas, setIconeFlecheBas] = useState(true);

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
      setIconeFlecheBas(true);
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
      setIconeFlecheBas(!iconeFlecheBas);
    },
    [iconeFlecheBas, proprietes.surSelection],
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
      } else if (touche === 'ArrowDown' || touche === 'ArrowUp') {
        surToucheClavierPressee(touche);
      } else if (referenceChampSaisie.current) {
        referenceChampSaisie.current.focus();
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

  const surFocusChampDeSaisie = useCallback(() => {
    envoie(focusEnCours(proprietes.suggestionsInitiales as T[]));
    envoie(basculeAffichageValeurs());
    setIconeFlecheBas(!iconeFlecheBas);
  }, [iconeFlecheBas, proprietes.suggestionsInitiales]);

  return (
    <div className="autocomplete fr-col-12" ref={referenceConteneur}>
      <div className="autocomplete-labellise">
        <input
          className="fr-input"
          ref={referenceChampSaisie}
          type="text"
          id={etat.nom}
          name={etat.nom}
          onFocus={() => surFocusChampDeSaisie()}
          onChange={(e) => surSaisie(e.target.value)}
          onKeyDown={(e) => surToucheClavierPressee(e.key)}
          value={proprietes.mappeur(etat.valeurSaisie)}
        />
        <button
          type="button"
          className={`autocomplete-labellise-label ${
            iconeFlecheBas
              ? `fr-icon-arrow-down-s-line`
              : `fr-icon-arrow-up-s-line`
          }`}
          onClick={(e) => {
            e.stopPropagation();
            surFocusChampDeSaisie();
          }}
        />
      </div>
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
