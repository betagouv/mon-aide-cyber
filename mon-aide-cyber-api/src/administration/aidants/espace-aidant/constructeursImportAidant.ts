import {
  AidantCSV,
  TraitementCreationEspaceAidant,
} from './initialiseCreationEspacesAidants';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';
import { mappeurDROMCOM } from './mappeurRegions';

type ImportAidantDTO = TraitementCreationEspaceAidant;

abstract class ConstructeurImportAidant {
  constructor(private readonly importAidantDTO: ImportAidantDTO) {}

  construis(): TraitementCreationEspaceAidant {
    const lieuDeFormation =
      this.importAidantDTO.region === 'DROM COM'
        ? mappeurDROMCOM.get(this.importAidantDTO.lieuDeFormation)?.nom || ''
        : this.importAidantDTO.lieuDeFormation;
    return {
      charte: this.importAidantDTO.charte,
      formation: this.importAidantDTO.formation,
      commentaires: this.importAidantDTO.commentaires,
      compteCree: this.importAidantDTO.compteCree,
      email: this.importAidantDTO.email,
      nomPrenom: this.importAidantDTO.nomPrenom,
      qui: this.importAidantDTO.qui,
      region: this.importAidantDTO.region,
      status: this.importAidantDTO.status,
      telephone: this.importAidantDTO.telephone,
      todo: this.importAidantDTO.todo,
      lieuDeFormation: lieuDeFormation,
    };
  }
}

class ConstructeurImportAidantMailCreationEspaceAidantEnvoye extends ConstructeurImportAidant {
  constructor(aidantCSV: AidantCSV) {
    super({
      ...aidantCSV,
      telephone: aidantCSV.numeroTelephone,
      email: aidantCSV.identifiantConnexion,
      nomPrenom: aidantCSV.nomPrenom,
      status: 'email-creation-espace-aidant-envoyé',
      qui: 'MAC',
      commentaires: `mail de création de l’espace aidant envoyé le ${FournisseurHorloge.maintenant().toISOString()}`,
      compteCree: 'non',
      todo: 'RAF',
    });
  }
}

class ConstructeurImportAidantDemandeEnAttenteDeValidation extends ConstructeurImportAidant {
  constructor(aidantCSV: AidantCSV) {
    super({
      ...aidantCSV,
      telephone: aidantCSV.numeroTelephone,
      email: aidantCSV.identifiantConnexion,
      nomPrenom: aidantCSV.nomPrenom,
      status: 'demande-en-attente',
      qui: '',
      commentaires:
        'Demande devenir Aidant en attente de formation ou charte OK',
      compteCree: 'non',
      todo: 'Vérifier que l’Aidant a bien signé la charte et participé à la formation',
    });
  }
}

class ConstructeurImportAidantDemandeDevenirAidantCree extends ConstructeurImportAidant {
  constructor(aidantCSV: AidantCSV) {
    super({
      ...aidantCSV,
      telephone: aidantCSV.numeroTelephone,
      email: aidantCSV.identifiantConnexion,
      nomPrenom: aidantCSV.nomPrenom,
      status: 'demande-devenir-aidant-envoyee',
      qui: 'MAC',
      todo: 'Passer la formation et /ou la charte à OK pour finaliser la création de l’espace Aidant',
      commentaires:
        'En attente de la formation et / ou de la charte pour finaliser la création l’espace Aidant',
      compteCree: 'non',
    });
  }
}

class ConstructeurImportAidantParcoursDevenirAidantCompletTraite extends ConstructeurImportAidant {
  constructor(aidantCSV: AidantCSV) {
    super({
      ...aidantCSV,
      telephone: aidantCSV.numeroTelephone,
      email: aidantCSV.identifiantConnexion,
      nomPrenom: aidantCSV.nomPrenom,
      status: 'email-creation-espace-aidant-envoyé',
      qui: 'MAC',
      todo: 'RAS',
      commentaires:
        'La demande devenir Aidant ainsi que le mail de création de l’espace Aidant ont été pris en compte.',
      compteCree: 'non',
    });
  }
}

export class ConstructeursImportAidant {
  static mailCreationEspaceAidantEnvoye(
    aidantCSV: AidantCSV
  ): ConstructeurImportAidant {
    return new ConstructeurImportAidantMailCreationEspaceAidantEnvoye(
      aidantCSV
    );
  }

  static demandeEnAttenteDeValidation(
    aidantCSV: AidantCSV
  ): ConstructeurImportAidant {
    return new ConstructeurImportAidantDemandeEnAttenteDeValidation(aidantCSV);
  }

  static demandeDevenirAidantCree(
    aidantCSV: AidantCSV
  ): ConstructeurImportAidant {
    return new ConstructeurImportAidantDemandeDevenirAidantCree(aidantCSV);
  }

  static parcoursDevenirAidantComplet(
    aidantCSV: AidantCSV
  ): ConstructeurImportAidant {
    return new ConstructeurImportAidantParcoursDevenirAidantCompletTraite(
      aidantCSV
    );
  }
}
