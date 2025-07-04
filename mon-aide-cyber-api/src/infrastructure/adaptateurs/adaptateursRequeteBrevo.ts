type ReponseBrevo = Response;

type CorpsReponseEnErreur = {
  code:
    | 'invalid_parameter'
    | 'missing_parameter'
    | 'out_of_range'
    | 'campaign_processing'
    | 'campaign_sent'
    | 'document_not_found'
    | 'reseller_permission_denied'
    | 'not_enough_credits'
    | 'permission_denied'
    | 'duplicate_parameter'
    | 'duplicate_request'
    | 'method_not_allowed'
    | 'unauthorized'
    | 'account_under_validation'
    | 'not_acceptable'
    | 'bad_request';
  message: string;
};
type ReponseBrevoEnErreur = Omit<ReponseBrevo, 'json'> & {
  json: () => Promise<CorpsReponseEnErreur>;
};

type CorpsReponseEnvoiMail = { messageId: string; messageIds: string[] };
type ReponseEnvoiMail = Omit<ReponseBrevo, 'json'> & {
  json: () => Promise<CorpsReponseEnvoiMail>;
};
type CorpsReponseCreationContact = { id: string };
type ReponseCreationContact = Omit<ReponseBrevo, 'json'> & {
  json: () => Promise<CorpsReponseCreationContact>;
};
export type CorpsReponseRechercheContact = {
  email: string;
  id: string;
  attributes: any;
};
type ReponseRechercheContact = Omit<ReponseBrevo, 'json'> & {
  json: () => Promise<CorpsReponseRechercheContact>;
};

interface AdaptateurRequeteBrevo<REQUETE, REPONSE extends Response> {
  execute(requete: REQUETE): Promise<REPONSE>;
}

export type RequeteBrevo<T = void> = {
  methode: 'GET' | 'POST';
  headers: Record<string, string>;
  corps?: T;
};

export type DestinataireBrevo = { email: string; name?: string };

export type EnvoiMailBrevoTexteBrut = {
  sender: {
    name?: string;
    email: string;
  };
  subject: string;
  to: DestinataireBrevo[];
  textContent: string;
  attachment?: PieceJointeBrevo[];
};

export type EnvoiMailBrevoAvecTemplate = {
  templateId: number;
  to: DestinataireBrevo[];
  cc?: DestinataireBrevo[];
  bcc?: DestinataireBrevo[];
  params?: Record<string, string | Record<string, string>>;
  attachment?: PieceJointeBrevo[];
};

export type EmailBrevo = { name?: string; email: string };

export type PieceJointeBrevo = { content: string; name: string };

export type CreationContactBrevo = {
  email: string;
  attributes: Record<string, string>;
  updateEnabled: true;
};

export type RechercheContactBrevo = string;

export type CreationEvenement = {
  identifiers: {
    email_id: string;
  };
  event_name: string;
};

export type ReponseCreationEvenement = ReponseBrevo;

export class ErreurRequeBrevo extends Error {
  constructor(
    public readonly corps: object,
    public readonly status: number
  ) {
    super(JSON.stringify(corps));
  }
}

export class AdaptateursRequeteBrevo {
  envoiMail(): AdaptateurRequeteBrevo<
    RequeteBrevo<EnvoiMailBrevoTexteBrut | EnvoiMailBrevoAvecTemplate>,
    ReponseEnvoiMail | ReponseBrevoEnErreur
  > {
    return this.adaptateur('https://api.brevo.com/v3/smtp/email');
  }

  creationContact(): AdaptateurRequeteBrevo<
    RequeteBrevo<CreationContactBrevo>,
    ReponseCreationContact | ReponseBrevoEnErreur
  > {
    return this.adaptateur('https://api.brevo.com/v3/contacts');
  }

  rechercheContact(
    email: string
  ): AdaptateurRequeteBrevo<
    RequeteBrevo<RechercheContactBrevo>,
    ReponseRechercheContact | ReponseBrevoEnErreur
  > {
    return this.adaptateur(`https://api.brevo.com/v3/contacts/${email}`);
  }

  creationEvenement(): AdaptateurRequeteBrevo<
    RequeteBrevo<CreationEvenement>,
    ReponseCreationEvenement
  > {
    return this.adaptateur('https://api.brevo.com/v3/events');
  }

  protected adaptateur<T, R extends ReponseBrevo | ReponseBrevoEnErreur>(
    url: string
  ) {
    return new (class implements AdaptateurRequeteBrevo<RequeteBrevo<T>, R> {
      async execute(requete: RequeteBrevo<T>): Promise<R> {
        console.log('INITIE APPEL BREVO', url);
        const reponse = (await fetch(url, {
          method: requete.methode,
          headers: requete.headers,
          ...(requete.methode === 'POST' && {
            body: JSON.stringify(requete.corps),
          }),
        })) as unknown as R;
        if (estReponseEnErreur(reponse)) {
          const corps = await reponse.json();
          console.error(
            'ERREUR BREVO',
            JSON.stringify({
              contexte: 'Appel Brevo',
              details: corps.code,
              message: corps.message,
            })
          );
          throw new ErreurRequeBrevo(corps, reponse.status);
        }
        console.log('FIN APPEL BREVO : OK', url);
        return reponse;
      }
    })();
  }
}

export const adaptateursRequeteBrevo = () => new AdaptateursRequeteBrevo();
const estReponseEnErreur = (
  reponse: ReponseBrevo | ReponseBrevoEnErreur
): reponse is ReponseBrevoEnErreur => {
  return !reponse.ok;
};
