import { AdaptateurDeRequeteHTTP } from '../infrastructure/adaptateurs/adaptateurDeRequeteHTTP';

export type EPCI = { nom: string };

export interface AdaptateurGeographie {
  epciAvecCode(codeEpci: string): Promise<EPCI | undefined>;
}

export class AdaptateurGeographieMemoire implements AdaptateurGeographie {
  private epci: EPCI | undefined;
  constructor() {
    this.epci = { nom: 'Métropole de Bordeaux' };
  }

  sansCodeEPCI() {
    this.epci = undefined;
    return this;
  }

  async epciAvecCode(__codeEpci: string): Promise<EPCI | undefined> {
    return this.epci;
  }
}

class AdaptateurGeographieGeoAPI implements AdaptateurGeographie {
  async epciAvecCode(codeEpci: string): Promise<EPCI | undefined> {
    try {
      const reponse = await new AdaptateurDeRequeteHTTP().execute<
        { nom: string }[]
      >({
        url: `https://geo.api.gouv.fr/epcis?code=${codeEpci}`,
        methode: 'GET',
        headers: { Accept: 'application/json' },
      });
      return { nom: reponse[0]?.nom };
    } catch (erreur) {
      return undefined;
    }
  }
}

export const unAdaptateurGeographie = (): AdaptateurGeographie =>
  process.env.EPCI_ADAPTATEUR_GEOGRAPHIE === 'API'
    ? new AdaptateurGeographieGeoAPI()
    : new AdaptateurGeographieMemoire();
