import { describe, it } from 'vitest';
import { AdaptateurRelationsMAC } from '../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../src/relation/infrastructure/EntrepotRelationMemoire';
import crypto from 'crypto';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { EntrepotEvenementJournalMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { AdaptateurEnvoiMailMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { adaptateurCorpsMessage } from '../../src/auto-diagnostic/consommateursEvenements';

describe("Les consommateurs d'évènements de l’auto diagnostic", () => {
  describe("Lorsque l’événement 'AUTO_DIAGNOSTIC_LANCE' est consommé", () => {
    it('Crée la relation entre la demande et l’auto diagnostic', async () => {
      const adaptateurRelations = new AdaptateurRelationsMAC(
        new EntrepotRelationMemoire()
      );
      const identifiantDemande = crypto.randomUUID();
      const identifiantDiagnostic = crypto.randomUUID();
      const busEvenement = new BusEvenementDeTest(
        {
          adaptateurRelations,
          entrepotJournalisation: new EntrepotEvenementJournalMemoire(),
        },
        ['AUTO_DIAGNOSTIC_LANCE']
      );

      await busEvenement.publie({
        identifiant: crypto.randomUUID(),
        type: 'AUTO_DIAGNOSTIC_LANCE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          idDiagnostic: identifiantDiagnostic,
          idDemande: identifiantDemande,
        },
      });

      expect(
        await adaptateurRelations.identifiantsObjetsLiesAUtilisateur(
          identifiantDemande
        )
      ).toStrictEqual([identifiantDiagnostic]);
    });

    it('Envoie le mail à l’entité faisant un auto diagnostic', async () => {
      adaptateurCorpsMessage.autoDiagnostic = () => ({
        genereCorpsMessage: () => 'Bonjour Auto diagnostic',
      });
      const adaptateurRelations = new AdaptateurRelationsMAC(
        new EntrepotRelationMemoire()
      );
      const identifiantDemande = crypto.randomUUID();
      const identifiantDiagnostic = crypto.randomUUID();
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const busEvenement = new BusEvenementDeTest(
        {
          adaptateurRelations,
          entrepotJournalisation: new EntrepotEvenementJournalMemoire(),
          adaptateurEnvoiMail,
        },
        ['AUTO_DIAGNOSTIC_LANCE']
      );

      await busEvenement.publie({
        identifiant: crypto.randomUUID(),
        type: 'AUTO_DIAGNOSTIC_LANCE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          idDiagnostic: identifiantDiagnostic,
          idDemande: identifiantDemande,
          email: 'entite-auto-diagnostic@email.com',
        },
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA(
          'entite-auto-diagnostic@email.com',
          'Bonjour Auto diagnostic'
        )
      ).toBe(true);
    });
  });
});
