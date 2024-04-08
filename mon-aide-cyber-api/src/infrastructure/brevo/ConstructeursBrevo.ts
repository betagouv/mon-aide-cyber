import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import {
  EmailBrevo,
  EnvoiMailBrevo,
} from '../adaptateurs/adaptateursRequeteBrevo';

interface ConstructeurBrevo<T> {
  construis: () => T;
}

type Email = string;
type Nom = string;

class ConstructeurBrevoEnvoiMail implements ConstructeurBrevo<EnvoiMailBrevo> {
  private expediteur: EmailBrevo = {} as EmailBrevo;
  private destinataires: EmailBrevo[] = [];
  private sujet = '';
  private contenu = '';
  ayantPourExpediteur(nom: string, email: string): ConstructeurBrevoEnvoiMail {
    this.expediteur = { name: nom, email };
    return this;
  }

  ayantPourDestinataires(
    destinataires: [Email, Nom | undefined][],
  ): ConstructeurBrevoEnvoiMail {
    this.destinataires = destinataires.map(([email, nom]) => ({
      email,
      ...(nom && { name: nom }),
    }));
    return this;
  }

  ayantPourSujet(sujet: string): ConstructeurBrevoEnvoiMail {
    this.sujet = sujet;
    return this;
  }

  ayantPourContenu(contenu: string): ConstructeurBrevoEnvoiMail {
    this.contenu = contenu;
    return this;
  }

  construis(): EnvoiMailBrevo {
    return {
      methode: 'POST',
      corps: {
        sender: this.expediteur,
        to: this.destinataires,
        subject: this.sujet,
        textContent: this.contenu,
      },
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'api-key': adaptateurEnvironnement.messagerie().clefAPI(),
      },
    };
  }
}

class ConstructeursBrevo {
  envoiMail(): ConstructeurBrevoEnvoiMail {
    return new ConstructeurBrevoEnvoiMail();
  }
}

export const unConstructeurEnvoiDeMail = () =>
  new ConstructeursBrevo().envoiMail();
