import { Aidant, EntrepotAnnuaireAidants } from './annuaireAidants';

export type CriteresDeRecherche = {
  departement: string;
};

const tableauAleatoire = (aidants: Aidant[]) => {
  const tableauAMelanger = [...aidants];
  for (let i = tableauAMelanger.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const aidantCourant = tableauAMelanger[i];
    tableauAMelanger[i] = tableauAMelanger[j];
    tableauAMelanger[j] = aidantCourant;
  }
  return tableauAMelanger;
};

export class ServiceAnnuaireAidants {
  constructor(private readonly entrepotAidant: EntrepotAnnuaireAidants) {}

  private formateLeNom(nomPrenom: string): string {
    const [prenom, nom] = nomPrenom.split(' ');
    return `${prenom} ${nom ? `${nom[0]}.` : ''}`.trim();
  }

  recherche(
    criteresDeRecherche: CriteresDeRecherche | undefined,
    melange: (aidants: Aidant[]) => Aidant[] = tableauAleatoire
  ): Promise<Aidant[] | undefined> {
    if (!criteresDeRecherche?.departement) {
      return Promise.resolve(undefined);
    }

    return this.entrepotAidant
      .rechercheParCriteres(criteresDeRecherche)
      .then((aidants) => {
        return melange(
          aidants.map((aidant) => ({
            ...aidant,
            nomPrenom: this.formateLeNom(aidant.nomPrenom),
          }))
        );
      });
  }
}
