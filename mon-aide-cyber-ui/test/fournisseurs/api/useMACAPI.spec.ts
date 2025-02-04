import { describe, expect, it } from 'vitest';
import { macAPI } from '../../../src/fournisseurs/api/useMACAPI';

type Headers = {
  Accept: string;
  'Content-Type': string;
};
type InformationsEnvoyees<V = void> = {
  url: string;
  methode: string;
  corps?: V;
  headers: Headers;
};

class ConstructeurDeReponse {
  private _ok = false;
  private _status = 404;
  private _json?: any;
  private _headers: { [contentType: string]: string } = {};

  ok(): ConstructeurDeReponse {
    this._ok = true;
    this._status = 200;
    return this;
  }

  json(contenu: any): ConstructeurDeReponse {
    this._json = contenu;
    this._headers = { 'Content-Type': 'application/json; charset=utf-8' };
    return this;
  }

  construis(): Response {
    return {
      ok: this._ok,
      status: this._status,
      json: () => Promise.resolve(this._json),
      headers: {
        get: (clef: string) => {
          const headers = Object.entries(this._headers)
            .filter(([header]) => clef === header)
            .flatMap(([, contenu]) => contenu);
          return headers.length > 0 ? headers[0] : null;
        },
      },
    } as unknown as Response;
  }
}

describe('Appelle API', () => {
  describe('pour des requêtes GET', () => {
    it("les headers sont positionnés par défaut à 'application/json'", async () => {
      const api = macAPI();

      const reponse = await api.execute<
        InformationsEnvoyees,
        InformationsEnvoyees
      >(
        {
          url: 'url',
          methode: 'GET',
        },
        (contenu: Promise<InformationsEnvoyees>) => contenu,
        (input: any, init: RequestInit | undefined) => {
          const infos: InformationsEnvoyees = {
            url: input as RequestInfo as string,
            methode: init!.method!,
            headers: init!.headers! as Headers,
          };
          return Promise.resolve(
            new ConstructeurDeReponse().ok().json(infos).construis()
          );
        }
      );

      expect(reponse).toStrictEqual<InformationsEnvoyees>({
        url: 'url',
        methode: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });
  });
});
