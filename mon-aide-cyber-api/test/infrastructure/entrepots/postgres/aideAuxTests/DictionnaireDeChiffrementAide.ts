import {
  Dictionnaire,
  DictionnaireDeChiffrement,
} from '../../../../constructeurs/DictionnaireDeChiffrement';
import { DemandeAide } from '../../../../../src/gestion-demandes/aide/DemandeAide';
import { fakerFR } from '@faker-js/faker';

export class DictionnaireDeChiffrementAide
  implements DictionnaireDeChiffrement<DemandeAide>
{
  private _dictionnaire: Dictionnaire = new Map();
  private _avecSIRET = true;
  private aide: DemandeAide | undefined = undefined;

  avec(aide: DemandeAide): DictionnaireDeChiffrementAide {
    this.aide = aide;
    return this;
  }

  sansSIRET(): DictionnaireDeChiffrementAide {
    this._avecSIRET = false;
    return this;
  }

  construis(): Dictionnaire {
    const valeurEnClair = JSON.stringify({
      identifiantMAC: this.aide!.identifiant,
      departement: this.aide!.departement.nom,
      raisonSociale: this.aide!.raisonSociale,
      ...(this._avecSIRET && { siret: this.aide!.siret }),
    });
    this._dictionnaire.set(valeurEnClair, fakerFR.string.alpha(10));
    return this._dictionnaire;
  }
}
