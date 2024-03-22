import {
  AdaptateurEnvoiMail,
  Message,
} from '../../adaptateurs/AdaptateurEnvoiMail';
import { ErreurEnvoiMessage } from '../../api/messagerie/Messagerie';

export class AdaptateurEnvoiMailBrevo implements AdaptateurEnvoiMail {
  envoie(message: Message, destination: string): Promise<void> {
    return fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      body: JSON.stringify({
        sender: {
          name: 'MonAideCyber',
          email: process.env.EMAIL_CONTACT_MAC_FROM,
        },
        subject: 'Contact MAC',
        to: [{ email: destination, name: 'MonAideCyber' }],
        textContent:
          `Bonjour, \n` +
          `${message.nom} (${message.email}) a envoyé le message suivant:\n` +
          `${message.message}`,
      }),
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'api-key': process.env.BREVO_CLEF_API || '',
      },
    }).then(async (reponse) => {
      if (!reponse.ok) {
        throw new ErreurEnvoiMessage(
          "Une erreur est survenue lors de l'envoi du message.",
        );
      }
    });
  }
}
