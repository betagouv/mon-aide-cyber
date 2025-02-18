import fs from 'fs';
import * as YAML from 'yaml';
import { Association } from '../api/associations/routesAssociations';

export const adaptateurAssociations = {
  referentiel: (cheminFichier: string): Association[] => {
    const contenuFichier = fs.readFileSync(cheminFichier, 'utf8');
    return YAML.parse(contenuFichier) as Association[];
  },
};
