import { ParametresAPI } from './ConstructeurParametresAPI.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { Action, ReponseHATEOAS } from '../../domaine/Lien.ts';

export const appelleAPI = async <REPONSE, CORPS = void>(
  parametresAPI: ParametresAPI<CORPS>,
  appel: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  navigationMAC: (
    moteurDeLiens: MoteurDeLiens,
    action: string,
    exclusion?: Action[],
  ) => void,
  transcris: (contenu: Promise<any>) => Promise<REPONSE>,
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
  if (reponse.status === 302) {
    const reponseHATEOAS = (await reponse.json()) as ReponseHATEOAS;
    navigationMAC(
      new MoteurDeLiens(reponseHATEOAS.liens),
      'creer-espace-aidant',
    );
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
  return transcris(reponse.json());
};
