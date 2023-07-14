import { Constructeur } from "./Constructeur";
import {
  Format,
  ReponseComplementaire,
  TypeDeSaisie,
} from "../../src/domaine/diagnostic/Referentiel";
import { faker } from "@faker-js/faker/locale/fr";
import { aseptise } from "../utilitaires/aseptise.ts";

class ConstructeurReponseComplementaire
  implements Constructeur<ReponseComplementaire>
{
  private identifiant: string = faker.string.alpha(10);
  private libelle: string = faker.word.words();
  private ordre: number = faker.number.int();
  private type?: { format?: Format; type: TypeDeSaisie } = undefined;

  avecLibelle(libelle: string): ConstructeurReponseComplementaire {
    this.libelle = libelle;
    this.identifiant = aseptise(libelle);
    return this;
  }

  auFormatTexteEnSaisieLibre(): ConstructeurReponseComplementaire {
    this.type = { type: "saisieLibre", format: "texte" };
    return this;
  }

  construis(): ReponseComplementaire {
    return {
      identifiant: this.identifiant,
      libelle: this.libelle,
      ordre: this.ordre,
      type: this.type,
    };
  }
}

export const uneReponseComplementaire = () =>
  new ConstructeurReponseComplementaire();
