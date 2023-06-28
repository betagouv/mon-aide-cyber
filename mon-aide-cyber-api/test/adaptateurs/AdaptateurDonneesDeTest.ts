import { AdaptateurDonnees } from "../../src/adaptateurs/AdaptateurDonnees";

export class AdaptateurDonneesDeTest implements AdaptateurDonnees {
  private contenu = {};

  lis(): Promise<object> {
    return Promise.resolve(this.contenu);
  }

  ajoute(contenu: object) {
    this.contenu = { ...this.contenu, ...contenu };
  }
}
