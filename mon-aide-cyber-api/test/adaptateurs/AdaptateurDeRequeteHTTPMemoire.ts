import {
  AdaptateurDeRequeteHTTP,
  RequeteHTTP,
} from '../../src/infrastructure/adaptateurs/adaptateurDeRequeteHTTP';

export class AdaptateurDeRequeteHTTPMemoire extends AdaptateurDeRequeteHTTP {
  private _reponse: any;
  private _enErreur = false;
  requeteAttendue = '';

  execute<REPONSE, REQUETE = void>(
    requete: RequeteHTTP<REQUETE>
  ): Promise<REPONSE> {
    return super.execute(requete, (_input, _init) => {
      this.requeteAttendue = _input.toString();

      const reponse: Response = {
        json: () => this._reponse,
        headers: {} as Headers,
        status: this._enErreur ? 400 : 200,
        ok: !this._enErreur,
        redirected: false,
        statusText: 'status',
        type: 'default',
        url: '',
        clone: () => ({}) as Response,
        body: new Blob(['Hello']).stream(),
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
        blob: () => Promise.resolve(new Blob(['Hello'])),
        formData: () => Promise.resolve({} as FormData),
        text: () => Promise.resolve('Hello'),
      };
      return Promise.resolve(reponse);
    });
  }

  reponse<REPONSE>(reponse: REPONSE, enErreur = false) {
    this._reponse = reponse;
    this._enErreur = enErreur;
  }
}
