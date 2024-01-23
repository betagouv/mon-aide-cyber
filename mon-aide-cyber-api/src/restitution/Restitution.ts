import { Entrepot } from '../domaine/Entrepot';
import crypto from 'crypto';
import { Indicateurs, Mesures } from '../diagnostic/Diagnostic';

type InformationsRestitution = {
  dateCreation: Date;
  dateDerniereModification: Date;
  secteurActivite: string;
  zoneGeographique: string;
};
type Restitution = {
  identifiant: crypto.UUID;
  indicateurs: Indicateurs;
  informations: InformationsRestitution;
  mesures: Mesures;
};
type EntrepotRestitution = Entrepot<Restitution>;

export { EntrepotRestitution, InformationsRestitution, Restitution };
