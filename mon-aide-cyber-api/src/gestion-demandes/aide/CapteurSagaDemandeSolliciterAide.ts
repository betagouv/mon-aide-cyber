import { BusCommande, CapteurSaga, Saga } from '../../domaine/commande';
import { CommandeCreerAide } from '../../aide/CapteurCommandeCreerAide';
import crypto from 'crypto';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { adaptateursCorpsMessage } from './adaptateursCorpsMessage';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { rechercheParNomDepartement } from '../departements';
import { Aide } from '../../aide/Aide';
import { ServiceAidant } from '../../espace-aidant/ServiceAidant';

export type SagaDemandeSolliciterAide = Omit<Saga, 'type'> & {
  email: string;
  departement: string;
  identifiantAidant: crypto.UUID;
  raisonSociale?: string;
  type: 'SagaDemandeSolliciterAide';
};

export type DemandeSolliciterAideCree = Evenement<{
  identifiantAide: crypto.UUID;
  identifiantAidant: crypto.UUID;
  departement: string;
}>;

export class CapteurSagaDemandeSolliciterAide
  implements CapteurSaga<SagaDemandeSolliciterAide, void>
{
  constructor(
    private readonly busCommande: BusCommande,
    private readonly busEvenement: BusEvenement,
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly serviceAidant: ServiceAidant
  ) {}

  execute(saga: SagaDemandeSolliciterAide): Promise<void> {
    const commande: CommandeCreerAide = {
      type: 'CommandeCreerAide',
      departement: saga.departement,
      email: saga.email,
      ...(saga.raisonSociale && { raisonSociale: saga.raisonSociale }),
    };
    return this.busCommande
      .publie<CommandeCreerAide, Aide>(commande)
      .then((aide: Aide) =>
        this.serviceAidant
          .parIdentifiant(saga.identifiantAidant)
          .then((aidant) =>
            Promise.all([
              this.adaptateurEnvoiMail.envoie(
                {
                  corps: adaptateursCorpsMessage
                    .sollicitation()
                    .notificationAidantSollicitation()
                    .genereCorpsMessage({
                      departement: saga.departement,
                      mailEntite: saga.email,
                      nomPrenom: aidant!.nomUsage,
                      ...(saga.raisonSociale && {
                        raisonSocialeEntite: saga.raisonSociale,
                      }),
                    }),
                  destinataire: { email: aidant!.email },
                  objet:
                    'MonAideCyber - Une entité vous sollicite depuis l’annuaire des Aidants cyber.',
                },
                'INFO'
              ),
              this.adaptateurEnvoiMail.envoie({
                corps: adaptateursCorpsMessage
                  .sollicitation()
                  .recapitulatifMAC()
                  .genereCorpsMessage({
                    aidant: aidant!.nomUsage,
                    departement: saga.departement,
                    mailEntite: saga.email,
                    ...(saga.raisonSociale && {
                      raisonSociale: saga.raisonSociale,
                    }),
                  }),
                destinataire: {
                  email: adaptateurEnvironnement.messagerie().emailMAC(),
                },
                objet:
                  'MonAideCyber - Une entité a sollicité un Aidant depuis l’annuaire des Aidants cyber',
              }),
              this.adaptateurEnvoiMail.envoie(
                {
                  corps: adaptateursCorpsMessage
                    .sollicitation()
                    .recapitulatifSollicitationAide({
                      departement: saga.departement,
                      nomPrenom: aidant!.nomUsage,
                    })
                    .genereCorpsMessage(),
                  destinataire: { email: saga.email },
                  objet:
                    'MonAideCyber - Mise en relation avec l’Aidant cyber de votre choix',
                },
                'INFO'
              ),
            ])
          )
          .then(() => {
            return this.busEvenement
              .publie<DemandeSolliciterAideCree>({
                identifiant: aide.identifiant,
                type: 'AIDE_VIA_SOLLICITATION_AIDANT_CREE',
                date: FournisseurHorloge.maintenant(),
                corps: {
                  identifiantAide: aide.identifiant,
                  identifiantAidant: saga.identifiantAidant,
                  departement: rechercheParNomDepartement(saga.departement)
                    .code,
                },
              })
              .then(() => Promise.resolve());
          })
      );
  }
}
