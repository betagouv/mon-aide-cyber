import { Referentiel } from "../diagnostique/Referentiel";

export interface AdaptateurReferentiel {
  lis(): Promise<Referentiel>;
}
