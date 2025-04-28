import { describe, expect, it, assert } from 'vitest';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import {
  Aidant,
  ErreurCreationEspaceAidant,
} from '../../src/espace-aidant/Aidant';
import {
  AidantCree,
  CapteurCommandeCreeEspaceAidant,
  EspaceAidantCree,
} from '../../src/espace-aidant/CapteurCommandeCreeEspaceAidant';
import crypto from 'crypto';
import {
  unAidant,
  unUtilisateurInscrit,
} from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { AdaptateurRepertoireDeContactsMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurRepertoireDeContactsMemoire';
import { unTupleUtilisateurInscritInitieDiagnostic } from '../../src/diagnostic/tuples';
import { EntrepotRelationMemoire } from '../../src/relation/infrastructure/EntrepotRelationMemoire';
import { AdaptateurRelationsMAC } from '../../src/relation/AdaptateurRelationsMAC';
import { EntrepotAidantMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';

class EntrepotAidantEnErreur extends EntrepotAidantMemoire {
  async persiste(_entite: Aidant): Promise<void> {
    return Promise.reject('Erreur lors de la persistance de l’Aidant');
  }
}

describe('Capteur de commande de création de compte Aidant', () => {
  it('Crée un compte Aidant', async () => {
    const entrepots = new EntrepotsMemoire();
    const dateSignatureCGU = new Date(Date.parse('2024-08-30T14:38:25'));

    const aidantCree = await new CapteurCommandeCreeEspaceAidant(
      entrepots,
      new BusEvenementDeTest(),
      new AdaptateurRepertoireDeContactsMemoire(),
      new AdaptateurRelationsMAC(new EntrepotRelationMemoire())
    ).execute({
      identifiant: crypto.randomUUID(),
      dateSignatureCGU,
      email: 'jean.dupont@beta.fr',
      nomPrenom: 'Jean Dupont',
      type: 'CommandeCreeEspaceAidant',
      departement: {
        nom: 'Alpes-de-Haute-Provence',
        code: '04',
        codeRegion: '93',
      },
    });

    const aidants = await entrepots.aidants().tous();
    expect(aidants).toHaveLength(1);
    expect(aidants[0]).toStrictEqual<Aidant>({
      identifiant: expect.any(String),
      email: 'jean.dupont@beta.fr',
      nomPrenom: 'Jean Dupont',
      dateSignatureCGU,
      preferences: {
        secteursActivite: [],
        departements: [
          {
            nom: 'Alpes-de-Haute-Provence',
            code: '04',
            codeRegion: '93',
          },
        ],
        typesEntites: [],
        nomAffichageAnnuaire: 'Jean D.',
      },
      consentementAnnuaire: false,
    });
    expect(aidantCree).toStrictEqual<EspaceAidantCree>({
      identifiant: expect.any(String),
      email: 'jean.dupont@beta.fr',
      nomPrenom: 'Jean Dupont',
    });
  });

  it('Ajoute un contact de profil AIDANT au répertoire de contacts (BREVO)', async () => {
    const entrepots = new EntrepotsMemoire();
    const dateSignatureCGU = new Date(Date.parse('2024-08-30T14:38:25'));

    const repertoireDeContacts = new AdaptateurRepertoireDeContactsMemoire();

    await new CapteurCommandeCreeEspaceAidant(
      entrepots,
      new BusEvenementDeTest(),
      repertoireDeContacts,
      new AdaptateurRelationsMAC(new EntrepotRelationMemoire())
    ).execute({
      identifiant: crypto.randomUUID(),
      dateSignatureCGU,
      email: 'jean.dupont@beta.fr',
      nomPrenom: 'Jean Dupont',
      type: 'CommandeCreeEspaceAidant',
      departement: {
        nom: 'Alpes-de-Haute-Provence',
        code: '04',
        codeRegion: '93',
      },
    });

    expect(repertoireDeContacts.aidants).toContainEqual('jean.dupont@beta.fr');
  });

  it('Ne crée pas l’Aidant si un compte existe déjà avec le même email', async () => {
    const entrepots = new EntrepotsMemoire();
    const dateSignatureCGU = new Date(Date.parse('2024-08-30T14:38:25'));
    const aidant = unAidant().construis();
    await entrepots.aidants().persiste(aidant);

    const compteAidantCree = new CapteurCommandeCreeEspaceAidant(
      entrepots,
      new BusEvenementDeTest(),
      new AdaptateurRepertoireDeContactsMemoire(),
      new AdaptateurRelationsMAC(new EntrepotRelationMemoire())
    ).execute({
      identifiant: crypto.randomUUID(),
      dateSignatureCGU,
      email: aidant.email,
      nomPrenom: 'Jean Dupont',
      type: 'CommandeCreeEspaceAidant',
      departement: {
        nom: 'Ariège',
        code: '09',
        codeRegion: '76',
      },
    });

    const aidants = await entrepots.aidants().tous();
    expect(aidants).toHaveLength(1);
    await expect(compteAidantCree).rejects.toStrictEqual(
      new ErreurCreationEspaceAidant(
        'Un compte Aidant avec cette adresse email existe déjà.'
      )
    );
  });

  it('Publie l’événement "AIDANT_CREE"', async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const entrepots = new EntrepotsMemoire();
    const dateSignatureCGU = new Date(Date.parse('2024-08-30T14:38:25'));
    const busEvenement = new BusEvenementDeTest();

    const aidantCree = await new CapteurCommandeCreeEspaceAidant(
      entrepots,
      busEvenement,
      new AdaptateurRepertoireDeContactsMemoire(),
      new AdaptateurRelationsMAC(new EntrepotRelationMemoire())
    ).execute({
      identifiant: crypto.randomUUID(),
      dateSignatureCGU,
      email: 'jean.dupont@beta.fr',
      nomPrenom: 'Jean Dupont',
      type: 'CommandeCreeEspaceAidant',
      departement: {
        nom: 'Guadeloupe',
        code: '971',
        codeRegion: '01',
      },
    });

    expect(busEvenement.evenementRecu).toStrictEqual<AidantCree>({
      identifiant: aidantCree.identifiant,
      type: 'AIDANT_CREE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiant: aidantCree.identifiant,
        departement: '971',
        typeAidant: 'Aidant',
      },
    });
  });

  it('Publie l’événement "AIDANT_CREE" pour un Gendarme', async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const entrepots = new EntrepotsMemoire();
    const dateSignatureCGU = new Date(Date.parse('2024-08-30T14:38:25'));
    const busEvenement = new BusEvenementDeTest();

    const aidantCree = await new CapteurCommandeCreeEspaceAidant(
      entrepots,
      busEvenement,
      new AdaptateurRepertoireDeContactsMemoire(),
      new AdaptateurRelationsMAC(new EntrepotRelationMemoire())
    ).execute({
      identifiant: crypto.randomUUID(),
      dateSignatureCGU,
      email: 'jean.dupont@beta.fr',
      nomPrenom: 'Jean Dupont',
      type: 'CommandeCreeEspaceAidant',
      departement: {
        nom: 'Guadeloupe',
        code: '971',
        codeRegion: '01',
      },
      siret: 'GENDARMERIE',
    });

    expect(busEvenement.evenementRecu).toStrictEqual<AidantCree>({
      identifiant: aidantCree.identifiant,
      type: 'AIDANT_CREE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiant: aidantCree.identifiant,
        departement: '971',
        typeAidant: 'Gendarme',
      },
    });
  });

  describe('Dans le cadre du passage d’un Utilisateur Inscrit à Aidant', () => {
    it('Promeut l’Utilisateur Inscrit en Aidant', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const entrepots = new EntrepotsMemoire();
      const utilisateurInscrit = unUtilisateurInscrit()
        .avecUnNomPrenom('Jean Dupont')
        .avecUnEmail('jean.dupont@email.com')
        .construis();
      await entrepots.utilisateursInscrits().persiste(utilisateurInscrit);

      await new CapteurCommandeCreeEspaceAidant(
        entrepots,
        new BusEvenementDeTest(),
        new AdaptateurRepertoireDeContactsMemoire(),
        new AdaptateurRelationsMAC(new EntrepotRelationMemoire())
      ).execute({
        identifiant: crypto.randomUUID(),
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        email: 'jean.dupont@email.com',
        nomPrenom: 'Jean Dupont',
        type: 'CommandeCreeEspaceAidant',
        departement: {
          nom: 'Alpes-de-Haute-Provence',
          code: '04',
          codeRegion: '93',
        },
      });

      const aidantRecu = await entrepots
        .aidants()
        .lis(utilisateurInscrit.identifiant);
      expect(aidantRecu).toStrictEqual<Aidant>({
        identifiant: expect.any(String),
        email: 'jean.dupont@email.com',
        nomPrenom: 'Jean Dupont',
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        preferences: {
          secteursActivite: [],
          departements: [
            {
              nom: 'Alpes-de-Haute-Provence',
              code: '04',
              codeRegion: '93',
            },
          ],
          typesEntites: [],
          nomAffichageAnnuaire: 'Jean D.',
        },
        consentementAnnuaire: false,
      });
    });

    it("Rattache les diagnostics de l'utilisateur inscrit", async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const entrepots = new EntrepotsMemoire();
      const adaptateurRelations = new AdaptateurRelationsMAC(
        new EntrepotRelationMemoire()
      );
      const utilisateurInscrit = unUtilisateurInscrit()
        .avecUnNomPrenom('Jean Dupont')
        .avecUnEmail('jean.dupont@email.com')
        .construis();
      await entrepots.utilisateursInscrits().persiste(utilisateurInscrit);
      const identifiantDiagnostic = crypto.randomUUID();
      const relation = unTupleUtilisateurInscritInitieDiagnostic(
        utilisateurInscrit.identifiant,
        identifiantDiagnostic
      );
      await adaptateurRelations.creeTuple(relation);

      await new CapteurCommandeCreeEspaceAidant(
        entrepots,
        new BusEvenementDeTest(),
        new AdaptateurRepertoireDeContactsMemoire(),
        adaptateurRelations
      ).execute({
        identifiant: crypto.randomUUID(),
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        email: 'jean.dupont@email.com',
        nomPrenom: 'Jean Dupont',
        type: 'CommandeCreeEspaceAidant',
        departement: {
          nom: 'Alpes-de-Haute-Provence',
          code: '04',
          codeRegion: '93',
        },
      });

      expect(
        await adaptateurRelations.relationExiste(
          'initiateur',
          {
            type: 'aidant',
            identifiant: utilisateurInscrit.identifiant,
          },
          { type: 'diagnostic', identifiant: identifiantDiagnostic }
        )
      ).toBe(true);
    });

    it("Rattache les diagnostics de l'utilisateur inscrit sans doublon", async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const entrepots = new EntrepotsMemoire();
      const adaptateurRelations = new AdaptateurRelationsMAC(
        new EntrepotRelationMemoire()
      );
      const utilisateurInscrit = unUtilisateurInscrit()
        .avecUnNomPrenom('Jean Dupont')
        .avecUnEmail('jean.dupont@email.com')
        .construis();
      await entrepots.utilisateursInscrits().persiste(utilisateurInscrit);
      const identifiantDiagnostic = crypto.randomUUID();
      const relation = unTupleUtilisateurInscritInitieDiagnostic(
        utilisateurInscrit.identifiant,
        identifiantDiagnostic
      );
      await adaptateurRelations.creeTuple(relation);

      await new CapteurCommandeCreeEspaceAidant(
        entrepots,
        new BusEvenementDeTest(),
        new AdaptateurRepertoireDeContactsMemoire(),
        adaptateurRelations
      ).execute({
        identifiant: crypto.randomUUID(),
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        email: 'jean.dupont@email.com',
        nomPrenom: 'Jean Dupont',
        type: 'CommandeCreeEspaceAidant',
        departement: {
          nom: 'Alpes-de-Haute-Provence',
          code: '04',
          codeRegion: '93',
        },
      });

      expect(
        await adaptateurRelations.diagnosticsFaitsParUtilisateurMAC(
          utilisateurInscrit.identifiant
        )
      ).toStrictEqual([identifiantDiagnostic]);
    });

    it("Ne rattache pas les diagnostics de l'utilisateur inscrit si l’Aidant n’a pu être promu", async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const entrepots = new EntrepotsMemoire();
      entrepots.aidants = () => new EntrepotAidantEnErreur();
      const adaptateurRelations = new AdaptateurRelationsMAC(
        new EntrepotRelationMemoire()
      );
      const utilisateurInscrit = unUtilisateurInscrit()
        .avecUnNomPrenom('Jean Dupont')
        .avecUnEmail('jean.dupont@email.com')
        .construis();
      await entrepots.utilisateursInscrits().persiste(utilisateurInscrit);
      const identifiantDiagnostic = crypto.randomUUID();
      const relation = unTupleUtilisateurInscritInitieDiagnostic(
        utilisateurInscrit.identifiant,
        identifiantDiagnostic
      );
      await adaptateurRelations.creeTuple(relation);
      try {
        await new CapteurCommandeCreeEspaceAidant(
          entrepots,
          new BusEvenementDeTest(),
          new AdaptateurRepertoireDeContactsMemoire(),
          adaptateurRelations
        ).execute({
          identifiant: crypto.randomUUID(),
          dateSignatureCGU: FournisseurHorloge.maintenant(),
          email: 'jean.dupont@email.com',
          nomPrenom: 'Jean Dupont',
          type: 'CommandeCreeEspaceAidant',
          departement: {
            nom: 'Alpes-de-Haute-Provence',
            code: '04',
            codeRegion: '93',
          },
        });
        assert.fail(
          'Ce test est sensé échouer car on simule une erreur lors de la persistance de l’Aidant'
        );
      } catch (_) {
        expect(
          await adaptateurRelations.relationExiste(
            'initiateur',
            {
              type: 'aidant',
              identifiant: utilisateurInscrit.identifiant,
            },
            { type: 'diagnostic', identifiant: identifiantDiagnostic }
          )
        ).toBe(false);
      }
    });
  });
});
