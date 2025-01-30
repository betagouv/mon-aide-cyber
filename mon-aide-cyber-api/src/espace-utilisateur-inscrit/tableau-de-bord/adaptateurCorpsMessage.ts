import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';

const genereCorpsConfirmation = (nomPrenom: string): string =>
  '<html lang="fr">' +
  '<body>' +
  `Bonjour ${nomPrenom}\n` +
  '\n' +
  'Nous sommes ravis de vous compter parmi nos utilisateurs ! Vous pouvez dès à ' +
  'présent accéder à la plateforme MonAideCyber et commencer à réaliser librement ' +
  'vos premiers diagnostics. \n' +
  '\n' +
  `<a href="${adaptateurEnvironnement.mac().urlMAC()}/connexion">J’initie un diagnostic MonAideCyber</a>\n` +
  '\n' +
  'Quelques idées pour vous aider à trouver des entités à diagnostiquer :\n' +
  '<ol>' +
  '<li>Annoncez la nouvelle aux membres de votre réseau professionnel et proposez-leur ' +
  `la réalisation d’un diagnostic. Notre <a href="${adaptateurEnvironnement.mac().urlMAC()}/a-propos/kit-de-communication">kit de communication</a> est disponible sur ` +
  'notre site pour vous aider.</li>' +
  `<li>Rapprochez-vous de l’équipe <a href="mailto:${adaptateurEnvironnement.messagerie().emailMAC()}">MonAideCybe</a>r si vous avez des opportunités ou ` +
  'des idées pour promouvoir le dispositif auprès de votre écosystème local ' +
  '(ex : associations professionnelles, pépinière d’entreprises, etc.).</li>' +
  '</ol>' +
  '\n' +
  '\n' +
  '<b>Et si je souhaite être référencé en tant qu’Aidant cyber ?</b>\n' +
  '\n' +
  '\n' +
  'À tout moment, il vous est possible de nous indiquer que vous souhaitez devenir ' +
  'Aidant cyber pour être référencé sur l’annuaire et être mis en relation avec des ' +
  'entités sollicitant une aide directement via la plateforme.\n' +
  '\n' +
  '\n' +
  'Pour être référencé Aidant cyber les prérequis sont de :\n' +
  '<ul>' +
  '<li>Représenter ou faire partie au titre de son activité professionnelle ou associative ' +
  'd’un service de l’État, d’une administration, d’une réserve citoyenne ou d’une ' +
  'entité morale à but non lucratif</li>' +
  '<li>Être dans une démarche non lucrative tout au long du dispositif</li>' +
  '<li>Participer à un atelier Devenir Aidant MonAideCyber dispensé par l’ANSSI</li>' +
  `<li>Accepter la <a href="${adaptateurEnvironnement.mac().urlMAC()}/charte-aidant">Charte de l’Aidant MonAideCyber</a></li>` +
  '</ul>' +
  '\n' +
  `Contactez l’équipe à l’adresse mail <a href="mailto:${adaptateurEnvironnement.messagerie().emailMAC()}">monaidecyber@ssi.gouv.fr</a> si vous souhaitez ` +
  'proposer une association dont vous êtes actuellement membre ou que vous connaissez, ' +
  'ou bien recevoir une liste d’associations déjà identifiées par l’équipe.\n' +
  '\n' +
  `N'hésitez pas à consulter notre <a href="https://aide.monaide.cyber.gouv.fr/fr/">FAQ</a> \n` +
  '\n' +
  'Toute l’équipe reste à votre disposition,\n' +
  '\n' +
  'Pour toute remarque ou question, n’hésitez pas à nous contacter sur monaidecyber@ssi.gouv.fr\n' +
  '\n' +
  "<b>L'équipe MonAideCyber</b>" +
  '</body>' +
  '</html>';

const adaptateurCorpsMessage = {
  confirmationUtilisateurInscritCree: () => ({
    genereCorpsMessage: (nomPrenom: string): string =>
      genereCorpsConfirmation(nomPrenom),
  }),
};
export { adaptateurCorpsMessage };
