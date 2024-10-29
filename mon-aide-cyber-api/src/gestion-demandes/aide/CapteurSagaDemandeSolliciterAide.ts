import { BusCommande, CapteurSaga, Saga } from '../../domaine/commande';
import { Entrepots } from '../../domaine/Entrepots';
import { CommandeCreerAide } from '../../aide/CapteurCommandeCreerAide';
import crypto from 'crypto';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { adaptateurCorpsMessage } from './adaptateurCorpsMessage';

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
    private readonly entrepots: Entrepots,
    private readonly busCommande: BusCommande,
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail
  ) {}

  execute(saga: SagaDemandeSolliciterAide): Promise<void> {
    const commande: CommandeCreerAide = {
      type: 'CommandeCreerAide',
      departement: saga.departement,
      email: saga.email,
      ...(saga.raisonSociale && { raisonSociale: saga.raisonSociale }),
    };
    return this.busCommande.publie<CommandeCreerAide, void>(commande).then(() =>
      this.entrepots
        .aidants()
        .lis(saga.identifiantAidant)
        .then((aidant) =>
          this.adaptateurEnvoiMail.envoie(
            {
              corps: adaptateurCorpsMessage
                .notificationAidantSollicitation()
                .genereCorpsMessage({
                  departement: saga.departement,
                  mailEntite: saga.email,
                  nomPrenom: aidant.nomPrenom,
                  ...(saga.raisonSociale && {
                    raisonSocialeEntite: saga.raisonSociale,
                  }),
                }),
              destinataire: { email: aidant.identifiantConnexion },
              objet:
                'MonAideCyber - Une entité vous sollicite depuis l’annuaire des Aidants cyber.',
            },
            'INFO'
          )
        )
    );
  }
}
