import { CapteurCommande, Commande } from '../../domaine/commande';
import { Entrepots } from '../../domaine/Entrepots';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { ServiceDeChiffrement } from '../../securite/ServiceDeChiffrement';
import { adaptateurCorpsMessage } from './adaptateurCorpsMessage';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { sommeDeControle } from '../sommeDeControle';
import crypto from 'crypto';
import { adaptateurUUID } from '../../infrastructure/adaptateurs/adaptateurUUID';

export type CommandeReinitialisationMotDePasse = Commande & {
  type: 'CommandeReinitialisationMotDePasse';
  email: string;
};

export class CapteurCommandeReinitialisationMotDePasse
  implements CapteurCommande<CommandeReinitialisationMotDePasse, void>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busEvenement: BusEvenement,
    private readonly adapteurEnvoiMail: AdaptateurEnvoiMail,
    private readonly serviceDeChiffrement: ServiceDeChiffrement
  ) {}

  async execute(commande: CommandeReinitialisationMotDePasse): Promise<void> {
    try {
      const utilisateur = await this.entrepots
        .utilisateurs()
        .rechercheParIdentifiantDeConnexion(commande.email);

      const partieChiffree = this.serviceDeChiffrement.chiffre(
        Buffer.from(
          JSON.stringify({
            identifiant: utilisateur.identifiant,
            date: FournisseurHorloge.maintenant(),
            sommeDeControle: sommeDeControle(utilisateur.motDePasse),
          }),
          'binary'
        ).toString('base64')
      );

      await this.adapteurEnvoiMail.envoie(
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
      );

      await this.busEvenement.publie<ReinitialisationMotDePasseDemandee>(
        this.genereEvenement({
          statut: 'SUCCES',
          identifiant: utilisateur.identifiant,
        })
      );
    } catch (erreur) {
      await this.busEvenement.publie<ReinitialisationMotDePasseDemandee>(
        this.genereEvenement({ statut: 'ERREUR', email: commande.email })
      );
    }
  }

  private genereEvenement(
    corps: EvenementEnSucces | EvenementEnErreur
  ): ReinitialisationMotDePasseDemandee {
    return {
      corps: { ...corps },
      date: FournisseurHorloge.maintenant(),
      identifiant: adaptateurUUID.genereUUID(),
      type: 'REINITIALISATION_MOT_DE_PASSE_DEMANDEE',
    };
  }
}

type EvenementReinitialisationMotDePasseDemandee = {
  statut: 'SUCCES' | 'ERREUR';
};

type EvenementEnSucces = EvenementReinitialisationMotDePasseDemandee & {
  identifiant: crypto.UUID;
};
type EvenementEnErreur = EvenementReinitialisationMotDePasseDemandee & {
  email: string;
};
export type ReinitialisationMotDePasseDemandee = Evenement<
  EvenementEnSucces | EvenementEnErreur
>;
