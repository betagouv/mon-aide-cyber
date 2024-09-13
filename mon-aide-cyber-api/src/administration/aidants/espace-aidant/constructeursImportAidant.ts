import { Aidant } from '../../../authentification/Aidant';
import {
  AidantCSV,
  TraitementCreationEspaceAidant,
} from './initialiseCreationEspacesAidants';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';

type ImportAidantDTO = TraitementCreationEspaceAidant;

abstract class ConstructeurImportAidant {
  constructor(private readonly importAidantDTO: ImportAidantDTO) {}

  construis(): TraitementCreationEspaceAidant {
    return {
      charte: this.importAidantDTO.charte,
      formation: this.importAidantDTO.formation,
      commentaires: this.importAidantDTO.commentaires,
      compteCree: this.importAidantDTO.compteCree,
      email: this.importAidantDTO.email,
      messageAvecMDP: this.importAidantDTO.messageAvecMDP,
      nomPrenom: this.importAidantDTO.nomPrenom,
      qui: this.importAidantDTO.qui,
      region: this.importAidantDTO.region,
      status: this.importAidantDTO.status,
      telephone: this.importAidantDTO.telephone,
      todo: this.importAidantDTO.todo,
    };
  }
}

class ConstructeurImportAidantAidantExistant extends ConstructeurImportAidant {
  constructor(aidantCSV: AidantCSV) {
    const newVar: ImportAidantDTO = {
      ...aidantCSV,
      telephone: aidantCSV.numeroTelephone,
      email: aidantCSV.identifiantConnexion,
      nomPrenom: aidantCSV.nomPrenom,
      status: 'existant',
      commentaires: `Aidant déjà existant - ${aidantCSV.commentaires}`,
    };
    super(newVar);
  }
}

class ConstructeurImportAidantAidantImporte extends ConstructeurImportAidant {
  constructor(aidant: Aidant, aidantCSV: AidantCSV) {
    super({
      ...aidantCSV,
      telephone: aidantCSV.numeroTelephone,
      email: aidantCSV.identifiantConnexion,
      nomPrenom: aidantCSV.nomPrenom,
      status: 'importé',
      commentaires: `importé le ${FournisseurHorloge.maintenant().toISOString()}`,
      compteCree: 'oui',
      messageAvecMDP: `"Bonjour,\nVotre mot de passe MonAideCyber : ${aidant.motDePasse}\nVotre login est votre mail et l'URL de connexion est ${process.env.VITE_URL_MAC}\nPour toute information monaidecyber@ssi.gouv.fr\nBonne journée"`,
      todo: 'message à envoyer',
    });
  }
}

class ConstructeurImportAidantMailCreationEspaceAidantEnvoye extends ConstructeurImportAidant {
  constructor(aidantCSV: AidantCSV) {
    super({
      ...aidantCSV,
      telephone: aidantCSV.numeroTelephone,
      email: aidantCSV.identifiantConnexion,
      nomPrenom: aidantCSV.nomPrenom,
      status: 'email-envoyé',
      qui: 'MAC',
      commentaires: `mail de création de l’espace aidant envoyé le ${FournisseurHorloge.maintenant().toISOString()}`,
      compteCree: 'non',
      messageAvecMDP: 'AUCUN MESSAGE',
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
      messageAvecMDP: 'AUCUN MESSAGE',
      todo: 'Vérifier que l’Aidant a bien signé la charte et participé à la formation',
    });
  }
}

export class ConstructeursImportAidant {
  static aidantExistant(aidantCSV: AidantCSV): ConstructeurImportAidant {
    return new ConstructeurImportAidantAidantExistant(aidantCSV);
  }

  static importe(
    aidantImporte: Aidant,
    aidantCSV: AidantCSV
  ): ConstructeurImportAidant {
    return new ConstructeurImportAidantAidantImporte(aidantImporte, aidantCSV);
  }

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
}
