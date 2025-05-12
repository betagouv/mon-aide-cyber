import { Constructeur } from '../../constructeurs/constructeur';
import {
  AdaptateurCorpsDeMessageAide,
  MessagesDemande,
} from '../../../src/gestion-demandes/aide/adaptateursCorpsMessage';
import { DemandeAide } from '../../../src/gestion-demandes/aide/DemandeAide';
import { Aidant } from '../../../src/espace-aidant/Aidant';
import { DonneesMiseEnRelation } from '../../../src/gestion-demandes/aide/miseEnRelation';

class ConstructeurAdaptateurDeCorpsDeMessage
  implements Constructeur<AdaptateurCorpsDeMessageAide>
{
  private _recapitulatifDemandeAide: (
    _aide: DemandeAide,
    _aidants: Aidant[],
    _relationUtilisateur: string | undefined
  ) => string = (
    _aide: DemandeAide,
    _aidants: Aidant[],
    _relationUtilisateur: string | undefined
  ) => 'Bonjour une entité a fait une demande d’aide';

  private _aucunAidantPourLaDemandeAide: (
    _donneesMiseEnRelation: DonneesMiseEnRelation
  ) => string = (_donneesMiseEnRelation: DonneesMiseEnRelation) =>
    'Bonjour une entité a fait une demande d’aide';

  recapitulatifDemandeAide(
    recapitulatif: (
      _aide: DemandeAide,
      aidants: Aidant[],
      relationUtilisateur: string | undefined
    ) => string
  ): ConstructeurAdaptateurDeCorpsDeMessage {
    this._recapitulatifDemandeAide = recapitulatif;
    return this;
  }

  aucunAidantPourLaDemandeAide(
    recapitulatif: (_donneesMiseEnRelation: DonneesMiseEnRelation) => string
  ): ConstructeurAdaptateurDeCorpsDeMessage {
    this._aucunAidantPourLaDemandeAide = recapitulatif;
    return this;
  }

  construis(): AdaptateurCorpsDeMessageAide {
    return {
      demande: (): MessagesDemande => ({
        recapitulatifDemandeAide: () => ({
          genereCorpsMessage: (aide, aidants, relationUtilisateur) =>
            this._recapitulatifDemandeAide(aide, aidants, relationUtilisateur),
        }),
        aucunAidantPourLaDemandeAide: () => ({
          genereCorpsMessage: (aide) =>
            this._aucunAidantPourLaDemandeAide(aide),
        }),
      }),
    };
  }
}

export const unAdaptateurDeCorpsDeMessage = () =>
  new ConstructeurAdaptateurDeCorpsDeMessage();
