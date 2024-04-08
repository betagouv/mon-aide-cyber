type ReponseBrevo = Response & {
  code?:
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
  message?: string;
};
interface AdaptateurRequeteBrevo<REQUETE, REPONSE extends ReponseBrevo> {
  execute(requete: REQUETE): Promise<REPONSE>;
}
type ReponseEnvoiMail = ReponseBrevo & {
  messageId?: string;
  messageIds?: string[];
};

export type APIBrevo = {
  methode: 'GET' | 'POST';
};
export type EnvoiMailBrevo = APIBrevo & {
  corps: {
    sender: {
      name?: string;
      email: string;
    };
    subject: string;
    to: { email: string; name?: string }[];
    textContent: string;
  };
  headers: Record<string, string>;
};
export type EmailBrevo = { name?: string; email: string };

class AdaptateurRequeteEnvoiMailBrevo
  implements AdaptateurRequeteBrevo<EnvoiMailBrevo, ReponseEnvoiMail>
{
  constructor(private readonly url = 'https://api.brevo.com/v3/smtp/email') {}
  execute(requete: EnvoiMailBrevo): Promise<ReponseEnvoiMail> {
    return fetch(this.url, {
      method: requete.methode,
      headers: requete.headers,
      body: JSON.stringify(requete.corps),
    });
  }
}

class AdaptateursRequeteBrevo {
  envoiMail(): AdaptateurRequeteBrevo<EnvoiMailBrevo, ReponseEnvoiMail> {
    return new AdaptateurRequeteEnvoiMailBrevo();
  }
}
export const adaptateursRequeteBrevo = () => new AdaptateursRequeteBrevo();
