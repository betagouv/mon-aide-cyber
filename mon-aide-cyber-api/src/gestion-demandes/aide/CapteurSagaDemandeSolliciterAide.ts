import {
  BusCommande,
  CapteurCommande,
  CapteurSaga,
  Commande,
  Saga,
} from '../../domaine/commande';
import { CommandeCreerAide } from '../../aide/CapteurCommandeCreerAide';
import crypto from 'crypto';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { adaptateurCorpsMessage } from './adaptateurCorpsMessage';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { Departement, rechercheParNomDepartement } from '../departements';
import { Aide } from '../../aide/Aide';
import { ServiceAidant } from '../../espace-aidant/ServiceAidant';
import { Entrepots } from '../../domaine/Entrepots';
import { Adaptateur } from '../../adaptateurs/Adaptateur';
import { Referentiel } from '../../diagnostic/Referentiel';
import { ReferentielDeMesures } from '../../diagnostic/ReferentielDeMesures';
import {
  ajouteLaReponseAuDiagnostic,
  initialiseDiagnostic,
} from '../../diagnostic/Diagnostic';

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

type CommandeInitieDiagnosticAide = Commande & {
  type: 'CommandeInitieDiagnosticAide';
  departement: Departement;
  identifiantAide: crypto.UUID;
};

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
      .then((aide: Aide) => {
        return this.busCommande
          .publie<CommandeInitieDiagnosticAide, crypto.UUID>({
            type: 'CommandeInitieDiagnosticAide',
            departement: rechercheParNomDepartement(aide.departement),
            identifiantAide: aide.identifiant,
          })
          .then(() =>
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
                  this.adaptateurEnvoiMail.envoie(
                    {
                      corps: adaptateurCorpsMessage
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
          });
      });
  }
}

export class CapteurCommandeInitieDiagnosticAide
  implements CapteurCommande<CommandeInitieDiagnosticAide, crypto.UUID>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly diagnostic: Adaptateur<Referentiel>,
    private readonly mesures: Adaptateur<ReferentielDeMesures>,
    private readonly _questionDepartementEntite = 'contexte-departement-tom-siege-social'
  ) {}

  execute(commande: CommandeInitieDiagnosticAide): Promise<crypto.UUID> {
    return Promise.all([this.diagnostic.lis(), this.mesures.lis()]).then(
      async ([referentiel, mesures]) => {
        const diagnostic = initialiseDiagnostic(referentiel, mesures);
        const reponse = diagnostic.referentiel['contexte'].questions
          .find((q) => q.identifiant === this._questionDepartementEntite)
          ?.reponsesPossibles.find(
            (q) => q.libelle === commande.departement.nom
          );
        ajouteLaReponseAuDiagnostic(diagnostic, {
          identifiant: this._questionDepartementEntite,
          reponse: reponse!.identifiant,
          chemin: 'contexte',
        });
        return this.entrepots
          .diagnostic()
          .persiste(diagnostic)
          .then(() => diagnostic.identifiant);
      }
    );
  }
}
