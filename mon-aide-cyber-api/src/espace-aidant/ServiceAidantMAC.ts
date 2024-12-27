import crypto from 'crypto';
import { Aidant, EntrepotAidant } from './Aidant';
import { AidantDTO, ServiceAidant } from './ServiceAidant';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

class ServiceAidantMAC implements ServiceAidant {
  constructor(private readonly entrepotAidant: EntrepotAidant) {}

  async rechercheParMail(mailAidant: string): Promise<AidantDTO | undefined> {
    return this.entrepotAidant
      .rechercheParEmail(mailAidant)
      .then((aidant) => this.mappeAidant(aidant))
      .catch(() => undefined);
  }

  async parIdentifiant(
    identifiant: crypto.UUID
  ): Promise<AidantDTO | undefined> {
    return this.entrepotAidant
      .lis(identifiant)
      .then((aidant) => this.mappeAidant(aidant))
      .catch(() => undefined);
  }

  valideLesCGU(identifiantAidant: crypto.UUID): Promise<void> {
    return this.entrepotAidant.lis(identifiantAidant).then(async (aidant) => {
      aidant.dateSignatureCGU = FournisseurHorloge.maintenant();
      return await this.entrepotAidant.persiste(aidant);
    });
  }

  private formateLeNom(nomPrenom: string): string {
    const [prenom, nom] = nomPrenom.split(' ');
    return `${prenom} ${nom ? `${nom[0]}.` : ''}`.trim();
  }

  private mappeAidant(aidant: Aidant): AidantDTO {
    return {
      identifiant: aidant.identifiant,
      email: aidant.email,
      nomUsage: this.formateLeNom(aidant.nomPrenom),
      nomComplet: aidant.nomPrenom,
      ...(aidant.siret && { siret: aidant.siret }),
      ...(aidant.dateSignatureCGU && {
        dateSignatureCGU: aidant.dateSignatureCGU,
      }),
    };
  }
}

export const unServiceAidant = (
  entrepotAidant: EntrepotAidant
): ServiceAidant => new ServiceAidantMAC(entrepotAidant);
