import { createContext, ReactElement } from 'react';

export type TailleModale = 'centree' | 'moyenne' | 'large';

export type ElementModale = {
  titre?: string;
  corps: ReactElement;
  taille?: TailleModale;
};

export const ContexteModale = createContext<ActionsModale>({
  affiche: () => {},
  ferme: () => {},
});

export type ActionsModale = {
  affiche: (element: ElementModale) => void;
  ferme: () => void;
};
