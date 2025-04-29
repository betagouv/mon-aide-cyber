import { beforeEach, describe, expect, it } from 'vitest';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { unUtilisateur } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import {
  CapteurCommandeReinitialisationMotDePasse,
  ReinitialisationMotDePasseDemandee,
} from '../../../src/authentification/reinitialisation-mot-de-passe/CapteurCommandeReinitialisationMotDePasse';
import { FauxServiceDeChiffrement } from '../../infrastructure/securite/FauxServiceDeChiffrement';
import { adaptateurCorpsMessage } from '../../../src/authentification/reinitialisation-mot-de-passe/adaptateurCorpsMessage';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { sommeDeControle } from '../../../src/authentification/sommeDeControle';
import { ServiceDeChiffrementClair } from '../../infrastructure/securite/ServiceDeChiffrementClair';
import { adaptateurUUID } from '../../../src/infrastructure/adaptateurs/adaptateurUUID';
import crypto from 'crypto';

describe('Capteur de commande de réinitialisation du mot de passe', () => {
  let entrepots = new EntrepotsMemoire();
  let busEvenement = new BusEvenementDeTest();
  let adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();

  beforeEach(() => {
    FournisseurHorlogeDeTest.initialise(new Date());
    process.env.URL_MAC = 'http://localhost:8081';
    entrepots = new EntrepotsMemoire();
    busEvenement = new BusEvenementDeTest();
    adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
  });

  it('Envoie le mail de modification de mot de passe', async () => {
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
                date: FournisseurHorloge.maintenant(),
                sommeDeControle: sommeDeControle(utilisateur.motDePasse),
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

  it('Publie l’événement REINITIALISATION_MOT_DE_PASSE_DEMANDEE', async () => {
    const uuid = crypto.randomUUID();
    adaptateurUUID.genereUUID = () => uuid;
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
                date: FournisseurHorloge.maintenant(),
                sommeDeControle: sommeDeControle(utilisateur.motDePasse),
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
      busEvenement.consommateursTestes.get(
        'REINITIALISATION_MOT_DE_PASSE_DEMANDEE'
      )?.[0].evenementConsomme
    ).toStrictEqual<ReinitialisationMotDePasseDemandee>({
      type: 'REINITIALISATION_MOT_DE_PASSE_DEMANDEE',
      date: FournisseurHorloge.maintenant(),
      corps: { statut: 'SUCCES', identifiant: utilisateur.identifiant },
      identifiant: uuid,
    });
  });

  it('Publie l’événement REINITIALISATION_MOT_DE_PASSE_DEMANDEE même en cas d’erreur', async () => {
    const uuid = crypto.randomUUID();
    adaptateurUUID.genereUUID = () => uuid;

    await new CapteurCommandeReinitialisationMotDePasse(
      entrepots,
      busEvenement,
      adaptateurEnvoiMail,
      new ServiceDeChiffrementClair()
    ).execute({
      type: 'CommandeReinitialisationMotDePasse',
      email: 'jean.dupont@email.com',
    });

    expect(
      busEvenement.consommateursTestes.get(
        'REINITIALISATION_MOT_DE_PASSE_DEMANDEE'
      )?.[0].evenementConsomme
    ).toStrictEqual<ReinitialisationMotDePasseDemandee>({
      type: 'REINITIALISATION_MOT_DE_PASSE_DEMANDEE',
      date: FournisseurHorloge.maintenant(),
      corps: { statut: 'ERREUR', email: 'jean.dupont@email.com' },
      identifiant: uuid,
    });
  });
});
