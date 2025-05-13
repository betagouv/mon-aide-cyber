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
    _aidants: Aidant[]
  ) => string = (_aide: DemandeAide, _aidants: Aidant[]) =>
    'Bonjour une entité a fait une demande d’aide';

  private _aucunAidantPourLaDemandeAide: (
    _donneesMiseEnRelation: DonneesMiseEnRelation
  ) => string = (_donneesMiseEnRelation: DonneesMiseEnRelation) =>
    'Bonjour une entité a fait une demande d’aide';

  private _recapitulatifDemandeAideDirecteAidant(
    _donneesMiseEnRelation: DonneesMiseEnRelation,
    _relationUtilisateur: string
  ) {
    return 'Bonjour une entité a fait une demande d’Aide directe Aidant.';
  }

  recapitulatifDemandeAide(
    recapitulatif: (_aide: DemandeAide, aidants: Aidant[]) => string
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

  recapitulatifDemandeAideDirecteAidant(
    recapitulatif: (
      _donneesMiseEnRelation: DonneesMiseEnRelation,
      relationUtilisateur: string
    ) => string
  ): ConstructeurAdaptateurDeCorpsDeMessage {
    this._recapitulatifDemandeAideDirecteAidant = recapitulatif;
    return this;
  }

  construis(): AdaptateurCorpsDeMessageAide {
    return {
      demande: (): MessagesDemande => ({
        recapitulatifDemandeAide: () => ({
          genereCorpsMessage: (aide, aidants) =>
            this._recapitulatifDemandeAide(aide, aidants),
        }),
        aucunAidantPourLaDemandeAide: () => ({
          genereCorpsMessage: (aide) =>
            this._aucunAidantPourLaDemandeAide(aide),
        }),
        recapitulatifDemandeAideDirecteAidant: () => ({
          genereCorpsMessage: (donneesMiseEnRelation, relationUtilisateur) =>
            this._recapitulatifDemandeAideDirecteAidant(
              donneesMiseEnRelation,
              relationUtilisateur
            ),
        }),
      }),
    };
  }
}

export const unAdaptateurDeCorpsDeMessage = () =>
  new ConstructeurAdaptateurDeCorpsDeMessage();
