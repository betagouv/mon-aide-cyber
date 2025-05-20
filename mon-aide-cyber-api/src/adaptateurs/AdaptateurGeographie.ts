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
  epciAvecCode(__codeEpci: string): Promise<EPCI> {
    throw new Error('Method not implemented.');
  }
}

export const unAdaptateurGeographie = (): AdaptateurGeographie =>
  process.env.NODE_ENV === 'production'
    ? new AdaptateurGeographieGeoAPI()
    : new AdaptateurGeographieMemoire();
