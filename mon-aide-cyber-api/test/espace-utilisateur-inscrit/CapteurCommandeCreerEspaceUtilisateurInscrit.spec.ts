import { describe, expect, it } from 'vitest';
import {
  CapteurCommandeCreerEspaceUtilisateurInscrit,
  EspaceUtilisateurInscritCree,
  UtilisateurInscritCree,
} from '../../src/espace-utilisateur-inscrit/CapteurCommandeCreerEspaceUtilisateurInscrit';
import { UtilisateurInscrit } from '../../src/espace-utilisateur-inscrit/UtilisateurInscrit';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';

describe('Capteur de commande de création d’un Utilisateur Inscrit', () => {
  it('Crée un Utilisateur Inscrit', async () => {
    const entrepotsMemoire = new EntrepotsMemoire();

    const utilisateurCree =
      await new CapteurCommandeCreerEspaceUtilisateurInscrit(
        entrepotsMemoire,
        new BusEvenementDeTest(),
        new AdaptateurEnvoiMailMemoire()
      ).execute({
        identifiant: crypto.randomUUID(),
        email: 'jean.dupont@utilisateur-inscrit.com',
        nomPrenom: 'Jean Dupont',
        type: 'CommandeCreerEspaceUtilisateurInscrit',
      });

    expect(utilisateurCree).toStrictEqual<EspaceUtilisateurInscritCree>({
      identifiant: expect.any(String),
      email: 'jean.dupont@utilisateur-inscrit.com',
      nomPrenom: 'Jean Dupont',
    });
    expect(
      (await entrepotsMemoire.utilisateursInscrits().tous())[0]
    ).toStrictEqual<UtilisateurInscrit>({
      identifiant: utilisateurCree.identifiant,
      email: 'jean.dupont@utilisateur-inscrit.com',
      nomPrenom: 'Jean Dupont',
    });
  });

  it('Crée un Utilisateur Inscrit avec une entité', async () => {
    const entrepotsMemoire = new EntrepotsMemoire();

    const utilisateurCree =
      await new CapteurCommandeCreerEspaceUtilisateurInscrit(
        entrepotsMemoire,
        new BusEvenementDeTest(),
        new AdaptateurEnvoiMailMemoire()
      ).execute({
        identifiant: crypto.randomUUID(),
        email: 'jean.dupont@utilisateur-inscrit.com',
        nomPrenom: 'Jean Dupont',
        siret: '1234567890',
        type: 'CommandeCreerEspaceUtilisateurInscrit',
      });

    expect(
      (await entrepotsMemoire.utilisateursInscrits().tous())[0]
    ).toStrictEqual<UtilisateurInscrit>({
      identifiant: utilisateurCree.identifiant,
      email: 'jean.dupont@utilisateur-inscrit.com',
      nomPrenom: 'Jean Dupont',
      entite: { siret: '1234567890' },
    });
  });

  it('Publie l’événement UTILISATEUR_INSCRIT_CREE', async () => {
    const busEvenement = new BusEvenementDeTest();

    const utilisateurCree =
      await new CapteurCommandeCreerEspaceUtilisateurInscrit(
        new EntrepotsMemoire(),
        busEvenement,
        new AdaptateurEnvoiMailMemoire()
      ).execute({
        identifiant: crypto.randomUUID(),
        email: 'jean.dupont@utilisateur-inscrit.com',
        nomPrenom: 'Jean Dupont',
        type: 'CommandeCreerEspaceUtilisateurInscrit',
      });

    expect(busEvenement.evenementRecu).toStrictEqual<UtilisateurInscritCree>({
      identifiant: utilisateurCree.identifiant,
      type: 'UTILISATEUR_INSCRIT_CREE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiant: utilisateurCree.identifiant,
        typeUtilisateur: 'UtilisateurInscrit',
      },
    });
  });

  it('Consomme l’événement UTILISATEUR_INSCRIT_CREE', async () => {
    const busEvenement = new BusEvenementDeTest();

    const utilisateurCree =
      await new CapteurCommandeCreerEspaceUtilisateurInscrit(
        new EntrepotsMemoire(),
        busEvenement,
        new AdaptateurEnvoiMailMemoire()
      ).execute({
        identifiant: crypto.randomUUID(),
        email: 'jean.dupont@utilisateur-inscrit.com',
        nomPrenom: 'Jean Dupont',
        type: 'CommandeCreerEspaceUtilisateurInscrit',
      });
    expect(
      busEvenement.consommateursTestes.get('UTILISATEUR_INSCRIT_CREE')?.[0]
        .evenementConsomme
    ).toStrictEqual<UtilisateurInscritCree>({
      type: 'UTILISATEUR_INSCRIT_CREE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiant: utilisateurCree.identifiant,
        typeUtilisateur: 'UtilisateurInscrit',
      },
      identifiant: utilisateurCree.identifiant,
    });
  });
});
