import { PropsWithChildren, useState } from 'react';

type ProprietesAutoCompletion = {
  nom: string;
  surChangement: (valeur: string) => void;
  surClick: (valeur: string) => void;
  valeur: string;
  valeurs: string[];
};
export const AutoCompletion = (
  proprietes: PropsWithChildren<ProprietesAutoCompletion>,
) => {
  const [listeVisible, setListeVisible] = useState('visible');
  const liste = (
    <datalist className={`autocomplete-items ${listeVisible}`}>
      {proprietes.valeurs.map((valeur, index) => (
        <option
          key={`auto-completion-${index}`}
          onClick={(e) => proprietes.surClick(e.currentTarget.textContent!)}
        >
          {valeur}
        </option>
      ))}
    </datalist>
  );
  return (
    <div className="autocomplete fr-col-12">
      <input
        className="fr-input"
        type="text"
        id={proprietes.nom}
        name={proprietes.nom}
        onFocus={() => setListeVisible('visible')}
        onChange={(e) => proprietes.surChangement(e.target.value)}
        onKeyDown={(e) => e.key === 'Tab' && setListeVisible('invisible')}
        value={proprietes.valeur}
      />
      {liste}
    </div>
  );
};
