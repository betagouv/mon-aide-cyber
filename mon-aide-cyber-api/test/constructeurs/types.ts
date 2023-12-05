import { NiveauRecommandation } from '../../src/diagnostic/Referentiel';
import { Note } from '../../src/diagnostic/Note';

export type Association = {
  identifiantRecommandation: string;
  niveauRecommandation: NiveauRecommandation;
  note: Note;
};
