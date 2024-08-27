import { DemandeDevenirAidant } from './DemandeDevenirAidant';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';

export const genereCorpsMessage = (
  demandeDevenirAidant: DemandeDevenirAidant
) => {
  return (
    '<html lang="fr">' +
    '<body>' +
    `Bonjour ${demandeDevenirAidant.prenom},\n` +
    '\n' +
    `<b>Votre demande pour participer à une formation Aidant sur le département ${demandeDevenirAidant.departement.nom} a été envoyée.</b>\n` +
    '\n' +
    'Votre délégation régionale ANSSI, en copie de ce mail, vérifie les prochaines dates de formation prévues.\n' +
    '\n' +
    'Elle vous recontactera dans les plus brefs délais, sur le mail que vous nous avez communiqué, avec une ou plusieurs dates disponibles.\n' +
    '\n' +
    '<b>Comment bien préparer ma formation Aidant ?</b>\n' +
    '\n' +
    `\t - En savoir plus sur le fonctionnement de MonAideCyber avec <a href="${adaptateurEnvironnement.mac().urlMAC()}/a-propos/kit-de-communication">la plaquette informative</a>\n` +
    `\t - Consulter <a href="${adaptateurEnvironnement.mac().urlMAC()}/charte-aidant">la charte Aidant</a> qui rappelle le principe de gratuité du dispositif à signer avant, pendant ou après la formation\n` +
    '\t - Noter qu’aucun autre pré-requis n’est demandé pour participer à cette formation\n' +
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

const adaptateurCorpsMessage = {
  demandeDevenirAidant: () => ({
    genereCorpsMessage: (demandeDevenirAidant: DemandeDevenirAidant) =>
      genereCorpsMessage(demandeDevenirAidant),
  }),
};

export { adaptateurCorpsMessage };
