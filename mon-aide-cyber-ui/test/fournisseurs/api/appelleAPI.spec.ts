import { describe, expect } from 'vitest';
import { appelleAPI } from '../../../src/fournisseurs/api/appelleAPI.ts';

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

  ok(): ConstructeurDeReponse {
    this._ok = true;
    this._status = 200;
    return this;
  }

  json(contenu: any): ConstructeurDeReponse {
    this._json = contenu;
    return this;
  }

  construis(): Response {
    return {
      ok: this._ok,
      status: this._status,
      json: () => Promise.resolve(this._json),
      headers: { get: () => null },
    } as unknown as Response;
  }
}

describe('Appelle API', () => {
  describe('pour des requêtes GET', () => {
    it("les headers sont positionnés par défaut à 'application/json'", async () => {
      const reponse = await appelleAPI<InformationsEnvoyees>(
        { url: 'url', methode: 'GET' },
        (input, init) => {
          const infos: InformationsEnvoyees = {
            url: input as RequestInfo as string,
            methode: init!.method!,
            headers: init!.headers! as Headers,
          };
          return Promise.resolve(
            new ConstructeurDeReponse().ok().json(infos).construis(),
          );
        },
        (_vers, _state) => Promise.resolve(),
        (contenu) => {
          console.log('contenu', contenu);
          return contenu;
        },
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
