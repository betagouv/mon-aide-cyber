import { LienNavigation } from '../LayoutPublic';

export type MenuNavigationElement = LienNavigation & {
  actif: boolean;
  enfants?: MenuNavigationElement[];
};
