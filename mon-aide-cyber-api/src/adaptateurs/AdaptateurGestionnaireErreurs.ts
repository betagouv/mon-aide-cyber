import { ConsignateurErreurs } from "./ConsignateurErreurs";

export interface AdaptateurGestionnaireErreurs {
  consignateur(): ConsignateurErreurs;
}
