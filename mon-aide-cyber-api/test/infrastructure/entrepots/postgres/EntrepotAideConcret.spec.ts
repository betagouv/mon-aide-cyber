import { EntrepotAideConcret } from '../../../../src/infrastructure/entrepots/postgres/EntrepotAideConcret';
import { FauxServiceDeChiffrement } from '../../securite/FauxServiceDeChiffrement';
import { beforeEach, describe, expect, it } from 'vitest';
import { nettoieLaBaseDeDonneesAides } from '../../../utilitaires/nettoyeurBDD';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import {
  RechercheDemandeAide,
  RechercheDemandeAideComplete,
} from '../../../../src/gestion-demandes/aide/DemandeAide';
import { uneDemandeAide } from '../../../gestion-demandes/aide/ConstructeurDemandeAide';
import { AdaptateurRepertoireDeContactsMemoire } from '../../../../src/infrastructure/adaptateurs/AdaptateurRepertoireDeContactsMemoire';
import { DictionnaireDeChiffrementAide } from './aideAuxTests/DictionnaireDeChiffrementAide';
import { EntrepotAideBrevoMemoire } from './aideAuxTests/EntrepotAideBrevoMemoire';

describe('Entrepot Aidé Concret', () => {
  beforeEach(async () => {
    await nettoieLaBaseDeDonneesAides();
  });

  describe('Lorsque l’on persiste', () => {
    it('MAC génère un identifiant et conserve la date de signature', async () => {
      const aide = uneDemandeAide().construis();
      const fauxServiceDeChiffrement = new FauxServiceDeChiffrement(
        new DictionnaireDeChiffrementAide().avec(aide).construis()
      );
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();

      await new EntrepotAideConcret(
        fauxServiceDeChiffrement,
        new AdaptateurRepertoireDeContactsMemoire(),
        entrepotAideBrevoMemoire
      ).persiste(aide);

      const aideRecu = await new EntrepotAideConcret(
        fauxServiceDeChiffrement,
        new AdaptateurRepertoireDeContactsMemoire(),

        entrepotAideBrevoMemoire
      ).rechercheParEmail(aide.email);
      expect(aideRecu).toStrictEqual<RechercheDemandeAide>({
        etat: 'COMPLET',
        demandeAide: {
          identifiant: aide.identifiant,
          dateSignatureCGU: aide.dateSignatureCGU,
          email: aide.email,
          departement: aide.departement,
          raisonSociale: aide.raisonSociale!,
          siret: aide.siret,
        },
      });
    });

    it('MAC contacte Brevo pour créer le contact correspondant en chiffrant les parties sensibles', async () => {
      const aide = uneDemandeAide().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new DictionnaireDeChiffrementAide().avec(aide).construis()
      );
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();

      await new EntrepotAideConcret(
        serviceDeChiffrement,
        new AdaptateurRepertoireDeContactsMemoire(),

        entrepotAideBrevoMemoire
      ).persiste(aide);

      const aideRecu = await new EntrepotAideConcret(
        serviceDeChiffrement,
        new AdaptateurRepertoireDeContactsMemoire(),

        entrepotAideBrevoMemoire
      ).rechercheParEmail(aide.email);
      expect(aideRecu).toStrictEqual<RechercheDemandeAide>({
        demandeAide: aide,
        etat: 'COMPLET',
      });
    });

    it('MAC rajoute un contact « AIDÉ » dans le répertoire (BREVO)', async () => {
      const repertoire = new AdaptateurRepertoireDeContactsMemoire();
      const aide = uneDemandeAide().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new DictionnaireDeChiffrementAide().avec(aide).construis()
      );
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();

      await new EntrepotAideConcret(
        serviceDeChiffrement,
        repertoire,
        entrepotAideBrevoMemoire
      ).persiste(aide);

      expect(repertoire.aides).toContainEqual(aide.email);
    });
  });

  describe('Lorsque l’on recherche par email', () => {
    it('Récupère l’Aidé ciblé', async () => {
      const premierAide = uneDemandeAide()
        .avecUneDateDeSignatureDesCGU(
          FournisseurHorloge.enDate('2024-02-01T13:26:34+01:00')
        )
        .construis();
      const secondAide = uneDemandeAide()
        .avecUneDateDeSignatureDesCGU(
          FournisseurHorloge.enDate('2024-03-09T04:04:34+01:00')
        )
        .construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new DictionnaireDeChiffrementAide()
          .avec(premierAide)
          .avec(secondAide)
          .construis()
      );
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();
      await new EntrepotAideConcret(
        serviceDeChiffrement,
        new AdaptateurRepertoireDeContactsMemoire(),

        entrepotAideBrevoMemoire
      ).persiste(premierAide);
      await new EntrepotAideConcret(
        serviceDeChiffrement,
        new AdaptateurRepertoireDeContactsMemoire(),

        entrepotAideBrevoMemoire
      ).persiste(secondAide);

      const aideRecherche = await new EntrepotAideConcret(
        serviceDeChiffrement,
        new AdaptateurRepertoireDeContactsMemoire(),

        entrepotAideBrevoMemoire
      ).rechercheParEmail(secondAide.email);

      expect(aideRecherche).toStrictEqual<RechercheDemandeAide>({
        demandeAide: secondAide,
        etat: 'COMPLET',
      });
    });

    it('L’Aidé n’est pas trouvé chez Brevo', async () => {
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();
      const aideRecherche = await new EntrepotAideConcret(
        new FauxServiceDeChiffrement(new Map()),
        new AdaptateurRepertoireDeContactsMemoire(),

        entrepotAideBrevoMemoire
      ).rechercheParEmail('email@inconnu.com');

      expect(aideRecherche).toStrictEqual<RechercheDemandeAide>({
        etat: 'INEXISTANT',
      });
    });

    it('L‘Aidé recherché est incomplet si le contact Brevo existe mais que l’on arrive pas à récupérer ses métadonnées', async () => {
      const aide = uneDemandeAide()
        .avecUneDateDeSignatureDesCGU(
          FournisseurHorloge.enDate('2024-02-01T13:26:34+01:00')
        )
        .construis();
      const entrepotAideBrevoMemoire =
        new EntrepotAideBrevoMemoire().sansMetadonnees();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new DictionnaireDeChiffrementAide().avec(aide).construis()
      );
      const entrepotAideConcret = new EntrepotAideConcret(
        serviceDeChiffrement,
        new AdaptateurRepertoireDeContactsMemoire(),

        entrepotAideBrevoMemoire
      );
      await entrepotAideConcret.persiste(aide);

      const rechercheMail = await entrepotAideConcret.rechercheParEmail(
        aide.email
      );

      expect(rechercheMail).toStrictEqual<RechercheDemandeAide>({
        etat: 'INCOMPLET',
      });
    });

    it('L‘Aidé recherché est inexistant si le contact Brevo retourné ne correspond pas à un Aidé', async () => {
      const aide = uneDemandeAide()
        .avecUneDateDeSignatureDesCGU(
          FournisseurHorloge.enDate('2024-02-01T13:26:34+01:00')
        )
        .construis();
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();
      const tableDeChiffrement = new DictionnaireDeChiffrementAide()
        .avec(aide)
        .construis();
      entrepotAideBrevoMemoire.persiste(
        {
          email: aide.email,
          departement: aide.departement,
          identifiantMAC: aide.identifiant,
          ...(aide.raisonSociale && { raisonSociale: aide.raisonSociale }),
          siret: aide.siret,
        },
        (identifiantMAC, departement, siret, raisonSociale) =>
          tableDeChiffrement.get(
            JSON.stringify({
              identifiantMAC,
              departement,
              raisonSociale,
              siret,
            })
          )!
      );
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        tableDeChiffrement
      );

      const aideRecherche = await new EntrepotAideConcret(
        serviceDeChiffrement,
        new AdaptateurRepertoireDeContactsMemoire(),
        entrepotAideBrevoMemoire
      ).rechercheParEmail(aide.email);

      expect(aideRecherche).toStrictEqual<RechercheDemandeAide>({
        etat: 'INEXISTANT',
      });
    });

    it('Indique un Siret "NON_DISPONIBLE" dans le cas où un contact Brevo ne dispose pas de l’information', async () => {
      const demandeAide = uneDemandeAide()
        .avecUneDateDeSignatureDesCGU(
          FournisseurHorloge.enDate('2024-02-01T13:26:34+01:00')
        )
        .construis();
      const tableDeChiffrement = new DictionnaireDeChiffrementAide()
        .avec(demandeAide)
        .sansSIRET()
        .construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        tableDeChiffrement
      );
      serviceDeChiffrement.chiffre = (chaine): string => {
        const { siret, ...reste } = JSON.parse(chaine);
        return tableDeChiffrement.get(JSON.stringify(reste))!;
      };
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();
      await new EntrepotAideConcret(
        serviceDeChiffrement,
        new AdaptateurRepertoireDeContactsMemoire(),
        entrepotAideBrevoMemoire
      ).persiste(demandeAide);

      const aideRecherche = await new EntrepotAideConcret(
        serviceDeChiffrement,
        new AdaptateurRepertoireDeContactsMemoire(),
        entrepotAideBrevoMemoire
      ).rechercheParEmail(demandeAide.email);

      const demandeTrouvee = (aideRecherche as RechercheDemandeAideComplete)
        .demandeAide;
      expect(demandeTrouvee.siret).toBe('NON_DISPONIBLE');
    });
  });
});
