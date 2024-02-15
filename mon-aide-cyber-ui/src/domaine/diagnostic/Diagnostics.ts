import { Aggregat } from '../Aggregat.ts';
import { Diagnostic } from './Diagnostic.ts';

export type Diagnostics = Aggregat &
  Omit<Aggregat, 'identifiant'> &
  (Diagnostic &
    Omit<Diagnostic, 'referentiel'> & {
      actions: { [key: string]: string }[];
    })[];
