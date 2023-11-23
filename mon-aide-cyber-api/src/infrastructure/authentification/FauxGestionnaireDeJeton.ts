import {
  GestionnaireDeJeton,
  Jeton,
} from '../../authentification/GestionnaireDeJeton';

export class FauxGestionnaireDeJeton implements GestionnaireDeJeton {
  verifie(_: string): void {
    return;
  }

  genereJeton(_: string): Jeton {
    return 'un-jeton';
  }
}
