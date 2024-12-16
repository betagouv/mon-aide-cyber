import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import crypto from 'crypto';
import { EntrepotEvenementJournal, Publication } from './Publication';
import { DiagnosticLance } from '../diagnostic/CapteurCommandeLanceDiagnostic';
import { ServiceAidant } from '../espace-aidant/ServiceAidant';
import { estSiretGendarmerie } from '../espace-aidant/Aidant';

const consommateurEvenement = () => (entrepot: EntrepotEvenementJournal) =>
  new (class implements ConsommateurEvenement {
    consomme<E extends Evenement<unknown>>(evenement: E): Promise<void> {
      return entrepot.persiste(genereEvenement(evenement));
    }
  })();

export const restitutionLancee = consommateurEvenement();

const consommateurDiagnosticLance =
  () => (entrepot: EntrepotEvenementJournal, serviceAidant: ServiceAidant) =>
    new (class implements ConsommateurEvenement {
      consomme<E extends Evenement<unknown>>(evenement: E): Promise<void> {
        const { corps } = evenement as DiagnosticLance;
        return serviceAidant
          .parIdentifiant(corps.identifiantAidant)
          .then((aidant) => {
            return entrepot.persiste(
              genereEvenement({
                ...evenement,
                corps: {
                  ...corps,
                  profil: estSiretGendarmerie(aidant?.siret)
                    ? 'Gendarme'
                    : 'Aidant',
                },
              })
            );
          });
      }
    })();
export const diagnosticLance = consommateurDiagnosticLance();

export const reponseAjoutee = consommateurEvenement();

export const aidantCree = consommateurEvenement();

export const aideCree = consommateurEvenement();

export const aideViaSollicitationAidantCree = consommateurEvenement();

export const demandeDevenirAidantCree = consommateurEvenement();

export const mailCreationCompteAidantEnvoye = consommateurEvenement();

export const mailCreationCompteAidantNonEnvoye = consommateurEvenement();

export const demandeDevenirAidantespaceAidantCree = consommateurEvenement();

export const preferencesAidantModifiees = consommateurEvenement();

export const profilAidantModifie = consommateurEvenement();

export const reinitialisationMotDePasseDemandee = consommateurEvenement();

export const reinitialisationMotDePasseFaite = consommateurEvenement();

export const reinitialisationMotDePasseErronee = consommateurEvenement();

export const diagnosticLibreAccesLance = consommateurEvenement();

const genereEvenement = <E extends Evenement<unknown>>(
  evenement: E
): Publication => {
  return {
    date: evenement.date,
    donnees: evenement.corps as object,
    identifiant: crypto.randomUUID(),
    type: evenement.type,
  };
};
