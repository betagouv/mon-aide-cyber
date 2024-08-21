import { CapteurCommande, Commande } from '../../domaine/commande';
import { DemandeDevenirAidant } from './DemandeDevenirAidant';
import { Entrepots } from '../../domaine/Entrepots';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { ErreurMAC } from '../../domaine/erreurMAC';
import { Departement } from '../departements';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { adaptateurCorpsMessage } from './adaptateurCorpsMessage';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import crypto from 'crypto';
import { ErreurEnvoiEmail } from '../../api/messagerie/Messagerie';
import { ServiceChercheAidant } from '../../authentification/ServiceChercheAidant';

export type CommandeDevenirAidant = Omit<Commande, 'type'> & {
  type: 'CommandeDevenirAidant';
  departement: Departement;
  mail: string;
  prenom: string;
  nom: string;
};

class ErreurDemandeDevenirAidant extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}

export class CapteurCommandeDevenirAidant
  implements CapteurCommande<CommandeDevenirAidant, DemandeDevenirAidant>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busEvenement: BusEvenement,
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly annuaireCOT: () => {
      rechercheEmailParDepartement: (departement: Departement) => string;
    }
  ) {}

  async execute(
    commande: CommandeDevenirAidant
  ): Promise<DemandeDevenirAidant> {
    const mailDemandeur = commande.mail;

    if (await this.demandeExiste(mailDemandeur)) {
      return Promise.reject(
        ErreurMAC.cree(
          'Demande devenir Aidant',
          new ErreurDemandeDevenirAidant('Une demande existe déjà')
        )
      );
    }

    if (await this.aidantExiste(mailDemandeur)) {
      return Promise.reject(
        ErreurMAC.cree(
          'Demande devenir Aidant',
          new ErreurDemandeDevenirAidant(
            'Cette adresse électronique est déja utilisée'
          )
        )
      );
    }

    const demandeDevenirAidant: DemandeDevenirAidant = {
      date: FournisseurHorloge.maintenant(),
      departement: commande.departement,
      identifiant: crypto.randomUUID(),
      mail: mailDemandeur,
      nom: commande.nom,
      prenom: commande.prenom,
    };

    return this.entrepots
      .demandesDevenirAidant()
      .persiste(demandeDevenirAidant)
      .then(async () => {
        await this.publieLaDemandeCree(demandeDevenirAidant);
        return this.envoieLeMailDeMiseEnRelation(demandeDevenirAidant)
          .then(() => demandeDevenirAidant)
          .catch(() =>
            Promise.reject(
              ErreurMAC.cree(
                'Demande devenir Aidant',
                new ErreurEnvoiEmail(
                  'Le mail de mise en relation n’a pu être remis.'
                )
              )
            )
          );
      });
  }

  private async demandeExiste(mail: string): Promise<boolean> {
    return await this.entrepots.demandesDevenirAidant().demandeExiste(mail);
  }

  private async aidantExiste(mailDemandeur: string) {
    return !!(await new ServiceChercheAidant(
      this.entrepots.aidants()
    ).chercheParMail(mailDemandeur));
  }

  private async envoieLeMailDeMiseEnRelation(
    demandeDevenirAidant: DemandeDevenirAidant
  ) {
    await this.adaptateurEnvoiMail.envoie({
      objet:
        'MonAideCyber - Demande de participation à une session de formation Aidant ANSSI',
      destinataire: {
        nom: `${demandeDevenirAidant.nom} ${demandeDevenirAidant.prenom}`,
        email: demandeDevenirAidant.mail,
      },
      corps: adaptateurCorpsMessage
        .demandeDevenirAidant()
        .genereCorpsMessage(demandeDevenirAidant),
      copie: this.annuaireCOT().rechercheEmailParDepartement(
        demandeDevenirAidant.departement
      ),
      copieInvisible: adaptateurEnvironnement.messagerie().emailMAC(),
    });
  }

  private async publieLaDemandeCree(
    demandeDevenirAidant: DemandeDevenirAidant
  ) {
    await this.busEvenement.publie<DemandeDevenirAidantCreee>({
      type: 'DEMANDE_DEVENIR_AIDANT_CREEE',
      identifiant: demandeDevenirAidant.identifiant,
      date: FournisseurHorloge.maintenant(),
      corps: {
        date: demandeDevenirAidant.date,
        departement: demandeDevenirAidant.departement.nom,
        identifiantDemande: demandeDevenirAidant.identifiant,
      },
    });
  }
}

export type DemandeDevenirAidantCreee = Omit<Evenement, 'corps'> & {
  corps: {
    date: Date;
    departement: string;
    identifiantDemande: crypto.UUID;
  };
};
