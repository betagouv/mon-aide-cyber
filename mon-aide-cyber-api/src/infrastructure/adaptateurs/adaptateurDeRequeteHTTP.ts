export type RequeteHTTP<CORPS = void> = {
  url: string | URL;
  methode: 'GET' | 'POST';
  headers: Record<string, string>;
  corps?: CORPS;
};

export type ReponseRequeteHTTPEnErreur = {
  corps: object;
  codeErreur: number;
};

export class AdaptateurDeRequeteHTTP {
  async execute<REPONSE, REQUETE = void>(
    requete: RequeteHTTP<REQUETE>,
    appel = fetch
  ): Promise<REPONSE> {
    return appel(requete.url, {
      method: requete.methode,
      headers: requete.headers,
    })
      .then((reponse) => {
        if (reponse.ok) {
          return Promise.resolve(reponse.json() as REPONSE);
        }
        return Promise.reject({
          corps: reponse.json(),
          codeErreur: reponse.status,
        });
      })
      .catch((erreur) => Promise.reject(erreur));
  }
}
