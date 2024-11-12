import { DemandeDevenirAidant } from './DemandeDevenirAidant';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';

const genereCorpsDemandeDevenirAidant = (
  demandeDevenirAidant: DemandeDevenirAidant
) => {
  return (
    '<html lang="fr">' +
    '<body>' +
    `Bonjour ${demandeDevenirAidant.prenom},\n` +
    '\n' +
    `<b>Votre demande pour participer à un atelier Aidant MonAideCyber sur le département ${demandeDevenirAidant.departement.nom} a été envoyée.</b>\n` +
    '\n' +
    'Votre délégation régionale ANSSI, en copie de ce mail, vérifie les dates des prochains ateliers prévus.\n' +
    '\n' +
    'Elle vous recontactera dans les plus brefs délais, sur le mail que vous nous avez communiqué, avec une ou plusieurs dates disponibles.\n' +
    '\n' +
    '<b>Comment bien préparer mon atelier Devenir Aidant ?</b>\n' +
    '\n' +
    `\t - En savoir plus sur le fonctionnement de MonAideCyber avec <a href="${adaptateurEnvironnement.mac().urlMAC()}/a-propos/kit-de-communication">la plaquette informative</a>\n` +
    `\t - Consulter <a href="${adaptateurEnvironnement.mac().urlMAC()}/charte-aidant">la charte Aidant</a> qui rappelle le principe de gratuité du dispositif à signer avant, pendant ou après l'atelier\n` +
    '\t - Noter qu’aucun autre pré-requis n’est demandé pour participer à cet atelier\n' +
    '\n' +
    'Toute l’équipe reste à votre disposition,\n' +
    '\n' +
    'Pour toute remarque ou question, n’hésitez pas à nous contacter sur monaidecyber@ssi.gouv.fr\n' +
    '\n' +
    '<b>L’équipe MonAideCyber</b>' +
    '</body>' +
    '</html>'
  );
};

const genereCorpsFinalisationDemandeDevenirAidant = (
  nomPrenom: string,
  url: string
) => {
  return (
    `Bonjour ${nomPrenom} \n` +
    '\n' +
    'Vous êtes invité à vous créer un espace Aidant sur MonAideCyber en suivant ce lien sécurisé : \n' +
    '\n' +
    `<a href="${url}" target="_blank">${url}</a> \n` +
    '\n' +
    'Ce lien vous permettra de créer votre accès en définissant vous-même votre mot de passe pour accéder à votre espace Aidant.\n' +
    '\n' +
    'Toute l’équipe reste à votre disposition,\n' +
    '\n' +
    'Pour toute remarque ou question, n’hésitez pas à nous contacter sur monaidecyber@ssi.gouv.fr\n' +
    '\n' +
    "<b>L'équipe MonAideCyber</b>"
  );
};

const adaptateurCorpsMessage = {
  finaliseDemandeDevenirAidant: () => ({
    genereCorpsMessage: (nomPrenom: string, url: string) =>
      genereCorpsFinalisationDemandeDevenirAidant(nomPrenom, url),
  }),
  demandeDevenirAidant: () => ({
    genereCorpsMessage: (demandeDevenirAidant: DemandeDevenirAidant) =>
      genereCorpsDemandeDevenirAidant(demandeDevenirAidant),
  }),
};

export { adaptateurCorpsMessage };
