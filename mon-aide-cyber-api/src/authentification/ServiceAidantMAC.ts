import { EntrepotAidant } from './Aidant';
import { AidantDTO, ServiceAidant } from './ServiceAidant';

class ServiceAidantMAC implements ServiceAidant {
  constructor(private readonly entrepotAidant: EntrepotAidant) {}

  async rechercheParMail(mailAidant: string): Promise<AidantDTO | undefined> {
    return this.entrepotAidant
      .rechercheParIdentifiantDeConnexion(mailAidant)
      .then((aidant) => ({
        identifiant: aidant.identifiant,
        identifiantConnexion: aidant.identifiantConnexion,
      }))
      .catch(() => undefined);
  }
}

export const unServiceAidant = (
  entrepotAidant: EntrepotAidant
): ServiceAidant => new ServiceAidantMAC(entrepotAidant);
