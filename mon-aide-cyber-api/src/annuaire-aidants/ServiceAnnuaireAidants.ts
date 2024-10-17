import { Aidant, EntrepotAnnuaireAidants } from './annuaireAidants';

export type CriteresDeRecherche = {
  departement: string;
};

export class ServiceAnnuaireAidants {
  constructor(private readonly entrepotAidant: EntrepotAnnuaireAidants) {}

  formateLeNom(nomPrenom: string): string {
    const [prenom, nom] = nomPrenom.split(' ');
    return `${prenom} ${nom[0]}.`;
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
