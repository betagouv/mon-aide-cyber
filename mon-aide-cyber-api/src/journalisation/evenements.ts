import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import crypto from 'crypto';
import { EntrepotEvenementJournal } from './Publication';
import { OpenFgaClient, TupleKey } from '@openfga/sdk';
import { DiagnosticLance } from '../diagnostic/CapteurCommandeLanceDiagnostic';

const consommateurEvenement = () => (entrepot: EntrepotEvenementJournal) =>
  new (class implements ConsommateurEvenement {
    consomme<E extends Evenement>(evenement: E): Promise<void> {
      return entrepot.persiste(genereEvenement(evenement));
    }
  })();

const consommateurEvenementDiagnosticLance =
  () => (entrepot: EntrepotEvenementJournal) =>
    new (class implements ConsommateurEvenement {
      consomme<E extends Evenement>(evenement: E): Promise<void> {
        if (
          process.env.MAC_MOTEUR_PERMISSIONS_URL &&
          process.env.MAC_MOTEUR_ENTREPOT_ID &&
          process.env.MAC_MOTEUR_PERMISSIONS_MODELES_ID
        ) {
          const fgaClient = new OpenFgaClient({
            apiUrl: process.env.MAC_MOTEUR_PERMISSIONS_URL!,
            storeId: process.env.MAC_MOTEUR_PERMISSIONS_ENTREPOT_ID!,
            authorizationModelId: process.env.MAC_MOTEUR_PERMISSIONS_MODELE_ID!,
          });
          const aidantId = (evenement as DiagnosticLance).corps
            .identifiantAidant;
          const diagnosticId = (evenement as DiagnosticLance).corps
            .identifiantDiagnostic;

          fgaClient
            .writeTuples([
              {
                user: `aidant:${aidantId}`,
                relation: 'createur',
                object: `diagnostic:${diagnosticId}`,
              } as TupleKey,
            ])
            .then(() => {
              console.log('ajout dans le store de permissions OK');
            })
            .catch((e) => {
              console.log('ajout dans le store de permissions KO');
              console.log(e);
            });
        }

        return entrepot.persiste(genereEvenement(evenement));
      }
    })();

export const restitutionLancee = consommateurEvenement();

export const diagnosticLance = consommateurEvenementDiagnosticLance();

export const reponseAjoutee = consommateurEvenement();

export const aidantCree = consommateurEvenement();

const genereEvenement = <E extends Evenement>(evenement: E) => {
  return {
    date: evenement.date,
    donnees: evenement.corps,
    identifiant: crypto.randomUUID(),
    type: evenement.type,
  };
};
