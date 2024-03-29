import { DTO, EntrepotPostgres } from './EntrepotPostgres';
import { Aide, EntrepotAide } from '../../../aide/Aide';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import crypto from 'crypto';

type DonneesAidesMAC = {
  dateSignatureCGU: string;
};

type AideMACDTO = DTO & {
  donnees: DonneesAidesMAC;
};

type AideMAC = Omit<Aide, 'email' | 'raisonSociale' | 'departement'>;

class EntrepotAidePostgres extends EntrepotPostgres<AideMAC, AideMACDTO> {
  protected champsAMettreAJour(aideDTO: AideMACDTO): Partial<AideMACDTO> {
    return { donnees: aideDTO.donnees };
  }

  protected nomTable(): string {
    return 'aides';
  }

  protected deEntiteADTO(aideMAC: AideMAC): AideMACDTO {
    return {
      id: aideMAC.identifiant,
      donnees: {
        dateSignatureCGU: aideMAC.dateSignatureCGU.toISOString(),
      },
    };
  }

  protected deDTOAEntite(dto: AideMACDTO): AideMAC {
    return {
      identifiant: dto.id,
      dateSignatureCGU: FournisseurHorloge.enDate(dto.donnees.dateSignatureCGU),
    };
  }
}

export type AideDistant = {
  email: string;
  identifiantMAC: crypto.UUID;
  departement: string;
  raisonSociale?: string;
};

export type AideDistantDTO = {
  email: string;
  metaDonnees: string;
};

export type AideDistantBrevoDTO = {
  email: string;
  attributes: {
    METADONNEES: string;
  };
};

export interface EntrepotAideDistant {
  persiste(
    entite: AideDistant,
    chiffrement: (
      identifiantMAC: crypto.UUID,
      departement: string,
      raisonSociale?: string,
    ) => string,
  ): Promise<void>;

  rechercheParEmail(
    email: string,
    mappeur: (dto: AideDistantDTO) => AideDistant,
  ): Promise<AideDistant | undefined>;
}

class EntrepotAideBrevo implements EntrepotAideDistant {
  rechercheParEmail(
    email: string,
    mappeur: (dto: AideDistantDTO) => AideDistant,
  ): Promise<AideDistant | undefined> {
    return fetch(`https://api.brevo.com/v3/contacts/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'api-key': process.env.BREVO_CLEF_API || '',
      },
    }).then(async (reponse) => {
      const aideBrevo: AideDistantBrevoDTO = await reponse.json();
      if (!reponse.ok) {
        if (reponse.status === 404) {
          return Promise.resolve(undefined);
        }
        return Promise.reject(aideBrevo);
      }
      return mappeur({
        email: aideBrevo.email,
        metaDonnees: aideBrevo.attributes.METADONNEES,
      });
    });
  }
  persiste(
    aide: AideDistant,
    chiffrement: (
      identifiantMAC: crypto.UUID,
      departement: string,
      raisonSociale?: string,
    ) => string,
  ): Promise<void> {
    return fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      body: JSON.stringify({
        email: aide.email,
        attributes: {
          metadonnees: chiffrement(
            aide.identifiantMAC,
            aide.departement,
            aide.raisonSociale,
          ),
        },
      }),
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'api-key': process.env.BREVO_CLEF_API || '',
      },
    }).then(async (reponse) => {
      if (!reponse.ok) {
        return Promise.reject(await reponse.json());
      }
      return Promise.resolve();
    });
  }
}

export class EntrepotAideConcret implements EntrepotAide {
  constructor(
    private readonly serviceChiffrement: ServiceDeChiffrement,
    private readonly entreprotAideBrevo: EntrepotAideDistant = new EntrepotAideBrevo(),
    private readonly entrepotAidePostgres = new EntrepotAidePostgres(),
  ) {}

  async rechercheParEmail(email: string): Promise<Aide | undefined> {
    const aideBrevo = await this.entreprotAideBrevo.rechercheParEmail(
      email,
      (dto) => {
        const metadonnees: {
          identifiantMAC: crypto.UUID;
          departement: string;
          raisonSociale: string;
        } = JSON.parse(this.serviceChiffrement.dechiffre(dto.metaDonnees));
        return {
          email: dto.email,
          raisonSociale: metadonnees.raisonSociale,
          departement: metadonnees.departement,
          identifiantMAC: metadonnees.identifiantMAC,
        };
      },
    );
    if (aideBrevo === undefined) {
      return Promise.resolve(undefined);
    }
    const aideMAC = await this.entrepotAidePostgres.lis(
      aideBrevo.identifiantMAC,
    );

    return {
      ...aideMAC,
      departement: aideBrevo.departement,
      ...(aideBrevo.raisonSociale && {
        raisonSociale: aideBrevo.raisonSociale,
      }),
      email: aideBrevo.email,
    };
  }

  async lis(_identifiant: string): Promise<Aide> {
    throw new Error('Method non implémentée.');
  }

  async persiste(aide: Aide): Promise<void> {
    await this.entrepotAidePostgres.persiste(aide);
    await this.entreprotAideBrevo.persiste(
      {
        email: aide.email,
        identifiantMAC: aide.identifiant,
        departement: aide.departement,
        ...(aide.raisonSociale && { raisonSociale: aide.raisonSociale }),
      },
      (identifiantMAC, departement, raisonSociale) =>
        this.serviceChiffrement.chiffre(
          JSON.stringify({ identifiantMAC, departement, raisonSociale }),
        ),
    );

    return Promise.resolve();
  }

  tous(): Promise<Aide[]> {
    throw new Error('Method not implemented.');
  }

  typeAggregat(): string {
    throw new Error('Method not implemented.');
  }
}
