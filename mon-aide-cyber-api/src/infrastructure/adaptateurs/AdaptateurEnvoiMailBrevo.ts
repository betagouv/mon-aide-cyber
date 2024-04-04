import {
  AdaptateurEnvoiMail,
  Email,
} from '../../adaptateurs/AdaptateurEnvoiMail';
import { ErreurEnvoiEmail } from '../../api/messagerie/Messagerie';

export class AdaptateurEnvoiMailBrevo implements AdaptateurEnvoiMail {
  envoie(message: Email): Promise<void> {
    return fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      body: JSON.stringify({
        sender: {
          name: 'MonAideCyber',
          email: process.env.EMAIL_CONTACT_MAC_EXPEDITEUR,
        },
        subject: message.objet,
        to: [
          { email: message.destinataire.email, name: message.destinataire.nom },
        ],
        textContent: message.corps,
      }),
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'api-key': process.env.BREVO_CLEF_API || '',
      },
    }).then(async (reponse) => {
      console.error('RÉPONSE', await reponse.json(), reponse.status);
      if (!reponse.ok) {
        throw new ErreurEnvoiEmail(
          "Une erreur est survenue lors de l'envoi du message.",
        );
      }
    });
  }
}
