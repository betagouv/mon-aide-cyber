import { Aidant, EntrepotAnnuaireAidants } from './annuaireAidants';

export type CriteresDeRecherche = {
  departement: string;
};

export class ServiceAnnuaireAidants {
  constructor(private readonly entrepotAidant: EntrepotAnnuaireAidants) {}

  recherche(
    criteresDeRecherche: CriteresDeRecherche | undefined
  ): Promise<Aidant[]> {
    return this.entrepotAidant.rechercheParCriteres(criteresDeRecherche);
  }
}
