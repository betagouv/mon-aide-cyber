import { ParametresAPI } from './ConstructeurParametresAPI.ts';

export const appelleAPI = async <REPONSE, CORPS = void>(
  parametresAPI: ParametresAPI<CORPS>,
  appel: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  transcris: (contenu: Promise<any>) => Promise<REPONSE>
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
