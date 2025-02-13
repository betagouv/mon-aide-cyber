import { EntrepotEcriture } from '../domaine/Entrepot';
import crypto from 'crypto';
import { Indicateurs, Mesures } from '../diagnostic/Diagnostic';

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
type EntrepotRestitution = EntrepotEcriture<Restitution>;

export { EntrepotRestitution, InformationsRestitution, Restitution };
