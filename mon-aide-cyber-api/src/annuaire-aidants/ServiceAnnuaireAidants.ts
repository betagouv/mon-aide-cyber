import { EntrepotAidant } from '../authentification/Aidant';
import { UUID } from 'crypto';

export type AnnuaireDTO = { identifiant: UUID; nomPrenom: string };

export class ServiceAnnuaireAidants {
  constructor(private readonly entrepotAidant: EntrepotAidant) {}

  recherche(): Promise<AnnuaireDTO[]> {
    return this.entrepotAidant.tous().then((aidants) =>
      aidants.map((aidant) => ({
        identifiant: aidant.identifiant,
        nomPrenom: aidant.nomPrenom,
      }))
    );
  }
}
