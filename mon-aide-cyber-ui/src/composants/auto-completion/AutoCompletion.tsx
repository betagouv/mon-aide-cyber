import { PropsWithChildren } from 'react';
import Select from 'react-select';

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


  const options = proprietes.suggestionsInitiales.map((value) => {
    return {value:value, label:proprietes.mappeur(value)}
  })

  return (
    <Select
      options={options}
      onChange={(newValue) => {proprietes.surSelection(newValue!.value)}}
    />
  );
};
