import {
  AdaptateurEnvoiMail,
  Email,
} from '../../adaptateurs/AdaptateurEnvoiMail';
import { ErreurEnvoiEmail } from '../../api/messagerie/Messagerie';
import {
  adaptateursRequeteBrevo,
  estReponseEnErreur,
} from './adaptateursRequeteBrevo';
import { unConstructeurEnvoiDeMail } from '../brevo/ConstructeursBrevo';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';

export class AdaptateurEnvoiMailBrevo implements AdaptateurEnvoiMail {
  envoie(message: Email): Promise<void> {
    const envoiDeMail = unConstructeurEnvoiDeMail()
      .ayantPourExpediteur(
        'MonAideCyber',
        adaptateurEnvironnement.messagerie().expediteurMAC(),
      )
      .ayantPourDestinataires([
        [message.destinataire.email, message.destinataire.nom],
      ])
      .ayantPourSujet(message.objet)
      .ayantPourContenu(message.corps)
      .construis();
    return adaptateursRequeteBrevo()
      .envoiMail()
      .execute(envoiDeMail)
      .then(async (reponse) => {
        if (estReponseEnErreur(reponse)) {
          throw new ErreurEnvoiEmail(
            "Une erreur est survenue lors de l'envoi du message.",
          );
        }
      });
  }
}
