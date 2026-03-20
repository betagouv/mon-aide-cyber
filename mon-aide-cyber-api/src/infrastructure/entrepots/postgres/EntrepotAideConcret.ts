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
  CorpsReponseRechercheContacts,
  ErreurRequeBrevo,
} from '../../adaptateurs/adaptateursRequeteBrevo';
import {
  Departement,
  rechercheParNomDepartement,
} from '../../../gestion-demandes/departements';
import {
  CriteresDeDemande,
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

type AideMAC = Omit<
  DemandeAide,
  'email' | 'raisonSociale' | 'departement' | 'siret'
>;

class EntrepotAidePostgres
  extends EntrepotEcriturePostgres<AideMAC, AideMACDTO>
  implements EntrepotAideMAC
{
  async lesDemandes(identifiantsDemandes: crypto.UUID[]): Promise<AideMAC[]> {
    return (
      await this.knex.from(this.nomTable()).whereIn('id', identifiantsDemandes)
    ).map((aideDTO) => this.deDTOAEntite(aideDTO));
  }

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
  siret: string;
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
      siret: string,
      raisonSociale?: string
    ) => string
  ): Promise<void>;

  rechercheParEmail(email: string): Promise<AideDistantDTO | undefined>;

  rechercheParCriteres(criteres: CriteresDeDemande): Promise<AideDistantDTO[]>;
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
      siret: string,
      raisonSociale?: string
    ) => string
  ): Promise<void> {
    const laCreation = unConstructeurCreationDeContact()
      .ayantPourEmail(entite.email)
      .ayantPourAttributs({
        metadonnees: chiffrement(
          entite.identifiantMAC,
          entite.departement.nom,
          entite.siret,
          entite.raisonSociale
        ),
      })
      .construis();

    await adaptateursRequeteBrevo().creationContact().execute(laCreation);
  }

  async rechercheParCriteres(
    criteres: CriteresDeDemande
  ): Promise<AideDistantDTO[]> {
    const executeLaRecherche = async (
      indice: number,
      contactsDistants: CorpsReponseRechercheContact[]
    ): Promise<CorpsReponseRechercheContact[]> => {
      const reponse = await adaptateursRequeteBrevo()
        .rechercheContacts({
          depuisDate: criteres.dateSignatureCGU!,
          segment: 3,
          indice: indice,
          limite: 1000,
        })
        .execute(unConstructeurRechercheDeContact().construis());

      const corpsReponse: CorpsReponseRechercheContacts =
        (await reponse.json()) as CorpsReponseRechercheContacts;
      contactsDistants.push(...corpsReponse.contacts);
      if (contactsDistants.length < corpsReponse.count) {
        return executeLaRecherche(indice + 1000, contactsDistants);
      }
      return contactsDistants;
    };

    try {
      const contactsDistants = await executeLaRecherche(0, []);
      return contactsDistants.map((contact) => ({
        email: contact.email,
        metaDonnees: contact.attributes.METADONNEES,
      }));
    } catch (erreur: unknown | ErreurRequeBrevo) {
      if (erreur instanceof ErreurRequeBrevo && erreur.status === 404) {
        return [];
      }
      throw erreur;
    }
  }
}

interface EntrepotAideMAC extends EntrepotEcriture<AideMAC> {
  lesDemandes(identifiantsDemandes: crypto.UUID[]): Promise<AideMAC[]>;
}

export class EntrepotAideConcret implements EntrepotDemandeAide {
  constructor(
    private readonly serviceChiffrement: ServiceDeChiffrement,
    private readonly repertoireDeContacts: RepertoireDeContacts,
    private readonly entreprotAideBrevo: EntrepotAideDistant = new EntrepotAideBrevo(),
    private readonly entrepotAidePostgres: EntrepotAideMAC = new EntrepotAidePostgres()
  ) {}

  async toutes(criteres: CriteresDeDemande): Promise<DemandeAide[]> {
    const aidesDistants: AideDistantDTO[] =
      await this.entreprotAideBrevo.rechercheParCriteres(criteres);

    const aides = aidesDistants.map((aideBrevo) => {
      const metadonnees: {
        identifiantMAC: crypto.UUID;
        departement: string;
        raisonSociale: string;
        siret: string;
      } = JSON.parse(this.serviceChiffrement.dechiffre(aideBrevo.metaDonnees));

      return {
        email: aideBrevo.email,
        raisonSociale: metadonnees.raisonSociale,
        departement: rechercheParNomDepartement(metadonnees.departement),
        identifiantMAC: metadonnees.identifiantMAC,
        siret: metadonnees.siret ?? 'NON_DISPONIBLE',
      };
    });

    const demandes: AideMAC[] = await this.entrepotAidePostgres.lesDemandes(
      aides.map((a) => a.identifiantMAC)
    );

    return aides.reduce((precedent, courant) => {
      const demandeCorrespondante = demandes.find(
        (d) => d.identifiant === courant.identifiantMAC
      );
      if (demandeCorrespondante) {
        precedent.push({
          ...demandeCorrespondante,
          departement: courant.departement,
          ...(courant.raisonSociale && {
            raisonSociale: courant.raisonSociale,
          }),
          email: courant.email,
          siret: courant.siret,
        });
      }
      return precedent;
    }, [] as DemandeAide[]);
  }

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
      siret: string;
    } = JSON.parse(this.serviceChiffrement.dechiffre(aideBrevo.metaDonnees));

    const aide: AideDistant = {
      email: aideBrevo.email,
      raisonSociale: metadonnees.raisonSociale,
      departement: rechercheParNomDepartement(metadonnees.departement),
      identifiantMAC: metadonnees.identifiantMAC,
      siret: metadonnees.siret ?? 'NON_DISPONIBLE',
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
          siret: aide.siret,
        },
        etat: 'COMPLET',
      };
    } catch (_erreur) {
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
        siret: aide.siret,
      },
      (identifiantMAC, departement, siret, raisonSociale) =>
        this.serviceChiffrement.chiffre(
          JSON.stringify({ identifiantMAC, departement, raisonSociale, siret })
        )
    );

    await this.repertoireDeContacts.creeAide(aide.email);
  }
}
