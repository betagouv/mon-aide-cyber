import crypto from 'crypto';
import {
  AideDistant,
  AideDistantBrevoDTO,
  AideDistantDTO,
  EntrepotAideDistant,
} from '../../../../../src/infrastructure/entrepots/postgres/EntrepotAideConcret';
export class EntrepotAideBrevoMemoire implements EntrepotAideDistant {
  protected entites: Map<string, AideDistantBrevoDTO> = new Map();
  private avecMetaDonnees = true;

  async persiste(
    entite: AideDistant,
    chiffrement: (
      identifiantMAC: crypto.UUID,
      departement: string,
      siret: string,
      raisonSociale?: string
    ) => string
  ): Promise<void> {
    const contactBrevo: Omit<AideDistantBrevoDTO, 'attributes'> & {
      attributes: { METADONNEES?: string };
    } = {
      email: entite.email,
      attributes: {
        ...(this.avecMetaDonnees && {
          METADONNEES: chiffrement(
            entite.identifiantMAC,
            entite.departement.nom,
            entite.siret,
            entite.raisonSociale
          ),
        }),
      },
    };
    this.entites.set(entite.email, contactBrevo as AideDistantBrevoDTO);
  }

  async rechercheParEmail(email: string): Promise<AideDistantDTO | undefined> {
    const aideDistantDTO = this.entites.get(email);
    if (aideDistantDTO === undefined) {
      return undefined;
    }
    return {
      email: aideDistantDTO.email,
      metaDonnees: aideDistantDTO.attributes.METADONNEES,
    };
  }

  sansMetadonnees(): EntrepotAideBrevoMemoire {
    this.avecMetaDonnees = false;
    return this;
  }
}
