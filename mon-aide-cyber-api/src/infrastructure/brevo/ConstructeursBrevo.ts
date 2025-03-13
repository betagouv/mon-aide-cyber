import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import {
  CreationContactBrevo,
  EmailBrevo,
  EnvoiMailBrevo,
  PieceJointeBrevo,
  RechercheContactBrevo,
  RequeteBrevo,
} from '../adaptateurs/adaptateursRequeteBrevo';
import { PieceJointe } from '../../adaptateurs/AdaptateurEnvoiMail';

abstract class ConstructeurBrevo<T> {
  constructor(private readonly methode: 'POST' | 'GET') {}

  protected abstract construisCorps(): T;

  construis(): RequeteBrevo<T> {
    return {
      methode: this.methode,
      ...(this.methode === 'POST' && {
        corps: this.construisCorps(),
      }),
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
  private copie?: EmailBrevo[] = [];
  private copieInvisible?: EmailBrevo[] = [];
  private pieceJointe: PieceJointeBrevo[] = [];

  constructor() {
    super('POST');
  }

  ayantPourExpediteur(nom: string, email: string): ConstructeurBrevoEnvoiMail {
    this.expediteur = { name: nom, email };
    return this;
  }

  ayantPourDestinataires(
    destinataires: [Email, Nom | undefined][]
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

  ayantEnCopie(email?: Email): ConstructeurBrevoEnvoiMail {
    if (email) {
      this.copie?.push({ email });
    }
    return this;
  }

  ayantEnCopieInvisible(email?: Email): ConstructeurBrevoEnvoiMail {
    if (email) {
      this.copieInvisible?.push({ email });
    }
    return this;
  }

  ayantEnPieceJointe(pieceJointe?: PieceJointe): ConstructeurBrevoEnvoiMail {
    if (pieceJointe) {
      this.pieceJointe.push({
        content: pieceJointe.contenu,
        name: pieceJointe.nom,
      });
    }
    return this;
  }

  protected construisCorps() {
    return {
      sender: this.expediteur,
      to: this.destinataires,
      subject: this.sujet,
      textContent: this.contenu,
      ...(this.copie && this.copie.length > 0 && { cc: this.copie }),
      ...(this.copieInvisible &&
        this.copieInvisible.length > 0 && { bcc: this.copieInvisible }),
      ...(this.pieceJointe.length > 0 && { attachment: this.pieceJointe }),
    };
  }
}

class ConstructeurBrevoCreationContact extends ConstructeurBrevo<CreationContactBrevo> {
  private email: Email = '';
  private attributs: Record<string, string> = {} as Record<string, string>;

  constructor(methode: 'POST' | 'GET' = 'POST') {
    super(methode);
  }

  ayantPourEmail(email: Email): ConstructeurBrevoCreationContact {
    this.email = email;
    return this;
  }

  ayantPourAttributs(
    attributs: Record<string, string>
  ): ConstructeurBrevoCreationContact {
    this.attributs = attributs;
    return this;
  }

  protected construisCorps(): CreationContactBrevo {
    return {
      email: this.email,
      attributes: this.attributs,
      updateEnabled: true,
    };
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
