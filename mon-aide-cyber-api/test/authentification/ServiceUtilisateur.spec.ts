import { beforeEach, describe, expect, it } from 'vitest';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import {
  ErreurReinitialisationMotDePasse,
  ReinitialisationMotDePasseErronee,
  ReinitialisationMotDePasseFaite,
  ServiceUtilisateur,
} from '../../src/authentification/ServiceUtilisateur';
import { EntrepotUtilisateurMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import crypto from 'crypto';
import { add } from 'date-fns';
import { ErreurMAC } from '../../src/domaine/erreurMAC';
import { unUtilisateur } from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { sommeDeControle } from '../../src/authentification/sommeDeControle';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { FauxServiceDeChiffrement } from '../infrastructure/securite/FauxServiceDeChiffrement';
import { authentifie } from '../../src/authentification/authentification';
import { FauxGestionnaireDeJeton } from '../infrastructure/authentification/FauxGestionnaireDeJeton';

describe('Service utilisateur', () => {
  describe('Modification du mot de passe', () => {
    let busEvenement = new BusEvenementDeTest();

    beforeEach(() => {
      busEvenement = new BusEvenementDeTest();
    });

    it('N’est valide que pendant 20 minutes', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const dateGenerationToken = FournisseurHorloge.maintenant();
      FournisseurHorlogeDeTest.initialise(
        add(FournisseurHorloge.maintenant(), { minutes: 21 })
      );

      await expect(
        new ServiceUtilisateur(
          new EntrepotUtilisateurMemoire(),
          busEvenement,
          new FauxServiceDeChiffrement(new Map())
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

      await expect(
        new ServiceUtilisateur(
          entrepotUtilisateur,
          busEvenement,
          new FauxServiceDeChiffrement(new Map())
        ).modifieMotDePasse({
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

      await expect(
        new ServiceUtilisateur(
          new EntrepotUtilisateurMemoire(),
          busEvenement,
          new FauxServiceDeChiffrement(new Map())
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

    it('Hache le nouveau mot de passe afin que l’utilisateur puisse s’authentifier avec', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const utilisateur = unUtilisateur().construis();
      const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      await entrepotUtilisateur.persiste(utilisateur);
      const serviceDeChiffrement = new FauxServiceDeChiffrement(new Map());

      await new ServiceUtilisateur(
        entrepotUtilisateur,
        busEvenement,
        serviceDeChiffrement
      ).modifieMotDePasse({
        motDePasse: 'nouveau-mdp',
        confirmationMotDePasse: 'nouveau-mdp',
        token: {
          identifiant: utilisateur.identifiant,
          date: FournisseurHorloge.maintenant(),
          sommeDeControle: sommeDeControle(utilisateur.motDePasse),
        },
      });

      const utilisateurModifie = await entrepotUtilisateur.lis(
        utilisateur.identifiant
      );
      expect(utilisateurModifie.motDePasse).toStrictEqual('nouveau-mdp hashee');
      expect(
        await authentifie(
          entrepotUtilisateur,
          serviceDeChiffrement,
          new FauxGestionnaireDeJeton(),
          utilisateur.identifiantConnexion,
          'nouveau-mdp'
        )
      ).toStrictEqual(
        expect.objectContaining({ identifiant: utilisateur.identifiant })
      );
    });

    describe('Publie un événement', () => {
      it('REINITIALISATION_MOT_DE_PASSE_FAITE lorsque le mot de passe est modifié', async () => {
        const busEvenement = new BusEvenementDeTest();
        FournisseurHorlogeDeTest.initialise(new Date());
        const utilisateur = unUtilisateur().construis();
        const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
        await entrepotUtilisateur.persiste(utilisateur);

        await new ServiceUtilisateur(
          entrepotUtilisateur,
          busEvenement,
          new FauxServiceDeChiffrement(new Map())
        ).modifieMotDePasse({
          motDePasse: 'mdp',
          confirmationMotDePasse: 'mdp',
          token: {
            identifiant: utilisateur.identifiant,
            date: FournisseurHorloge.maintenant(),
            sommeDeControle: crypto
              .createHash('sha256')
              .update(utilisateur.motDePasse)
              .digest('base64'),
          },
        });

        expect(
          busEvenement.consommateursTestes.get(
            'REINITIALISATION_MOT_DE_PASSE_FAITE'
          )?.[0].evenementConsomme
        ).toStrictEqual<ReinitialisationMotDePasseFaite>({
          identifiant: expect.any(String),
          type: 'REINITIALISATION_MOT_DE_PASSE_FAITE',
          date: FournisseurHorloge.maintenant(),
          corps: {
            identifiant: utilisateur.identifiant,
          },
        });
      });

      it('REINITIALISATION_MOT_DE_PASSE_ERRONEE lorsqu’il y a une erreur (date échue)', async () => {
        FournisseurHorlogeDeTest.initialise(new Date());
        const dateToken = add(FournisseurHorloge.maintenant(), {
          minutes: -25,
        });
        const utilisateur = unUtilisateur().construis();
        const busEvenement = new BusEvenementDeTest();
        try {
          const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
          await entrepotUtilisateur.persiste(utilisateur);

          await new ServiceUtilisateur(
            entrepotUtilisateur,
            busEvenement,
            new FauxServiceDeChiffrement(new Map())
          ).modifieMotDePasse({
            motDePasse: 'mdp',
            confirmationMotDePasse: 'mdp',
            token: {
              identifiant: utilisateur.identifiant,
              date: dateToken,
              sommeDeControle: crypto
                .createHash('sha256')
                .update('ancien-mot-de-passe')
                .digest('base64'),
            },
          });

          expect.fail('Une erreur devrait être renvoyée');
        } catch (_erreur) {
          expect(
            busEvenement.consommateursTestes.get(
              'REINITIALISATION_MOT_DE_PASSE_ERRONEE'
            )?.[0].evenementConsomme
          ).toStrictEqual<ReinitialisationMotDePasseErronee>({
            identifiant: expect.any(String),
            type: 'REINITIALISATION_MOT_DE_PASSE_ERRONEE',
            date: FournisseurHorloge.maintenant(),
            corps: {
              identifiant: utilisateur.identifiant,
              raison: 'DATE_ECHUE',
            },
          });
        }
      });

      it('REINITIALISATION_MOT_DE_PASSE_ERRONEE lorsqu’il y a une erreur (mot de passe déjà changé)', async () => {
        FournisseurHorlogeDeTest.initialise(new Date());
        const utilisateur = unUtilisateur()
          .avecUnMotDePasse('nouveau-mot-de-passe')
          .construis();
        const busEvenement = new BusEvenementDeTest();
        try {
          const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
          await entrepotUtilisateur.persiste(utilisateur);

          await new ServiceUtilisateur(
            entrepotUtilisateur,
            busEvenement,
            new FauxServiceDeChiffrement(new Map())
          ).modifieMotDePasse({
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
          });

          expect.fail('Une erreur devrait être renvoyée');
        } catch (_erreur) {
          expect(
            busEvenement.consommateursTestes.get(
              'REINITIALISATION_MOT_DE_PASSE_ERRONEE'
            )?.[0].evenementConsomme
          ).toStrictEqual<ReinitialisationMotDePasseErronee>({
            identifiant: expect.any(String),
            type: 'REINITIALISATION_MOT_DE_PASSE_ERRONEE',
            date: FournisseurHorloge.maintenant(),
            corps: {
              identifiant: utilisateur.identifiant,
              raison: 'REINITIALISATION_DEJA_FAITE',
            },
          });
        }
      });
    });
  });
});
