import { useMemo } from 'react';
import { useNavigationMAC } from '../fournisseurs/hooks';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens';
import { Action } from '../domaine/Lien';

export function useMoteurDeLiens(clef: Action) {
  const { etat } = useNavigationMAC();

  const accedeALaRessource = useMemo(() => {
    return new MoteurDeLiens(etat).existe(clef);
  }, [clef, etat]);

  return { accedeALaRessource };
}
