import { DTO, EntrepotPostgres } from './EntrepotPostgres';
import { Aide, EntrepotAide } from '../../../aide/Aide';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';

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

export class EntrepotAideConcret implements EntrepotAide {
  constructor(
    private readonly entrepotAidePostgres = new EntrepotAidePostgres()
  ) {}

  rechercheParEmail(_email: string): Promise<Aide | undefined> {
    throw new Error('Method not implemented.');
  }

  async lis(identifiant: string): Promise<Aide> {
    const aideMAC = await this.entrepotAidePostgres.lis(identifiant);

    return {
      ...aideMAC,
      departement: '',
      raisonSociale: '',
      email: '',
    };
  }

  persiste(entite: Aide): Promise<void> {
    return this.entrepotAidePostgres.persiste(entite);
  }

  tous(): Promise<Aide[]> {
    throw new Error('Method not implemented.');
  }

  typeAggregat(): string {
    throw new Error('Method not implemented.');
  }
}
