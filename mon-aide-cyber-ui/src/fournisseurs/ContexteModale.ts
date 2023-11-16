import { createContext, ReactElement, useContext } from 'react';

export type ElementModale = {
  titre: string;
  corps: ReactElement;
  actions: ReactElement[];
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

export const useModale = (): ActionsModale => useContext(ContexteModale);
