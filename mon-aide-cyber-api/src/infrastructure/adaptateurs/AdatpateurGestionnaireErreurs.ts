import { AdaptateurGestionnaireErreurs } from "../../adaptateurs/AdaptateurGestionnaireErreurs";
import { ConsignateurErreursMemoire } from "./ConsignateurErreursMemoire";
import { ConsignateurErreurs } from "../../adaptateurs/ConsignateurErreurs";

export class AdaptateurGestionnaireErreursMemoire
  implements AdaptateurGestionnaireErreurs
{
  private readonly _consignateur = new ConsignateurErreursMemoire();

  consignateur(): ConsignateurErreurs {
    return this._consignateur;
  }
}
