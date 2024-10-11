import { Aidant, EntrepotAnnuaireAidants } from './annuaireAidants';

export class ServiceAnnuaireAidants {
  constructor(private readonly entrepotAidant: EntrepotAnnuaireAidants) {}

  recherche(): Promise<Aidant[]> {
    return this.entrepotAidant.tous();
  }
}
