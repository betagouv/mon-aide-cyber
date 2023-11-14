import {
  GestionnaireDeJeton,
  Jeton,
} from '../../authentification/GestionnaireDeJeton';

export class FauxGestionnaireDeJeton implements GestionnaireDeJeton {
  decode(_: string): any {
    return;
  }

  genereJeton(_: string): Jeton {
    return 'un-jeton';
  }
}
