import { Aidant } from './Aidant';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { adaptateurEnvironnement } from '../adaptateurs/adaptateurEnvironnement';

function genereCorpsConfirmationProfilAidantSansAssociation(aidant: Aidant) {
  return (
    '<html lang="fr">' +
    '<body>' +
    `Bonjour ${aidant.nomPrenom}\n` +
    '\n' +
    `Suite à votre dernière connexion, vous avez choisi d’utiliser le dispositif MonAideCyber en tant qu'Aidant cyber et nous vous en remercions.` +
    `Vous avez accepté les nouvelles conditions générales d’utilisation en ligne le ${aidant.dateSignatureCGU ? FournisseurHorloge.formateDate(aidant.dateSignatureCGU).date : ''}. \n` +
    'Nous avons bien reçu votre souhait d’adhérer à une association à but non lucratif et d’utiliser le dispositif en étant référencé Aidant cyber. \n' +
    `Si vous êtes membre d’une association non politique ou cultuelle, faites nous parvenir à l’adresse <a href="mailto:${adaptateurEnvironnement.messagerie().emailMAC()}">MonAideCyber</a> les informations suivantes :` +
    '\n' +
    '<ul>' +
    '<li>le nom</li>' +
    '<li>le département</li>' +
    '<li>une adresse mail de contact</li>' +
    '</ul>' +
    '\n' +
    `Sinon contactez l’équipe à l’adresse mail <a href="mailto:${adaptateurEnvironnement.messagerie().emailMAC()}">MonAideCyber</a> si vous souhaitez  recevoir une liste d’associations déjà identifiées par l’équipe.` +
    '\n' +
    '\n' +
    'Toute l’équipe reste à votre disposition,' +
    '\n' +
    '\n' +
    `Pour toute remarque ou question, n’hésitez pas à nous contacter sur <a href="mailto:${adaptateurEnvironnement.messagerie().emailMAC()}">MonAideCyber</a> \n` +
    '</body>' +
    '</html>'
  );
}

const adaptateurCorpsMessage = {
  confirmationProfilAidantSansAssociation: () => ({
    genereCorpsMessage: (aidant: Aidant): string =>
      genereCorpsConfirmationProfilAidantSansAssociation(aidant),
  }),
};
export { adaptateurCorpsMessage };
