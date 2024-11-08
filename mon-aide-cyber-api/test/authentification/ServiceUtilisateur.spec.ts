import { describe, it } from 'vitest';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import {
  ErreurReinitialisationMotDePasse,
  ServiceUtilisateur,
} from '../../src/authentification/ServiceUtilisateur';
import { EntrepotUtilisateurMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import crypto from 'crypto';
import { add } from 'date-fns';
import { ErreurMAC } from '../../src/domaine/erreurMAC';

describe('Service utilisateur', () => {
  describe('Modification du mot de passe', () => {
    it('N’est valide que pendant 20 minutes', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const dateGenerationToken = FournisseurHorloge.maintenant();
      FournisseurHorlogeDeTest.initialise(
        add(FournisseurHorloge.maintenant(), { minutes: 21 })
      );

      expect(
        new ServiceUtilisateur(
          new EntrepotUtilisateurMemoire()
        ).modifieMotDePasse({
          motDePasse: 'mdp',
          confirmationMotDePasse: 'mdp',
          token: {
            identifiant: crypto.randomUUID(),
            date: dateGenerationToken,
          },
        })
      ).rejects.toStrictEqual(
        ErreurMAC.cree(
          'Réinitialisation mot de passe',
          new ErreurReinitialisationMotDePasse(
            'Le lien de réinitialisation du mot de passe n’est plus valide.'
          )
        )
      );
    });

    it('N’est pas valide si la date est invalide', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      FournisseurHorlogeDeTest.initialise(
        add(FournisseurHorloge.maintenant(), { minutes: 21 })
      );

      expect(
        new ServiceUtilisateur(
          new EntrepotUtilisateurMemoire()
        ).modifieMotDePasse({
          motDePasse: 'mdp',
          confirmationMotDePasse: 'mdp',
          token: {
            identifiant: crypto.randomUUID(),
            date: null as unknown as Date,
          },
        })
      ).rejects.toStrictEqual(
        ErreurMAC.cree(
          'Réinitialisation mot de passe',
          new ErreurReinitialisationMotDePasse(
            'Le lien de réinitialisation du mot de passe n’est plus valide.'
          )
        )
      );
    });
  });
});
