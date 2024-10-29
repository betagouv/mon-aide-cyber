import {
  AdaptateurEnvoiMail,
  Email,
  Expediteur,
} from '../../adaptateurs/AdaptateurEnvoiMail';
import { ErreurEnvoiEmail } from '../../api/messagerie/Messagerie';
import {
  adaptateursRequeteBrevo,
  estReponseEnErreur,
} from './adaptateursRequeteBrevo';
import { unConstructeurEnvoiDeMail } from '../brevo/ConstructeursBrevo';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';

export class AdaptateurEnvoiMailBrevo implements AdaptateurEnvoiMail {
  envoie(
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
      .ayantPourDestinataires([
        [message.destinataire.email, message.destinataire.nom],
      ])
      .ayantEnCopie(message.copie)
      .ayantEnCopieInvisible(message.copieInvisible)
      .ayantPourSujet(message.objet)
      .ayantPourContenu(message.corps)
      .construis();
    return adaptateursRequeteBrevo()
      .envoiMail()
      .execute(envoiDeMail)
      .then(async (reponse) => {
        if (estReponseEnErreur(reponse)) {
          const corpsReponse = await reponse.json();
          console.error(
            'ERREUR BREVO',
            JSON.stringify({
              contexte: 'Envoi mail',
              code: corpsReponse.code,
              message: corpsReponse.message,
            })
          );
          throw new ErreurEnvoiEmail(
            "Une erreur est survenue lors de l'envoi du message."
          );
        }
      });
  }
}
