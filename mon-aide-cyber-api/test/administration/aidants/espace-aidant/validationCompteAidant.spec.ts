import { beforeEach, describe, expect, it } from 'vitest';
import {
  unConstructeurAidantCSV,
  unConstructeurFichierAidantCSV,
} from './ConstructeurNouvelImportAidantCSV';
import {
  ResultatValidationCompteAidant,
  validationCompteAidant,
} from '../../../../src/administration/aidants/espace-aidant/validationCompteAidant';
import { uneDemandeDevenirAidant } from '../../../constructeurs/constructeurDemandesDevenirAidant';
import { EntrepotsMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../../../infrastructure/bus/BusEvenementDeTest';

describe('Validation des comptes Aidants', () => {
  let entrepots = new EntrepotsMemoire();
  let busEvenement = new BusEvenementDeTest();

  beforeEach(() => {
    entrepots = new EntrepotsMemoire();
    busEvenement = new BusEvenementDeTest();
  });

  it('Envoie le mail de création de l’espace Aidant', async () => {
    const demande = uneDemandeDevenirAidant()
      .avecEntiteMorale('ServicePublic')
      .pour('Jean', 'Dupont')
      .ayantPourMail('jean.dupont@email.com')
      .construis();
    await entrepots.demandesDevenirAidant().persiste(demande);
    const csv = unConstructeurFichierAidantCSV()
      .avecLesAidants([
        unConstructeurAidantCSV()
          .avecLeNom('Jean Dupont')
          .avecUnEmail('jean.dupont@email.com')
          .construis(),
      ])
      .construis();

    const resultat = await validationCompteAidant(entrepots, busEvenement, csv);

    expect(resultat).toStrictEqual<ResultatValidationCompteAidant>({
      envoiMailCreationEspaceAidant: [
        { nom: 'Jean Dupont', email: 'jean.dupont@email.com' },
      ],
    });
  });
});
