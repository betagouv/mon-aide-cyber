import fs from 'fs';
import * as YAML from 'yaml';
import { ReferentielAssociations } from '../api/associations/routesAssociations';

export const adaptateurAssociations = {
  referentiel: (cheminFichier: string): ReferentielAssociations => {
    const contenuFichier = fs.readFileSync(cheminFichier, 'utf8');
    return YAML.parse(contenuFichier) as ReferentielAssociations;
  },
};
