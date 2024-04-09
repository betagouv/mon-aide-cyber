import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import {
  CreationContactBrevo,
  EmailBrevo,
  EnvoiMailBrevo,
  RechercheContactBrevo,
  RequeteBrevo,
} from '../adaptateurs/adaptateursRequeteBrevo';

abstract class ConstructeurBrevo<T> {
  constructor(private readonly methode: 'POST' | 'GET') {}
  protected abstract construisCorps(): T;

  construis(): RequeteBrevo<T> {
    return {
      methode: this.methode,
      ...(this.methode === 'POST' && { corps: this.construisCorps() }),
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

  constructor() {
    super('POST');
  }

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

  protected construisCorps() {
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

  constructor() {
    super('POST');
  }

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

  protected construisCorps(): CreationContactBrevo {
    return { email: this.email, attributes: this.attributs };
  }
}

class ConstructeurBrevoRechercheContact extends ConstructeurBrevo<RechercheContactBrevo> {
  constructor() {
    super('GET');
  }
  protected construisCorps(): RechercheContactBrevo {
    throw new Error('Méthode non implémentée');
  }
}

export const unConstructeurEnvoiDeMail = () => new ConstructeurBrevoEnvoiMail();

export const unConstructeurCreationDeContact = () =>
  new ConstructeurBrevoCreationContact();

export const unConstructeurRechercheDeContact = () =>
  new ConstructeurBrevoRechercheContact();
