import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { DemandeAide } from './DemandeAide';
import {
  EntrepotUtilisateursMAC,
  uneRechercheUtilisateursMAC,
  UtilisateurMACDTO,
} from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { Departement } from '../departements';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { adaptateursCorpsMessage } from './adaptateursCorpsMessage';
import {
  ErreurUtilisateurMACInconnu,
  SagaDemandeAide,
} from './CapteurSagaDemandeAide';

export const envoieConfirmationDemandeAide = async (
  adaptateurEnvoiMail: AdaptateurEnvoiMail,
  aide: DemandeAide,
  relationUtilisateur: UtilisateurMACDTO | undefined
) => {
  await adaptateurEnvoiMail.envoieConfirmationDemandeAide(
    aide.email,
    relationUtilisateur
      ? {
          nomPrenom: relationUtilisateur.nomUsage,
          email: relationUtilisateur.email,
        }
      : undefined
  );
};

export const envoieRecapitulatifDemandeAide = async (
  adaptateurEnvoiMail: AdaptateurEnvoiMail,
  aide: DemandeAide,
  relationUtilisateur: string | undefined,
  annuaireCOT: {
    rechercheEmailParDepartement: (departement: Departement) => string;
  }
) => {
  await adaptateurEnvoiMail.envoie({
    objet: "Demande d'aide pour MonAideCyber",
    destinataire: {
      email: annuaireCOT.rechercheEmailParDepartement(aide.departement),
    },
    copie: adaptateurEnvironnement.messagerie().copieMAC(),
    corps: adaptateursCorpsMessage
      .demande()
      .recapitulatifDemandeAide()
      .genereCorpsMessage(aide, relationUtilisateur),
  });
};

export const rechercheUtilisateurMAC = async (
  saga: SagaDemandeAide,
  entrepotUtilisateurMAC: EntrepotUtilisateursMAC
) => {
  let utilisateurMAC: UtilisateurMACDTO | undefined = undefined;
  if (saga.relationUtilisateur) {
    utilisateurMAC = await uneRechercheUtilisateursMAC(
      entrepotUtilisateurMAC
    ).rechercheParMail(saga.relationUtilisateur);
    if (!utilisateurMAC) {
      throw new ErreurUtilisateurMACInconnu(
        'L’adresse email de l’Aidant ou du prestataire n’est pas référencée. Veuillez entrer une adresse valide et réessayer.'
      );
    }
  }
  if (saga.identifiantAidant) {
    utilisateurMAC = await uneRechercheUtilisateursMAC(
      entrepotUtilisateurMAC
    ).rechercheParIdentifiant(saga.identifiantAidant);
    if (!utilisateurMAC) {
      throw new ErreurUtilisateurMACInconnu(
        'L’Aidant fourni n’est pas référencé.'
      );
    }
  }
  return utilisateurMAC;
};
