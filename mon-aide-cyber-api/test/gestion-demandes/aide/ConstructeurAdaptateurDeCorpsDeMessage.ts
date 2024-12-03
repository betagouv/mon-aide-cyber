import { Constructeur } from '../../constructeurs/constructeur';
import {
  AdaptateurCorpsDeMessageAide,
  MessagesDemande,
  MessagesSollicitation,
  ProprietesMessageAidant,
  ProprietesMessageRecapitulatif,
  ProprietesMessageRecapitulatifSollicitationAide,
} from '../../../src/gestion-demandes/aide/adaptateursCorpsMessage';
import { Aide } from '../../../src/aide/Aide';

class ConstructeurAdaptateurDeCorpsDeMessage
  implements Constructeur<AdaptateurCorpsDeMessageAide>
{
  private _notificationAidant: (proprietes: ProprietesMessageAidant) => string =
    (_proprietes) => 'Bonjour Aidant!';
  private _recapitulatifMAC: (
    proprietes: ProprietesMessageRecapitulatif
  ) => string = (_proprietes) => 'Bonjour MAC!';
  private _recapitulatifDemandeAide: (
    _aide: Aide,
    _relationAidant: boolean
  ) => string = (_aide: Aide, _relationAidant: boolean) =>
    'Bonjour une entité a fait une demande d’aide';
  private _confirmationDemandeAide: (
    _aide: Aide,
    relationAidant: boolean
  ) => string = (_aide: Aide, _relationAidant: boolean) =>
    'Bonjour entité Aidée';

  notificationAidant(
    notification: (proprietes: ProprietesMessageAidant) => string
  ): ConstructeurAdaptateurDeCorpsDeMessage {
    this._notificationAidant = notification;
    return this;
  }

  recapitulatifMac(
    recapitulatif: (proprietes: ProprietesMessageRecapitulatif) => string
  ): ConstructeurAdaptateurDeCorpsDeMessage {
    this._recapitulatifMAC = recapitulatif;
    return this;
  }

  recapitulatifDemandeAide(
    recapitulatif: (_aide: Aide, relationAidant: boolean) => string
  ): ConstructeurAdaptateurDeCorpsDeMessage {
    this._recapitulatifDemandeAide = recapitulatif;
    return this;
  }

  confirmationDemandeAide(
    confirmation: (_aide: Aide, relationAidant: boolean) => string
  ): ConstructeurAdaptateurDeCorpsDeMessage {
    this._confirmationDemandeAide = confirmation;
    return this;
  }

  construis(): AdaptateurCorpsDeMessageAide {
    return {
      sollicitation: (): MessagesSollicitation => ({
        notificationAidantSollicitation: () => ({
          genereCorpsMessage: (proprietesMessage: ProprietesMessageAidant) =>
            this._notificationAidant(proprietesMessage),
        }),
        recapitulatifMAC: () => ({
          genereCorpsMessage: (
            proprietesMessage: ProprietesMessageRecapitulatif
          ) => this._recapitulatifMAC(proprietesMessage),
        }),
        recapitulatifSollicitationAide: (
          _proprietesMessage: ProprietesMessageRecapitulatifSollicitationAide
        ) => ({
          genereCorpsMessage: () => 'Bonjour Aidé!',
        }),
      }),
      demande: (): MessagesDemande => ({
        recapitulatifDemandeAide: () => ({
          genereCorpsMessage: (aide, relationAidant) =>
            this._recapitulatifDemandeAide(aide, relationAidant),
        }),
        confirmationDemandeAide: () => ({
          genereCorpsMessage: (aide, relationAidant) =>
            this._confirmationDemandeAide(aide, relationAidant),
        }),
      }),
    };
  }
}

export const unAdaptateurDeCorpsDeMessage = () =>
  new ConstructeurAdaptateurDeCorpsDeMessage();
