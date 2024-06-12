import { createContext, ReactElement } from 'react';

export type TailleModale = 'centree' | 'moyenne' | 'large';

export type ElementModale = {
  titre?: string;
  corps: ReactElement;
  taille?: TailleModale;
};

export const ContexteModale = createContext<ActionsModale>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  affiche: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ferme: () => {},
});

export type ActionsModale = {
  affiche: (element: ElementModale) => void;
  ferme: () => void;
};
