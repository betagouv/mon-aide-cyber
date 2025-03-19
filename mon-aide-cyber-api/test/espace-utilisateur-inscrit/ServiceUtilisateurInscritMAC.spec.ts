import { beforeEach, describe, expect, it } from 'vitest';
import { unAidant } from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import {
  EntrepotAidantMemoire,
  EntrepotUtilisateurInscritMemoire,
} from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { unServiceAidant } from '../../src/espace-aidant/ServiceAidantMAC';
import { UtilisateurInscrit } from '../../src/espace-utilisateur-inscrit/UtilisateurInscrit';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import {
  AidantMigreEnUtilisateurInscrit,
  unServiceUtilisateurInscrit,
} from '../../src/espace-utilisateur-inscrit/ServiceUtilisateurInscritMAC';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { EntrepotRelationMemoire } from '../../src/relation/infrastructure/EntrepotRelationMemoire';
import { AdaptateurRelationsMAC } from '../../src/relation/AdaptateurRelationsMAC';
import { unTupleAidantInitieDiagnostic } from '../../src/diagnostic/tuples';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurRepertoireDeContactsMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurRepertoireDeContactsMemoire';

describe('ServiceUtilisateurInscrit', () => {
  const dateValidationCGU = new Date(Date.parse('2024-12-22T13:41:24'));

  beforeEach(() => {
    FournisseurHorlogeDeTest.initialise(new Date());
  });

  it('Transforme un Aidant en Utilisateur Inscrit', async () => {
    const aidant = unAidant().cguValideesLe(dateValidationCGU).construis();
    const entrepotAidant = new EntrepotAidantMemoire();
    const entrepotUtilisateurInscrit = new EntrepotUtilisateurInscritMemoire();
    await entrepotAidant.persiste(aidant);

    await unServiceUtilisateurInscrit(
      entrepotUtilisateurInscrit,
      unServiceAidant(entrepotAidant),
      new AdaptateurRepertoireDeContactsMemoire()
    ).valideProfil(
      aidant.identifiant,
      new AdaptateurRelationsMAC(),
      new BusEvenementDeTest()
    );

    const utilisateurInscrit = await entrepotUtilisateurInscrit.lis(
      aidant.identifiant
    );
    expect(utilisateurInscrit).toBeDefined();
    expect(utilisateurInscrit).toStrictEqual<UtilisateurInscrit>({
      email: aidant.email,
      identifiant: aidant.identifiant,
      nomPrenom: aidant.nomPrenom,
      dateSignatureCGU: FournisseurHorloge.maintenant(),
    });
  });

  it("Ajoute l'utilisateur inscrit dans le répertoire de contact (BREVO)", async () => {
    const repertoire = new AdaptateurRepertoireDeContactsMemoire();
    const aidant = unAidant()
      .cguValideesLe(dateValidationCGU)
      .avecUnEmail('jean.dupont@utilisateur-inscrit.com')
      .construis();
    const entrepotAidant = new EntrepotAidantMemoire();
    const entrepotUtilisateurInscrit = new EntrepotUtilisateurInscritMemoire();
    await entrepotAidant.persiste(aidant);

    await unServiceUtilisateurInscrit(
      entrepotUtilisateurInscrit,
      unServiceAidant(entrepotAidant),
      repertoire
    ).valideProfil(
      aidant.identifiant,
      new AdaptateurRelationsMAC(),
      new BusEvenementDeTest()
    );

    expect(repertoire.utilisateursInscrits).toContainEqual(
      'jean.dupont@utilisateur-inscrit.com'
    );
  });

  it('Crée les relations vers les diagnosctics existants', async () => {
    const aidant = unAidant().cguValideesLe(dateValidationCGU).construis();
    const entrepotAidant = new EntrepotAidantMemoire();
    const entrepotUtilisateurInscrit = new EntrepotUtilisateurInscritMemoire();
    await entrepotAidant.persiste(aidant);
    const entrepotRelation = new EntrepotRelationMemoire();
    const adaptateurRelations = new AdaptateurRelationsMAC(entrepotRelation);
    const identifiantDiagnostic = crypto.randomUUID();
    await adaptateurRelations.creeTuple(
      unTupleAidantInitieDiagnostic(aidant.identifiant, identifiantDiagnostic)
    );

    await unServiceUtilisateurInscrit(
      entrepotUtilisateurInscrit,
      unServiceAidant(entrepotAidant),
      new AdaptateurRepertoireDeContactsMemoire()
    ).valideProfil(
      aidant.identifiant,
      adaptateurRelations,
      new BusEvenementDeTest()
    );

    expect(
      await adaptateurRelations.relationExiste(
        'initiateur',
        { type: 'utilisateurInscrit', identifiant: aidant.identifiant },
        {
          type: 'diagnostic',
          identifiant: identifiantDiagnostic,
        }
      )
    ).toBe(true);
  });

  it("Publie l'événement AIDANT_MIGRE_EN_UTILISATEUR_INSCRIT", async () => {
    const aidant = unAidant().cguValideesLe(dateValidationCGU).construis();
    const entrepotAidant = new EntrepotAidantMemoire();
    const entrepotUtilisateurInscrit = new EntrepotUtilisateurInscritMemoire();
    await entrepotAidant.persiste(aidant);
    const busEvenement = new BusEvenementDeTest();

    await unServiceUtilisateurInscrit(
      entrepotUtilisateurInscrit,
      unServiceAidant(entrepotAidant),
      new AdaptateurRepertoireDeContactsMemoire()
    ).valideProfil(
      aidant.identifiant,
      new AdaptateurRelationsMAC(),
      busEvenement
    );

    expect(
      busEvenement.evenementRecu
    ).toStrictEqual<AidantMigreEnUtilisateurInscrit>({
      identifiant: expect.any(String),
      type: 'AIDANT_MIGRE_EN_UTILISATEUR_INSCRIT',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiantUtilisateur: aidant.identifiant,
      },
    });
    expect(
      busEvenement.consommateursTestes.get(
        'AIDANT_MIGRE_EN_UTILISATEUR_INSCRIT'
      )?.[0].evenementConsomme
    ).toStrictEqual<AidantMigreEnUtilisateurInscrit>({
      type: 'AIDANT_MIGRE_EN_UTILISATEUR_INSCRIT',
      date: FournisseurHorloge.maintenant(),
      corps: { identifiantUtilisateur: aidant.identifiant },
      identifiant: expect.any(String),
    });
  });
});
