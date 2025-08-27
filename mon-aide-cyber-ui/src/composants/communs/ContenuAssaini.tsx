import { useContenuAssaini } from '../../hooks/useContenuAssaini.ts';
import { HTMLAttributes } from 'react';

type ProprietesContenuAssaini = HTMLAttributes<HTMLDivElement> & {
  contenu: string;
};

export const ContenuAssaini = ({
  contenu,
  ...proprietesRestantes
}: ProprietesContenuAssaini) => {
  const contenuAssaini = useContenuAssaini(contenu);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: contenuAssaini }}
      {...proprietesRestantes}
    />
  );
};
