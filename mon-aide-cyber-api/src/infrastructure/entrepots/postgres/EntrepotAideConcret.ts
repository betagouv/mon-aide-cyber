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
  attributes: {
    metadata: string;
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
    _email: string,
    _mappeur: (dto: AideDistantDTO) => AideDistant,
  ): Promise<AideDistant | undefined> {
    return Promise.resolve(undefined);
  }
  persiste(
    _aide: AideDistant,
    _chiffrement: (
      identifiantMAC: crypto.UUID,
      departement: string,
      raisonSociale?: string,
    ) => string,
  ): Promise<void> {
    // throw new Error('Method not implemented.');
    return Promise.resolve();
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
        const metadata: {
          identifiantMAC: crypto.UUID;
          departement: string;
          raisonSociale: string;
        } = JSON.parse(
          this.serviceChiffrement.dechiffre(dto.attributes.metadata),
        );
        return {
          email: dto.email,
          raisonSociale: metadata.raisonSociale,
          departement: metadata.departement,
          identifiantMAC: metadata.identifiantMAC,
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
