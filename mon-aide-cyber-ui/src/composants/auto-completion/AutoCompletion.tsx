import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {
  ActionAutoCompletion,
  focusEnCours,
  initialiseEtatAutoCompletion,
  optionChoisie,
  reducteurAutoCompletion,
  toucheClavierAppuyee,
  valeursChargees,
  valeurSaisie,
} from './reducteurAutoCompletion.ts';

type ProprietesAutoCompletion<T extends object | string> = {
  nom: string;
  mappeur: (valeur: T) => string;
  surSelection: (valeur: string) => void;
  surSaisie: (valeur: string) => void;
  valeur: string;
  valeurs: T[];
};
export const AutoCompletion = <T extends object | string>(
  proprietes: PropsWithChildren<ProprietesAutoCompletion<T>>,
) => {
  const [etat, envoie] = useReducer(
    reducteurAutoCompletion,
    initialiseEtatAutoCompletion(proprietes.nom, proprietes.valeur),
  );
  const [valeursEnCoursDeChargement, setValeursEnCoursDeChargement] =
    useState(true);

  useEffect(() => {
    if (valeursEnCoursDeChargement) {
      envoie(
        valeursChargees({
          valeurs: proprietes.valeurs,
        }),
      );
      setValeursEnCoursDeChargement(false);
    }
  }, [proprietes, valeursEnCoursDeChargement]);

  const surSelection = useCallback(
    (
      valeur: string,
      execute: (
        valeur: string,
        fonction: (valeur: string) => void,
      ) => ActionAutoCompletion,
    ) => {
      envoie(execute(valeur, proprietes.surSelection));
    },
    [proprietes],
  );

  const liste = (
    <datalist className={`autocomplete-items ${etat.visibilite}`}>
      {etat.valeursFiltrees.map((valeur, index) => (
        <option
          key={`auto-completion-${index}`}
          onClick={(e) =>
            surSelection(e.currentTarget.textContent!, optionChoisie)
          }
        >
          {proprietes.mappeur(valeur as T)}
        </option>
      ))}
    </datalist>
  );

  return (
    <div className="autocomplete fr-col-12">
      <input
        className="fr-input"
        type="text"
        id={etat.nom}
        name={etat.nom}
        onFocus={() => envoie(focusEnCours(proprietes.valeurs as T[]))}
        onChange={(e) => surSelection(e.target.value, valeurSaisie)}
        onKeyDown={(e) => envoie(toucheClavierAppuyee(e.key))}
        value={etat.valeur}
      />
      {liste}
    </div>
  );
};
