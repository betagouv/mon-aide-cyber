import { DemandeDevenirAidant } from './DemandeDevenirAidant';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

const genereCorpsMiseAJourDemandeDevenirAidant = (
  demandeDevenirAidant: DemandeDevenirAidant
) => {
  const dateDemande = FournisseurHorloge.formateDate(demandeDevenirAidant.date);
  let appartenanceEntite = '';
  if (demandeDevenirAidant.entite?.nom) {
    appartenanceEntite = `<li>Vous appartenez ou adhérez à l’entité ${demandeDevenirAidant.entite?.nom}</li>`;
  }
  return (
    '<html lang="fr">' +
    '<body>' +
    `Bonjour ${demandeDevenirAidant.prenom},\n` +
    '\n' +
    `<b>Votre demande pour participer à un atelier Devenir Aidant cyber sur le territoire ${demandeDevenirAidant.departement.nom} a été mise à jour.</b>\n` +
    '\n' +
    'Vous nous avez fourni plusieurs informations : \n' +
    '<ul>' +
    '<li>Vous souhaitez utiliser le dispositif MonAideCyber pour être Aidant cyber et être référencé</li>' +
    `<li>Vous avez accepté les nouvelles conditions générales d’utilisation et la charte en ligne le ${dateDemande.date} à ${dateDemande.heure}</li>` +
    `${appartenanceEntite}` +
    '</ul>' +
    '\n' +
    'Des ateliers "Devenir Aidant cyber" ont lieu régulièrement. Votre délégation territoriale ANSSI, en copie de ce ' +
    'mail, vous informera sur le mail que vous nous avez communiqué des prochaines dates prévues d’ateliers.\n' +
    '\n' +
    'Merci de nous informer dès que possible en cas d’indisponibilité à une date d’atelier proposée.\n' +
    '\n' +
    '\n' +
    '<b>Utiliser dès maintenant l’outil de diagnostic en vous connecter avec ProConnect</b>' +
    '\n' +
    `<a href="${adaptateurEnvironnement.mac().urlMAC()}/connexion">J’initie un diagnostic</a>` +
    '\n' +
    '\n' +
    '\n' +
    '<b>Comment bien préparer mon atelier Devenir Aidant cyber ?</b>\n' +
    '<ul>' +
    `<li>En savoir plus sur le fonctionnement de MonAideCyber avec <a href="${adaptateurEnvironnement.mac().urlMAC()}/promouvoir-diagnostic-cyber">la plaquette d’information</a></li>` +
    `<li>Relire <a href="${adaptateurEnvironnement.mac().urlMAC()}/charte-aidant">la charte de l'Aidant</a> rappelant les principes et les engagements des Aidants Cyber</li>` +
    '</ul>' +
    'Toute l’équipe reste à votre disposition,\n' +
    '\n' +
    'Pour toute remarque ou question, n’hésitez pas à nous contacter sur contact@monaidecyber.beta.gouv.fr\n' +
    '\n' +
    '<b>L’équipe MonAideCyber</b>' +
    '\n' +
    '\n' +
    'Ce mail est généré automatiquement, veuillez ne pas répondre.' +
    '</body>' +
    '</html>'
  );
};

const adaptateurCorpsMessage = {
  miseAJourDemandeDevenirAidant: () => ({
    genereCorpsMessage: (demandeDevenirAidant: DemandeDevenirAidant) =>
      genereCorpsMiseAJourDemandeDevenirAidant(demandeDevenirAidant),
  }),
};

export { adaptateurCorpsMessage };
