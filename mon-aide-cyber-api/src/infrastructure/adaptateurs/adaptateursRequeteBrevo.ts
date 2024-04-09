type ReponseBrevo = Response;

interface ReponseBrevoEnErreur extends ReponseBrevo {
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
}

type ReponseEnvoiMail = ReponseBrevo & {
  messageId: string;
  messageIds: string[];
};
type ReponseCreationContact = ReponseBrevo & {
  id: string;
};

interface AdaptateurRequeteBrevo<REQUETE, REPONSE extends ReponseBrevo> {
  execute(requete: REQUETE): Promise<REPONSE>;
}
export type APIBrevo<T> = {
  methode: 'GET' | 'POST';
  headers: Record<string, string>;
  corps: T;
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
export type CreationContactBrevo = {
  email: string;
  attributes: Record<string, string>;
};

export class AdaptateursRequeteBrevo {
  envoiMail(): AdaptateurRequeteBrevo<
    APIBrevo<EnvoiMailBrevo>,
    ReponseEnvoiMail
  > {
    return this.adaptateur('https://api.brevo.com/v3/smtp/email');
  }

  creationContact(): AdaptateurRequeteBrevo<
    APIBrevo<CreationContactBrevo>,
    ReponseCreationContact
  > {
    return this.adaptateur('https://api.brevo.com/v3/contacts');
  }

  protected adaptateur<T, R extends ReponseBrevo | ReponseBrevoEnErreur>(
    url: string,
  ) {
    return new (class implements AdaptateurRequeteBrevo<APIBrevo<T>, R> {
      execute(requete: APIBrevo<T>): Promise<R> {
        return fetch(url, {
          method: requete.methode,
          headers: requete.headers,
          body: JSON.stringify(requete.corps),
        }) as unknown as Promise<R>;
      }
    })();
  }
}
export const adaptateursRequeteBrevo = () => new AdaptateursRequeteBrevo();
