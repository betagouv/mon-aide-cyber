export type ElementDynamique = {
  code: string;
  nom: string;
};

export const ChampCaseACocher = ({
  element,
  label,
  ...proprietesRestantes
}: {
  element: ElementDynamique;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="champ-case-a-cocher-conteneur">
      <input {...proprietesRestantes} id={element.code} type="checkbox" />{' '}
      <label htmlFor={element.code}>{label}</label>
    </div>
  );
};
