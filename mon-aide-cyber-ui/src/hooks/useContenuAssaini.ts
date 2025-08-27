import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

export const useContenuAssaini = (contenuInitial: string) => {
  const [contenuAssaini, setContenuAssaini] = useState(contenuInitial);

  useEffect(() => {
    const assaini = DOMPurify.sanitize(contenuInitial);
    setContenuAssaini(assaini);
  }, [contenuInitial]);

  return contenuAssaini;
};
