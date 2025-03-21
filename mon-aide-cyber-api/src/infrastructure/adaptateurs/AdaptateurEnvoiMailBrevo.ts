import {
  AdaptateurEnvoiMail,
  Email,
  Expediteur,
} from '../../adaptateurs/AdaptateurEnvoiMail';
import { ErreurEnvoiEmail } from '../../api/messagerie/Messagerie';
import {
  adaptateursRequeteBrevo,
  ErreurRequeBrevo,
} from './adaptateursRequeteBrevo';
import { unConstructeurEnvoiDeMail } from '../brevo/ConstructeursBrevo';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { isArray } from 'lodash';

export class AdaptateurEnvoiMailBrevo implements AdaptateurEnvoiMail {
  async envoie(
    message: Email,
    expediteur: Expediteur = 'MONAIDECYBER'
  ): Promise<void> {
    const envoiDeMail = unConstructeurEnvoiDeMail()
      .ayantPourExpediteur(
        'MonAideCyber',
        expediteur === 'MONAIDECYBER'
          ? adaptateurEnvironnement.messagerie().expediteurMAC()
          : adaptateurEnvironnement.messagerie().expediteurInfoMAC()
      )
      .ayantPourDestinataires(
        isArray(message.destinataire)
          ? message.destinataire.map((destinataire) => [
              destinataire.email,
              destinataire.nom,
            ])
          : [[message.destinataire.email, message.destinataire.nom]]
      )
      .ayantEnCopie(message.copie)
      .ayantEnCopieInvisible(message.copieInvisible)
      .ayantPourSujet(message.objet)
      .ayantPourContenu(message.corps)
      .ayantEnPieceJointe(message.pieceJointe)
      .construis();
    await adaptateursRequeteBrevo()
      .envoiMail()
      .execute(envoiDeMail)
      .catch(async (reponse: unknown | ErreurRequeBrevo) => {
        throw new ErreurEnvoiEmail(
          JSON.stringify((reponse as ErreurRequeBrevo).corps)
        );
      });
  }
}
