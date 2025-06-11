import { ParametresAPI } from './ConstructeurParametresAPI.ts';

export type MACAPIType = {
  execute: <REPONSE, REPONSEAPI, CORPS = void>(
    parametresAPI: ParametresAPI<CORPS>,
    transcris: (contenu: Promise<REPONSEAPI>) => Promise<REPONSE>,
    appel?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
  ) => Promise<REPONSE>;
};

export const macAPI = (): MACAPIType => {
  const execute = async <REPONSE, CORPS = void>(
    parametresAPI: ParametresAPI<CORPS>,
    transcris: (contenu: Promise<any>) => Promise<REPONSE>,
    appel: (
      input: RequestInfo | URL,
      init?: RequestInit
    ) => Promise<Response> = fetch
  ): Promise<REPONSE> => {
    const reponse = await appel(parametresAPI.url, {
      method: parametresAPI.methode,
      ...(parametresAPI.corps && {
        body: JSON.stringify(parametresAPI.corps),
      }),
      headers: {
        Accept: parametresAPI.headers?.['Accept'] || 'application/json',
        'Content-Type':
          parametresAPI.headers?.['Content-Type'] || 'application/json',
      },
    });
    const lien = reponse.headers.get('Link');
    if (lien !== null) {
      return transcris(Promise.resolve(lien));
    }

    if (reponse.status === 403) {
      const corpsReponse = await reponse.json();
      return await Promise.reject(corpsReponse);
    }

    if (!reponse.ok) {
      return await Promise.reject(await reponse.json());
    }
    if (reponse.headers.get('Content-Type') === 'application/pdf') {
      return transcris(reponse.blob());
    }
    if (reponse.status === 204) {
      return Promise.resolve() as Promise<REPONSE>;
    }
    if (reponse.headers.get('Content-Type')?.includes('application/json')) {
      return transcris(reponse.json());
    }
    return Promise.resolve() as Promise<REPONSE>;
  };

  return {
    execute: async <REPONSE, REPONSEAPI, CORPS = void>(
      parametresAPI: ParametresAPI<CORPS>,
      transcris: (contenu: Promise<REPONSEAPI>) => Promise<REPONSE>,
      call = fetch
    ) => {
      try {
        return execute(parametresAPI, transcris, call);
      } catch (erreur) {
        console.log(erreur);
        return await Promise.reject(erreur);
      }
    },
  };
};

export const useMACAPI = () => {
  return macAPI();
};
