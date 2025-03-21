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
import { EntrepotDemandeDevenirAidantMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { DemandeDevenirAidant } from '../../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';

class EntrepotDemandeDevenirAidantMemoireGenerantErreur extends EntrepotDemandeDevenirAidantMemoire {
  private critereLeveErreur = '';

  rechercheDemandeEnCoursParMail(
    mail: string
  ): Promise<DemandeDevenirAidant | undefined> {
    if (this.critereLeveErreur === mail) {
      throw new Error('Erreur de recherche');
    }
    return super.rechercheDemandeEnCoursParMail(mail);
  }

  surRechercheParMail(
    critereLeveErreur: string
  ): EntrepotDemandeDevenirAidantMemoireGenerantErreur {
    this.critereLeveErreur = critereLeveErreur;
    return this;
  }
}

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
      envoisMailCreationEspaceAidant: [
        { nom: 'Jean Dupont', email: 'jean.dupont@email.com' },
      ],
      demandesIncomplete: [],
      demandesEnErreur: [],
    });
  });

  it('N’envoie pas le mail de création de l’espace Aidant si la demande est incomplète', async () => {
    const demande = uneDemandeDevenirAidant()
      .avantArbitrage()
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
      envoisMailCreationEspaceAidant: [],
      demandesIncomplete: [
        {
          nom: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          identificationDemande: demande.identifiant,
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

    const resultat = await validationCompteAidant(entrepots, busEvenement, csv);

    expect(resultat).toStrictEqual<ResultatValidationCompteAidant>({
      envoisMailCreationEspaceAidant: [
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
