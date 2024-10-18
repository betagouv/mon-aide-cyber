import { Aidant, EntrepotAnnuaireAidants } from './annuaireAidants';

export type CriteresDeRecherche = {
  departement: string;
};

export class ServiceAnnuaireAidants {
  constructor(private readonly entrepotAidant: EntrepotAnnuaireAidants) {}

  private formateLeNom(nomPrenom: string): string {
    const [prenom, nom] = nomPrenom.split(' ');
    return `${prenom} ${nom ? `${nom[0]}.` : ''}`.trim();
  }

  recherche(
    criteresDeRecherche: CriteresDeRecherche | undefined
  ): Promise<Aidant[]> {
    return this.entrepotAidant
      .rechercheParCriteres(criteresDeRecherche)
      .then((aidants) => {
        return aidants.map((aidant) => ({
          ...aidant,
          nomPrenom: this.formateLeNom(aidant.nomPrenom),
        }));
      });
  }
}
