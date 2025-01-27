import { describe, it } from 'vitest';
import {
  CapteurCommandeCreerEspaceUtilisateurInscrit,
  EspaceUtilisateurInscritCree,
} from '../../src/espace-utilisateur-inscrit/CapteurCommandeCreerEspaceUtilisateurInscrit';
import { UtilisateurInscrit } from '../../src/espace-utilisateur-inscrit/UtilisateurInscrit';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';

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
});
