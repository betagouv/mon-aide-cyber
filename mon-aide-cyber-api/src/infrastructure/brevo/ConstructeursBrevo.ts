import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import {
  APIBrevo,
  CreationContactBrevo,
  EmailBrevo,
  EnvoiMailBrevo,
} from '../adaptateurs/adaptateursRequeteBrevo';

abstract class ConstructeurBrevo<T> {
  abstract construisCorps(): T;

  construis(): APIBrevo<T> {
    const corps = this.construisCorps();
    return {
      methode: 'POST',
      corps: corps,
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'api-key': adaptateurEnvironnement.messagerie().clefAPI(),
      },
    };
  }
}

type Email = string;
type Nom = string;

class ConstructeurBrevoEnvoiMail extends ConstructeurBrevo<EnvoiMailBrevo> {
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

  construisCorps() {
    return {
      sender: this.expediteur,
      to: this.destinataires,
      subject: this.sujet,
      textContent: this.contenu,
    };
  }
}

class ConstructeurBrevoCreationContact extends ConstructeurBrevo<CreationContactBrevo> {
  private email: Email = '';
  private attributs: Record<string, string> = {} as Record<string, string>;

  ayantPourEmail(email: Email): ConstructeurBrevoCreationContact {
    this.email = email;
    return this;
  }

  ayantPourAttributs(
    attributs: Record<string, string>,
  ): ConstructeurBrevoCreationContact {
    this.attributs = attributs;
    return this;
  }

  construisCorps(): CreationContactBrevo {
    return { email: this.email, attributes: this.attributs };
  }
}

class ConstructeursBrevo {
  envoiMail(): ConstructeurBrevoEnvoiMail {
    return new ConstructeurBrevoEnvoiMail();
  }

  creationContact(): ConstructeurBrevoCreationContact {
    return new ConstructeurBrevoCreationContact();
  }
}

export const unConstructeurEnvoiDeMail = () =>
  new ConstructeursBrevo().envoiMail();

export const unConstructeurCreationDeContact = () =>
  new ConstructeursBrevo().creationContact();
