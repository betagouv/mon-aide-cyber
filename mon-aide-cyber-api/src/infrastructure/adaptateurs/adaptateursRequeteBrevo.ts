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
type CorpsReponseRechercheContact = {
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
  methode: 'GET' | 'POST' | 'PUT';
  headers: Record<string, string>;
  corps?: T;
};
export type EnvoiMailBrevo = {
  sender: {
    name?: string;
    email: string;
  };
  subject: string;
  to: { email: string; name?: string }[];
  textContent: string;
};

export type EmailBrevo = { name?: string; email: string };
export type PieceJointeBrevo = { content: string; name: string };

export type CreationContactBrevo = {
  email: string;
  attributes: Record<string, string>;
  updateEnabled: true;
};
export type RechercheContactBrevo = string;

export class AdaptateursRequeteBrevo {
  envoiMail(): AdaptateurRequeteBrevo<
    RequeteBrevo<EnvoiMailBrevo>,
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

  protected adaptateur<T, R extends ReponseBrevo | ReponseBrevoEnErreur>(
    url: string
  ) {
    return new (class implements AdaptateurRequeteBrevo<RequeteBrevo<T>, R> {
      async execute(requete: RequeteBrevo<T>): Promise<R> {
        try {
          return (await fetch(url, {
            method: requete.methode,
            headers: requete.headers,
            ...((requete.methode === 'POST' || requete.methode === 'PUT') && {
              body: JSON.stringify(requete.corps),
            }),
          })) as unknown as R;
        } catch (erreur) {
          return await Promise.reject(erreur);
        }
      }
    })();
  }
}

export const adaptateursRequeteBrevo = () => new AdaptateursRequeteBrevo();

export const estReponseEnErreur = (
  reponse: ReponseBrevo | ReponseBrevoEnErreur
): reponse is ReponseBrevoEnErreur => {
  return !reponse.ok;
};
