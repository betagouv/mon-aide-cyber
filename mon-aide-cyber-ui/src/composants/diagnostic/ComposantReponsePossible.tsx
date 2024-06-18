import { PropsWithChildren } from 'react';
import { ReponsePossible } from '../../domaine/diagnostic/Referentiel.ts';

type ProprietesComposantReponsePossible = {
  identifiantQuestion: string;
  reponsePossible: ReponsePossible;
  typeDeSaisie: 'radio' | 'checkbox';
  onChange: (identifiantReponse: string) => void;
  selectionnee: boolean;
};
export const ComposantReponsePossible = (
  proprietes: PropsWithChildren<ProprietesComposantReponsePossible>
) => {
  return (
    <div
      className={`fr-${proprietes.typeDeSaisie}-group mac-${proprietes.typeDeSaisie}-group`}
    >
      <input
        id={proprietes.reponsePossible.identifiant}
        type={proprietes.typeDeSaisie}
        name={proprietes.identifiantQuestion}
        value={proprietes.reponsePossible.identifiant}
        checked={proprietes.selectionnee}
        onChange={(event) => {
          proprietes.onChange(event.target.value);
        }}
      />
      <label
        className="fr-label"
        htmlFor={proprietes.reponsePossible.identifiant}
      >
        {proprietes.reponsePossible.libelle}
      </label>
      {proprietes.children}
    </div>
  );
};
