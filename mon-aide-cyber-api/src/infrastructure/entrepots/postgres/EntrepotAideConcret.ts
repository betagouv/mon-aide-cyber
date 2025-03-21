import { DTO, EntrepotEcriturePostgres } from './EntrepotPostgres';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import crypto from 'crypto';
import {
  unConstructeurCreationDeContact,
  unConstructeurRechercheDeContact,
} from '../../brevo/ConstructeursBrevo';
import {
  adaptateursRequeteBrevo,
  CorpsReponseRechercheContact,
  ErreurRequeBrevo,
} from '../../adaptateurs/adaptateursRequeteBrevo';
import {
  Departement,
  rechercheParNomDepartement,
} from '../../../gestion-demandes/departements';
import {
  DemandeAide,
  EntrepotDemandeAide,
  RechercheDemandeAide,
} from '../../../gestion-demandes/aide/DemandeAide';
import { EntrepotEcriture } from '../../../domaine/Entrepot';
import { RepertoireDeContacts } from '../../../contacts/RepertoireDeContacts';

type DonneesAidesMAC = {
  dateSignatureCGU: string;
};

type AideMACDTO = DTO & {
  donnees: DonneesAidesMAC;
};

type AideMAC = Omit<DemandeAide, 'email' | 'raisonSociale' | 'departement'>;

class EntrepotAidePostgres extends EntrepotEcriturePostgres<
  AideMAC,
  AideMACDTO
> {
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
  departement: Departement;
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
      raisonSociale?: string
    ) => string
  ): Promise<void>;

  rechercheParEmail(email: string): Promise<AideDistantDTO | undefined>;
}

class EntrepotAideBrevo implements EntrepotAideDistant {
  async rechercheParEmail(email: string): Promise<AideDistantDTO | undefined> {
    try {
      const reponse = await adaptateursRequeteBrevo()
        .rechercheContact(email)
        .execute(unConstructeurRechercheDeContact().construis());

      const corpsReponse: CorpsReponseRechercheContact =
        (await reponse.json()) as CorpsReponseRechercheContact;
      const aideBrevo: AideDistantBrevoDTO = {
        email: corpsReponse.email,
        attributes: { METADONNEES: corpsReponse.attributes.METADONNEES },
      };
      return {
        email: aideBrevo.email,
        metaDonnees: aideBrevo.attributes.METADONNEES,
      };
    } catch (erreur: unknown | ErreurRequeBrevo) {
      if (erreur instanceof ErreurRequeBrevo && erreur.status === 404) {
        return undefined;
      }
      throw erreur;
    }
  }

  async persiste(
    entite: AideDistant,
    chiffrement: (
      identifiantMAC: crypto.UUID,
      departement: string,
      raisonSociale?: string
    ) => string
  ): Promise<void> {
    const laCreation = unConstructeurCreationDeContact()
      .ayantPourEmail(entite.email)
      .ayantPourAttributs({
        metadonnees: chiffrement(
          entite.identifiantMAC,
          entite.departement.nom,
          entite.raisonSociale
        ),
      })
      .construis();

    await adaptateursRequeteBrevo().creationContact().execute(laCreation);
  }
}

export class EntrepotAideConcret implements EntrepotDemandeAide {
  constructor(
    private readonly serviceChiffrement: ServiceDeChiffrement,
    private readonly repertoireDeContacts: RepertoireDeContacts,
    private readonly entreprotAideBrevo: EntrepotAideDistant = new EntrepotAideBrevo(),
    private readonly entrepotAidePostgres: EntrepotEcriture<AideMAC> = new EntrepotAidePostgres()
  ) {}

  async rechercheParEmail(email: string): Promise<RechercheDemandeAide> {
    let aideBrevo: AideDistantDTO | undefined;
    try {
      aideBrevo = await this.entreprotAideBrevo.rechercheParEmail(email);
    } catch (erreur) {
      throw new Error("Impossible de récupérer les informations de l'Aidé.", {
        cause: erreur,
      });
    }

    if (aideBrevo === undefined) return { etat: 'INEXISTANT' };

    if (!aideBrevo.metaDonnees) return { etat: 'INCOMPLET' };

    const metadonnees: {
      identifiantMAC: crypto.UUID;
      departement: string;
      raisonSociale: string;
    } = JSON.parse(this.serviceChiffrement.dechiffre(aideBrevo.metaDonnees));

    const aide: AideDistant = {
      email: aideBrevo.email,
      raisonSociale: metadonnees.raisonSociale,
      departement: rechercheParNomDepartement(metadonnees.departement),
      identifiantMAC: metadonnees.identifiantMAC,
    };

    try {
      const aideMAC: AideMAC = await this.entrepotAidePostgres.lis(
        aide.identifiantMAC
      );

      return {
        demandeAide: {
          ...aideMAC,
          departement: aide.departement,
          ...(aide.raisonSociale && { raisonSociale: aide.raisonSociale }),
          email: aide.email,
        },
        etat: 'COMPLET',
      };
    } catch (erreur) {
      return { etat: 'INEXISTANT' };
    }
  }

  async persiste(aide: DemandeAide): Promise<void> {
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
          JSON.stringify({ identifiantMAC, departement, raisonSociale })
        )
    );

    await this.repertoireDeContacts.creeAide(aide.email);
  }
}
