import { DTO, EntrepotPostgres } from './EntrepotPostgres';
import { Aide, EntrepotAide } from '../../../aide/Aide';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';

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

export type AideBrevo = {
  email: string;
  attributes: {
    metadata: string;
  };
};

export interface EntrepotAideToto {
  persiste(entite: AideBrevo): Promise<void>;
}

class EntrepotAideBrevo implements EntrepotAideToto {
  persiste(_aide: AideBrevo): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export class EntrepotAideConcret implements EntrepotAide {
  constructor(
    private readonly serviceChiffrement: ServiceDeChiffrement,
    private readonly entreprotAideBrevo: EntrepotAideToto = new EntrepotAideBrevo(),
    private readonly entrepotAidePostgres = new EntrepotAidePostgres()
  ) {}

  rechercheParEmail(_email: string): Promise<Aide | undefined> {
    throw new Error('Method not implemented.');
  }

  // il faudrait que le test teste EntrepotAideConcretPourTest qui étendrait de EntrepotAideConcret
  // dans lequel .lis() serait implémenté alors que dans la classe concrète ce serait
  // une exception.
  async lis(identifiant: string): Promise<Aide> {
    const aideMAC = await this.entrepotAidePostgres.lis(identifiant);
    // const aideBrevo = await this.entreprotAideBrevo.lis();

    return {
      ...aideMAC,
      departement: '',
      raisonSociale: '',
      email: '',
    };
  }

  async persiste(aide: Aide): Promise<void> {
    await this.entrepotAidePostgres.persiste(aide);
    await this.entreprotAideBrevo.persiste({
      email: aide.email,
      attributes: {
        metadata: this.serviceChiffrement.chiffre(
          JSON.stringify({
            identifiantMAC: aide.identifiant,
            departement: aide.departement,
            raisonSociale: aide.raisonSociale,
          })
        ),
      },
    });

    return Promise.resolve();
  }

  tous(): Promise<Aide[]> {
    throw new Error('Method not implemented.');
  }

  typeAggregat(): string {
    throw new Error('Method not implemented.');
  }
}
