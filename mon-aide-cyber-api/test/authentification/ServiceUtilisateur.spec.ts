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
import { unUtilisateur } from '../constructeurs/constructeursAidantUtilisateur';
import { sommeDeControle } from '../../src/authentification/sommeDeControle';

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
            sommeDeControle: '',
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

    it('N’est valide qu’une seule et unique fois', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const utilisateur = unUtilisateur()
        .avecUnMotDePasse('nouveau-mot-de-passe')
        .construis();
      const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      await entrepotUtilisateur.persiste(utilisateur);

      expect(
        new ServiceUtilisateur(entrepotUtilisateur).modifieMotDePasse({
          motDePasse: 'mdp',
          confirmationMotDePasse: 'mdp',
          token: {
            identifiant: utilisateur.identifiant,
            date: FournisseurHorloge.maintenant(),
            sommeDeControle: crypto
              .createHash('sha256')
              .update('ancien-mot-de-passe')
              .digest('base64'),
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
            sommeDeControle: sommeDeControle('ancien'),
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
