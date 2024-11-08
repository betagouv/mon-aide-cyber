import { CapteurCommande, Commande } from '../../domaine/commande';
import { Entrepots } from '../../domaine/Entrepots';
import { BusEvenement } from '../../domaine/BusEvenement';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { ServiceDeChiffrement } from '../../securite/ServiceDeChiffrement';
import { adaptateurCorpsMessage } from './adaptateurCorpsMessage';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

export type CommandeReinitialisationMotDePasse = Commande & {
  type: 'CommandeReinitialisationMotDePasse';
  email: string;
};

export class CapteurCommandeReinitialisationMotDePasse
  implements CapteurCommande<CommandeReinitialisationMotDePasse, void>
{
  constructor(
    private readonly entrepots: Entrepots,
    _busEvenement: BusEvenement,
    private readonly adapteurEnvoiMail: AdaptateurEnvoiMail,
    private readonly serviceDeChiffrement: ServiceDeChiffrement
  ) {}

  execute(commande: CommandeReinitialisationMotDePasse): Promise<void> {
    return this.entrepots
      .utilisateurs()
      .rechercheParIdentifiantDeConnexion(commande.email)
      .then((utilisateur) => {
        const partieChiffree = this.serviceDeChiffrement.chiffre(
          Buffer.from(
            JSON.stringify({
              identifiant: utilisateur.identifiant,
              date: FournisseurHorloge.maintenant(),
            }),
            'binary'
          ).toString('base64')
        );
        return this.adapteurEnvoiMail
          .envoie(
            {
              objet: '[MonAideCyber] Réinitialisation de votre mot de passe',
              corps: adaptateurCorpsMessage
                .reinitialiserMotDePasse()
                .genereCorpsMessage(
                  utilisateur.nomPrenom,
                  `${adaptateurEnvironnement.mac().urlMAC()}/utilisateur/reinitialiser-mot-de-passe?token=${partieChiffree}`
                ),
              destinataire: { email: utilisateur.identifiantConnexion },
            },
            'INFO'
          )
          .then(() => Promise.resolve());
      });
  }
}
