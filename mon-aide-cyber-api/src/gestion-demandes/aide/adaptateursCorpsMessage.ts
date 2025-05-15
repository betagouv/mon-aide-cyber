import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { DemandeAide } from './DemandeAide';
import { Aidant } from '../../espace-aidant/Aidant';
import { DonneesMiseEnRelation } from './miseEnRelation';

export type MessagesDemande = {
  recapitulatifDemandeAide: () => {
    genereCorpsMessage: (aide: DemandeAide, aidants: Aidant[]) => string;
  };
  aucunAidantPourLaDemandeAide: () => {
    genereCorpsMessage: (
      donneesMiseEnRelation: DonneesMiseEnRelation
    ) => string;
  };
  recapitulatifDemandeAideDirecteAidant: () => {
    genereCorpsMessage: (
      donneesMiseEnRelation: DonneesMiseEnRelation,
      relationUtilisateur: string
    ) => string;
  };
};

export type AdaptateurCorpsDeMessageAide = {
  demande: () => MessagesDemande;
};

const genereCorpsRecapitulatifDemandeAide = (
  aide: DemandeAide,
  aidants: Aidant[]
) => {
  const formateDate = FournisseurHorloge.formateDate(
    FournisseurHorloge.maintenant()
  );
  const raisonSociale = aide.raisonSociale
    ? `- Raison sociale: ${aide.raisonSociale}\n`
    : '';
  const aidantsQuiMatchent = aidants.map((a) => `- ${a.email}`);
  return (
    'Bonjour,\n' +
    '\n' +
    `Une demande d’aide a été faite par ${aide.email}\n` +
    '\n' +
    'Ci-dessous, les informations concernant cette demande :\n' +
    `- Date de la demande : ${formateDate.date} à ${formateDate.heure}\n` +
    `- Département: ${aide.departement.nom}\n` +
    raisonSociale +
    '\n' +
    `Les Aidants disponibles : \n` +
    (aidantsQuiMatchent.length > 0 ? aidantsQuiMatchent.join('\n') : 'Aucun')
  );
};

const genereCorpsRecapitulatifDemandeAideDirecteAidant = (
  donneesMiseEnRelation: DonneesMiseEnRelation,
  relationUtilisateur: string
) => {
  const aide = donneesMiseEnRelation.demandeAide;
  const formateDate = FournisseurHorloge.formateDate(
    FournisseurHorloge.maintenant()
  );
  const raisonSociale = aide.raisonSociale
    ? `- Raison sociale: ${aide.raisonSociale}\n`
    : '';
  return (
    'Bonjour,\n' +
    '\n' +
    `Une demande d’aide a été faite par ${aide.email}\n` +
    '\n' +
    'Ci-dessous, les informations concernant cette demande :\n' +
    `- Est déjà en relation avec un Aidant : ${relationUtilisateur}\n` +
    `- Date de la demande : ${formateDate.date} à ${formateDate.heure}\n` +
    `- Département: ${aide.departement.nom}\n` +
    `- SIRET : ${donneesMiseEnRelation.siret}\n` +
    `- Type entité : ${donneesMiseEnRelation.typeEntite.nom}\n` +
    `- Secteurs d’activité : ${donneesMiseEnRelation.secteursActivite.map((s) => s.nom).join(', ')}\n` +
    raisonSociale
  );
};

const genereCorpsAucunAidantPourLaDemandeAide = (
  donneesMiseEnRelation: DonneesMiseEnRelation
) => {
  const formateDate = FournisseurHorloge.formateDate(
    FournisseurHorloge.maintenant()
  );
  const raisonSociale = donneesMiseEnRelation.demandeAide.raisonSociale
    ? `- Raison sociale: ${donneesMiseEnRelation.demandeAide.raisonSociale}\n`
    : '';
  return (
    'Bonjour,\n' +
    '\n' +
    `Une demande d’aide a été faite par ${donneesMiseEnRelation.demandeAide.email}\n` +
    `Aucun Aidant ne répond aux critères de l’entité.\n` +
    '\n' +
    'Ci-dessous, les informations concernant cette demande :\n' +
    `- Date de la demande : ${formateDate.date} à ${formateDate.heure}\n` +
    `- Département : ${donneesMiseEnRelation.demandeAide.departement.nom}\n` +
    raisonSociale +
    `- SIRET : ${donneesMiseEnRelation.siret}\n` +
    `- Type entité : ${donneesMiseEnRelation.typeEntite.nom}\n` +
    `- Secteurs d’activité : ${donneesMiseEnRelation.secteursActivite.map((s) => s.nom).join(', ')}\n` +
    '\n'
  );
};
const adaptateursCorpsMessage: AdaptateurCorpsDeMessageAide = {
  demande: (): MessagesDemande => ({
    recapitulatifDemandeAide: () => ({
      genereCorpsMessage: (aide, aidants): string =>
        genereCorpsRecapitulatifDemandeAide(aide, aidants),
    }),
    aucunAidantPourLaDemandeAide: () => ({
      genereCorpsMessage: (aide): string =>
        genereCorpsAucunAidantPourLaDemandeAide(aide),
    }),
    recapitulatifDemandeAideDirecteAidant: () => ({
      genereCorpsMessage: (
        donneesMiseEnRelation,
        relationUtilisateur
      ): string =>
        genereCorpsRecapitulatifDemandeAideDirecteAidant(
          donneesMiseEnRelation,
          relationUtilisateur
        ),
    }),
  }),
};

export { adaptateursCorpsMessage };
