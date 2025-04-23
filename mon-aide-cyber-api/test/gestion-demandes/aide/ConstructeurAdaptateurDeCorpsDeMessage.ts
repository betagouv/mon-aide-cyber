import { Constructeur } from '../../constructeurs/constructeur';
import {
  AdaptateurCorpsDeMessageAide,
  MessagesDemande,
} from '../../../src/gestion-demandes/aide/adaptateursCorpsMessage';
import { DemandeAide } from '../../../src/gestion-demandes/aide/DemandeAide';

class ConstructeurAdaptateurDeCorpsDeMessage
  implements Constructeur<AdaptateurCorpsDeMessageAide>
{
  private _recapitulatifDemandeAide: (
    _aide: DemandeAide,
    _relationUtilisateur: string | undefined
  ) => string = (
    _aide: DemandeAide,
    _relationUtilisateur: string | undefined
  ) => 'Bonjour une entité a fait une demande d’aide';

  recapitulatifDemandeAide(
    recapitulatif: (
      _aide: DemandeAide,
      relationUtilisateur: string | undefined
    ) => string
  ): ConstructeurAdaptateurDeCorpsDeMessage {
    this._recapitulatifDemandeAide = recapitulatif;
    return this;
  }

  construis(): AdaptateurCorpsDeMessageAide {
    return {
      demande: (): MessagesDemande => ({
        recapitulatifDemandeAide: () => ({
          genereCorpsMessage: (aide, relationUtilisateur) =>
            this._recapitulatifDemandeAide(aide, relationUtilisateur),
        }),
      }),
    };
  }
}

export const unAdaptateurDeCorpsDeMessage = () =>
  new ConstructeurAdaptateurDeCorpsDeMessage();
