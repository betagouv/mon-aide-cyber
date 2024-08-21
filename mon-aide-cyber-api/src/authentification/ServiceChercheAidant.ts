import { Aidant, EntrepotAidant } from './Aidant';

export class ServiceChercheAidant {
  constructor(private readonly entrepotAidant: EntrepotAidant) {}

  async chercheParMail(mailAidant: string): Promise<Aidant | undefined> {
    return this.entrepotAidant
      .rechercheParIdentifiantDeConnexion(mailAidant)
      .then((aidant) => aidant)
      .catch(() => undefined);
  }
}
