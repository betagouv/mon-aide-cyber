import { AdaptateurDeRequeteHTTP } from '../infrastructure/adaptateurs/adaptateurDeRequeteHTTP';

export type EPCI = { nom: string };

export interface AdaptateurGeographie {
  epciAvecCode(codeEpci: string): Promise<EPCI>;
}

export class AdaptateurGeographieMemoire implements AdaptateurGeographie {
  async epciAvecCode(__codeEpci: string): Promise<EPCI> {
    return { nom: 'Métropole de Bordeaux' };
  }
}

class AdaptateurGeographieGeoAPI implements AdaptateurGeographie {
  async epciAvecCode(codeEpci: string): Promise<EPCI> {
    const reponse = await new AdaptateurDeRequeteHTTP().execute<
      { nom: string }[]
    >({
      url: `https://geo.api.gouv.fr/epcis?code=${codeEpci}`,
      methode: 'GET',
      headers: { Accept: 'application/json' },
    });
    return { nom: reponse[0]?.nom };
  }
}

export const unAdaptateurGeographie = (): AdaptateurGeographie =>
  process.env.NODE_ENV === 'production'
    ? new AdaptateurGeographieGeoAPI()
    : new AdaptateurGeographieMemoire();
