import { AdaptateurReferentiel } from "../../src/adaptateurs/AdaptateurReferentiel";

export class AdaptateurReferentielDeTest implements AdaptateurReferentiel {
  private contenu = {};

  lis(): Promise<object> {
    return Promise.resolve(this.contenu);
  }

  ajoute(contenu: object) {
    this.contenu = { ...this.contenu, ...contenu };
  }
}
