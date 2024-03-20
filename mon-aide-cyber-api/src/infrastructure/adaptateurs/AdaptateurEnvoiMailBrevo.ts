import { AdaptateurEnvoiMail, Message } from '../../adaptateurs/AdaptateurEnvoiMail';

export class AdaptateurEnvoiMailBrevo implements AdaptateurEnvoiMail {
  envoie(message: Message, destination: string): Promise<void> {
    return fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      body: JSON.stringify({
        sender: { name: 'MAC', email: process.env.EMAIL_CONTACT_MAC },
        subject: 'Contact MAC',
        to: [{ email: destination, name: 'MonAideCyber' }],
        textContent:
          `Bonjour, \n` + `${message.nom} (${message.email}) a envoyé le message suivant:\n` + `${message.message}`,
      }),
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'api-key': process.env.BREVO_CLEF_API || '',
      },
    }).then(async (reponse) => {
      if (!reponse.ok) {
        return Promise.reject(await reponse.json());
      }
    });
  }
}
