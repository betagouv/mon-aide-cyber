import { beforeEach, describe, expect, it } from 'vitest';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { unUtilisateur } from '../../constructeurs/constructeursAidantUtilisateur';
import { CapteurCommandeReinitialisationMotDePasse } from '../../../src/authentification/reinitialisation-mot-de-passe/CapteurCommandeReinitialisationMotDePasse';
import { FauxServiceDeChiffrement } from '../../infrastructure/securite/FauxServiceDeChiffrement';
import { adaptateurCorpsMessage } from '../../../src/authentification/reinitialisation-mot-de-passe/adaptateurCorpsMessage';

describe('Capteur de commande de réinitialisation du mot de passe', () => {
  beforeEach(() => {
    process.env.URL_MAC = 'http://localhost:8081';
  });
  it('Envoie le mail de modification de mot de passe', async () => {
    const entrepots = new EntrepotsMemoire();
    const busEvenement = new BusEvenementDeTest();
    const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    adaptateurCorpsMessage.reinitialiserMotDePasse = () => ({
      genereCorpsMessage: (nomPrenom: string, url: string) =>
        `Bonjour ${nomPrenom}, ${url}`,
    });
    const utilisateur = unUtilisateur().construis();
    await entrepots.utilisateurs().persiste(utilisateur);

    await new CapteurCommandeReinitialisationMotDePasse(
      entrepots,
      busEvenement,
      adaptateurEnvoiMail,
      new FauxServiceDeChiffrement(
        new Map([
          [
            Buffer.from(
              JSON.stringify({
                identifiant: utilisateur.identifiant,
              }),
              'binary'
            ).toString('base64'),
            'aaa',
          ],
        ])
      )
    ).execute({
      type: 'CommandeReinitialisationMotDePasse',
      email: utilisateur.identifiantConnexion,
    });

    expect(
      adaptateurEnvoiMail.aEteEnvoyeA(
        utilisateur.identifiantConnexion,
        `Bonjour ${utilisateur.nomPrenom}, http://localhost:8081/utilisateur/reinitialiser-mot-de-passe?token=aaa`
      )
    ).toBe(true);
    expect(adaptateurEnvoiMail.aEteEnvoyePar('INFO')).toBe(true);
  });
});
