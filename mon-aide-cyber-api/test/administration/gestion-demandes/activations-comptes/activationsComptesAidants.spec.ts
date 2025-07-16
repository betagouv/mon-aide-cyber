import { beforeEach, describe, expect, it } from 'vitest';
import {
  unConstructeurAidantCSV,
  unConstructeurFichierAidantCSV,
} from './ConstructeurNouvelImportAidantCSV';
import { uneDemandeDevenirAidant } from '../../../constructeurs/constructeurDemandesDevenirAidant';
import { EntrepotsMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { DemandeDevenirAidant } from '../../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { BusCommandeTest } from '../../../infrastructure/bus/BusCommandeTest';
import {
  activationsComptesAidants,
  ResultatActivationsComptesAidants,
} from '../../../../src/administration/gestion-demandes/activations-comptes/activationsComptesAidants';
import { EntrepotDemandeDevenirAidantMemoireGenerantErreur } from '../../../infrastructure/entrepots/memoire/EntrepotDemandeDevenirAidantMemoireGenerantErreur';

describe('Validation des comptes Aidants', () => {
  let entrepots = new EntrepotsMemoire();

  beforeEach(() => {
    entrepots = new EntrepotsMemoire();
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

    const resultat = await activationsComptesAidants(
      entrepots,
      new BusCommandeTest(),
      csv
    );

    expect(resultat).toStrictEqual<ResultatActivationsComptesAidants>({
      activationsComptesAidants: [
        { nom: 'Jean Dupont', email: 'jean.dupont@email.com' },
      ],
      demandesIncomplete: [],
      demandesEnErreur: [],
    });
  });

  it('N’envoie pas le mail de création de l’espace Aidant si la demande est incomplète', async () => {
    const { entite, ...demandeAvantArbitrage } = uneDemandeDevenirAidant()
      .pour('Jean', 'Dupont')
      .ayantPourMail('jean.dupont@email.com')
      .construis();
    await entrepots
      .demandesDevenirAidant()
      .persiste(demandeAvantArbitrage as DemandeDevenirAidant);
    const csv = unConstructeurFichierAidantCSV()
      .avecLesAidants([
        unConstructeurAidantCSV()
          .avecLeNom('Jean Dupont')
          .avecUnEmail('jean.dupont@email.com')
          .construis(),
      ])
      .construis();

    const resultat = await activationsComptesAidants(
      entrepots,
      new BusCommandeTest(),
      csv
    );

    expect(resultat).toStrictEqual<ResultatActivationsComptesAidants>({
      activationsComptesAidants: [],
      demandesIncomplete: [
        {
          nom: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          identificationDemande: demandeAvantArbitrage.identifiant,
        },
      ],
      demandesEnErreur: [],
    });
  });

  it('Répertorie les erreurs', async () => {
    const entrepotDemandeDevenirAidant =
      new EntrepotDemandeDevenirAidantMemoireGenerantErreur().surRechercheParMail(
        'jean.dupont@email.com'
      );
    entrepots.demandesDevenirAidant = () => entrepotDemandeDevenirAidant;
    const jeanDupont = uneDemandeDevenirAidant()
      .avecEntiteMorale('ServicePublic')
      .pour('Jean', 'Dupont')
      .ayantPourMail('jean.dupont@email.com')
      .construis();
    const jeanDujardin = uneDemandeDevenirAidant()
      .avecEntiteMorale('Association')
      .pour('Jean', 'Dujardin')
      .ayantPourMail('jean.dujardin@email.com')
      .construis();
    await entrepots.demandesDevenirAidant().persiste(jeanDupont);
    await entrepots.demandesDevenirAidant().persiste(jeanDujardin);
    const csv = unConstructeurFichierAidantCSV()
      .avecLesAidants([
        unConstructeurAidantCSV()
          .avecLeNom('Jean Dupont')
          .avecUnEmail('jean.dupont@email.com')
          .construis(),
        unConstructeurAidantCSV()
          .avecLeNom('Jean Dujardin')
          .avecUnEmail('jean.dujardin@email.com')
          .construis(),
      ])
      .construis();

    const resultat = await activationsComptesAidants(
      entrepots,
      new BusCommandeTest(),
      csv
    );

    expect(resultat).toStrictEqual<ResultatActivationsComptesAidants>({
      activationsComptesAidants: [
        { nom: 'Jean Dujardin', email: 'jean.dujardin@email.com' },
      ],
      demandesIncomplete: [],
      demandesEnErreur: [
        {
          nom: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          erreur: 'Erreur de recherche',
        },
      ],
    });
  });
});
