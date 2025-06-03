import { EntrepotEcriture } from '../domaine/Entrepot';
import crypto from 'crypto';
import {
  Indicateurs,
  Mesures,
  ORDRE_THEMATIQUES,
} from '../diagnostic/Diagnostic';

type InformationsRestitution = {
  dateCreation: Date;
  dateDerniereModification: Date;
  secteurActivite: string;
  secteurGeographique: string;
};
type Restitution = {
  identifiant: crypto.UUID;
  indicateurs: Indicateurs;
  informations: InformationsRestitution;
  mesures: Mesures;
};

export const trieLesIndicateurs = (restitution: Restitution) => {
  const indicateursRestitution: Indicateurs = Object.entries(
    restitution.indicateurs
  )
    .sort(([thematiqueA], [thematiqueB]) =>
      ORDRE_THEMATIQUES.indexOf(thematiqueA) >
      ORDRE_THEMATIQUES.indexOf(thematiqueB)
        ? 1
        : -1
    )
    .reduce(
      (accumulateur, [thematique, indicateur]) => ({
        ...accumulateur,
        [thematique]: indicateur,
      }),
      {}
    );
  return indicateursRestitution;
};

type EntrepotRestitution = EntrepotEcriture<Restitution>;

export { EntrepotRestitution, InformationsRestitution, Restitution };
