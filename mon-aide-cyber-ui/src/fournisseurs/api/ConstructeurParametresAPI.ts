export type ParametresAPI<CORPS = void> = {
  url: string;
  methode: string;
  corps?: CORPS;
  headers?: Record<string, string>;
};

class ConstructeurParametresAPI<CORPS = void> {
  private _url = '';
  private _methode = '';
  private _corps: CORPS | undefined = undefined;
  private _headers: { Accept: string; 'Content-Type': string } = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  url(url: string): ConstructeurParametresAPI<CORPS> {
    this._url = url;
    return this;
  }

  methode(methode: string): ConstructeurParametresAPI<CORPS> {
    this._methode = methode;
    return this;
  }

  corps(corps: CORPS): ConstructeurParametresAPI<CORPS> {
    this._corps = corps;
    return this;
  }

  construis(): ParametresAPI<CORPS> {
    return {
      url: this._url,
      methode: this._methode,
      ...(this._corps && { corps: this._corps }),
      headers: this._headers,
    };
  }

  accept(type: string): ConstructeurParametresAPI<CORPS> {
    this._headers.Accept = type;
    return this;
  }
}

export const constructeurParametresAPI = <CORPS = void>() =>
  new ConstructeurParametresAPI<CORPS>();
