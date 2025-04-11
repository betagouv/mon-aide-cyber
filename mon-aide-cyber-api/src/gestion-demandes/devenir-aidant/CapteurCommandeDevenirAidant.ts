import { CapteurCommande, Commande } from '../../domaine/commande';
import {
  DemandeDevenirAidant,
  EntiteDemande,
  futurAidantEnAttenteAdhesionAssociation,
  StatutDemande,
  TypeEntite,
} from './DemandeDevenirAidant';
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
import { ServiceAidant } from '../../espace-aidant/ServiceAidant';
import { isBefore } from 'date-fns';

export type CommandeDevenirAidant = Omit<Commande, 'type'> & {
  type: 'CommandeDevenirAidant';
  departement: Departement;
  mail: string;
  prenom: string;
  nom: string;
  entite?: EntiteDemande;
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
    },
    private readonly serviceAidant: ServiceAidant
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

    const demandeEnCours = await this.entrepots
      .demandesDevenirAidant()
      .rechercheDemandeEnCoursParMail(mailDemandeur);

    const demandeDevenirAidant: DemandeDevenirAidant = {
      date: FournisseurHorloge.maintenant(),
      departement: commande.departement,
      identifiant: demandeEnCours
        ? demandeEnCours.identifiant
        : crypto.randomUUID(),
      mail: mailDemandeur,
      nom: commande.nom,
      prenom: commande.prenom,
      statut: StatutDemande.EN_COURS,
      ...(commande.entite && { entite: commande.entite }),
    };

    return this.entrepots
      .demandesDevenirAidant()
      .persiste(demandeDevenirAidant)
      .then(async () => {
        await this.publieLaDemande(demandeDevenirAidant, !!demandeEnCours);
        return this.envoieLeMailDeMiseEnRelation(
          demandeDevenirAidant,
          !!demandeEnCours
        )
          .then(() => demandeDevenirAidant)
          .catch((e) =>
            Promise.reject(
              ErreurMAC.cree(
                'Demande devenir Aidant',
                new ErreurEnvoiEmail(
                  'Le mail de mise en relation n’a pu être remis.',
                  { cause: e }
                )
              )
            )
          );
      });
  }

  private async demandeExiste(mail: string): Promise<boolean> {
    return (
      isBefore(
        FournisseurHorloge.maintenant(),
        FournisseurHorloge.enDate(
          adaptateurEnvironnement.nouveauParcoursDevenirAidant()
        )
      ) && (await this.entrepots.demandesDevenirAidant().demandeExiste(mail))
    );
  }

  private async aidantExiste(mailDemandeur: string) {
    return !!(await this.serviceAidant.rechercheParMail(mailDemandeur));
  }

  private async envoieLeMailDeMiseEnRelation(
    demandeDevenirAidant: DemandeDevenirAidant,
    miseAJourDemande: boolean
  ) {
    const genereObjetEtCorpsDuMessage = () => {
      let objet =
        'MonAideCyber - Demande de participation à un atelier Devenir Aidant';
      let generateurCorpsMessage: () => {
        genereCorpsMessage: (
          demandeDevenirAidant: DemandeDevenirAidant
        ) => string;
      } = adaptateurCorpsMessage.demandeDevenirAidant;
      if (miseAJourDemande) {
        objet =
          'MonAideCyber - Mise à jour pour une demande de participation à un atelier';
        generateurCorpsMessage =
          adaptateurCorpsMessage.miseAJourDemandeDevenirAidant;
      }
      if (futurAidantEnAttenteAdhesionAssociation(demandeDevenirAidant)) {
        objet =
          'MonAideCyber - Votre demande d’adhérer à une association pour participer à un atelier';
        generateurCorpsMessage =
          adaptateurCorpsMessage.demandeDevenirAidantEnAttenteAdhésion;
      }
      return { objet, generateurCorpsMessage };
    };

    const { objet, generateurCorpsMessage } = genereObjetEtCorpsDuMessage();
    await this.adaptateurEnvoiMail.envoie({
      objet: objet,
      destinataire: {
        nom: `${demandeDevenirAidant.nom} ${demandeDevenirAidant.prenom}`,
        email: demandeDevenirAidant.mail,
      },
      corps: generateurCorpsMessage().genereCorpsMessage(demandeDevenirAidant),
      copie: this.annuaireCOT().rechercheEmailParDepartement(
        demandeDevenirAidant.departement
      ),
      copieInvisible: adaptateurEnvironnement.messagerie().emailMAC(),
    });
  }

  private async publieLaDemande(
    demandeDevenirAidant: DemandeDevenirAidant,
    demandeEncours: boolean
  ) {
    await this.busEvenement.publie<DemandeDevenirAidantCreee>({
      type: demandeEncours
        ? 'DEMANDE_DEVENIR_AIDANT_MODIFIEE'
        : 'DEMANDE_DEVENIR_AIDANT_CREEE',
      identifiant: demandeDevenirAidant.identifiant,
      date: FournisseurHorloge.maintenant(),
      corps: {
        date: demandeDevenirAidant.date,
        departement: demandeDevenirAidant.departement.nom,
        identifiantDemande: demandeDevenirAidant.identifiant,
        ...(demandeDevenirAidant.entite && {
          type: demandeDevenirAidant.entite.type,
        }),
      },
    });
  }
}

export type DemandeDevenirAidantCreee = Evenement<{
  date: Date;
  departement: string;
  identifiantDemande: crypto.UUID;
  type?: TypeEntite;
}>;

export type DemandeDevenirAidantModifiee = DemandeDevenirAidantCreee;
