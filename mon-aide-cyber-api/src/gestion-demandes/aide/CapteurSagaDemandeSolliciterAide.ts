import { BusCommande, CapteurSaga, Saga } from '../../domaine/commande';
import { CommandeCreerAide } from '../../aide/CapteurCommandeCreerAide';
import crypto from 'crypto';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { adaptateurCorpsMessage } from './adaptateurCorpsMessage';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { ServiceAidant } from '../../authentification/ServiceAidant';

export type SagaDemandeSolliciterAide = Omit<Saga, 'type'> & {
  email: string;
  departement: string;
  identifiantAidant: crypto.UUID;
  raisonSociale?: string;
  type: 'SagaDemandeSolliciterAide';
};

export class CapteurSagaDemandeSolliciterAide
  implements CapteurSaga<SagaDemandeSolliciterAide, void>
{
  constructor(
    private readonly busCommande: BusCommande,
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
    return this.busCommande.publie<CommandeCreerAide, void>(commande).then(() =>
      this.serviceAidant
        .parIdentifiant(saga.identifiantAidant)
        .then((aidant) =>
          Promise.all([
            this.adaptateurEnvoiMail.envoie(
              {
                corps: adaptateurCorpsMessage
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
              corps: adaptateurCorpsMessage
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
          ])
        )
        .then(() => Promise.resolve())
    );
  }
}
