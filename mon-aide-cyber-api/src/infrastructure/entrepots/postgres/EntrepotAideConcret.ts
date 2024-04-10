import { DTO, EntrepotPostgres } from './EntrepotPostgres';
import { Aide, EntrepotAide } from '../../../aide/Aide';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import crypto from 'crypto';
import {
  unConstructeurCreationDeContact,
  unConstructeurRechercheDeContact,
} from '../../brevo/ConstructeursBrevo';
import {
  adaptateursRequeteBrevo,
  estReponseEnErreur,
} from '../../adaptateurs/adaptateursRequeteBrevo';
import { AggregatNonTrouve } from '../../../domaine/Aggregat';

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

  typeAggregat(): string {
    return 'Aide';
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
    return adaptateursRequeteBrevo()
      .rechercheContact(email)
      .execute(unConstructeurRechercheDeContact().construis())
      .then(async (reponse) => {
        if (estReponseEnErreur(reponse)) {
          console.error(
            'ERREUR BREVO',
            JSON.stringify({
              contexte: 'Recherche contact',
              details: reponse.code,
              message: reponse.message,
            }),
          );
          if (reponse.status === 404) {
            return Promise.resolve(undefined);
          }
          return Promise.reject(reponse.message);
        }
        const aideBrevo: AideDistantBrevoDTO = {
          email: reponse.email,
          attributes: { METADONNEES: reponse.attributes.METADONNEES },
        };
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
    const requete = unConstructeurCreationDeContact()
      .ayantPourEmail(aide.email)
      .ayantPourAttributs({
        metadonnees: chiffrement(
          aide.identifiantMAC,
          aide.departement,
          aide.raisonSociale,
        ),
      })
      .construis();
    return adaptateursRequeteBrevo()
      .creationContact()
      .execute(requete)
      .then((reponse) => {
        if (estReponseEnErreur(reponse)) {
          console.error(
            'ERREUR BREVO',
            JSON.stringify({
              contexte: 'Création contact',
              details: reponse.code,
              message: reponse.message,
            }),
          );
          return Promise.reject(reponse.message);
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
    try {
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
    } catch (erreur) {
      if (erreur instanceof AggregatNonTrouve) {
        console.error(
          "L'Aidé demandé n'existe pas.",
          JSON.stringify({
            contexte: 'Recherche par Email',
            aide: email,
            erreur,
          }),
        );
        return Promise.reject("L'Aidé demandé n'existe pas.");
      }
      console.error(
        "ERREUR LORS DE LA RÉCUPÉRATION DES INFORMATIONS DE L'AIDÉ",
        JSON.stringify({
          contexte: 'Recherche par Email',
          erreur,
        }),
      );
      return Promise.reject(
        "Impossible de récupérer les informations de l'Aidé.",
      );
    }
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
