import { Referentiel } from "../diagnostic/Referentiel";

export interface AdaptateurReferentiel {
  lis(): Promise<Referentiel>;
}
