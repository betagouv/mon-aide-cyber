import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { DemandeAide } from './DemandeAide';

export type MessagesDemande = {
  recapitulatifDemandeAide: () => {
    genereCorpsMessage: (
      aide: DemandeAide,
      relationUtilisateur: string | undefined
    ) => string;
  };
};

export type AdaptateurCorpsDeMessageAide = {
  demande: () => MessagesDemande;
};

const genereCorpsRecapitulatifDemandeAide = (
  aide: DemandeAide,
  relationUtilisateur: string | undefined
) => {
  const formateDate = FournisseurHorloge.formateDate(
    FournisseurHorloge.maintenant()
  );
  const raisonSociale = aide.raisonSociale
    ? `- Raison sociale: ${aide.raisonSociale}\n`
    : '';
  const miseEnRelation = relationUtilisateur
    ? '- Est déjà en relation avec un Aidant\n'
    : '';
  return (
    'Bonjour,\n' +
    '\n' +
    `Une demande d’aide a été faite par ${aide.email}\n` +
    '\n' +
    'Ci-dessous, les informations concernant cette demande :\n' +
    miseEnRelation +
    `- Date de la demande : ${formateDate.date} à ${formateDate.heure}\n` +
    `- Département: ${aide.departement.nom}\n` +
    raisonSociale
  );
};
const adaptateursCorpsMessage: AdaptateurCorpsDeMessageAide = {
  demande: (): MessagesDemande => ({
    recapitulatifDemandeAide: () => ({
      genereCorpsMessage: (aide, relationUtilisateur): string =>
        genereCorpsRecapitulatifDemandeAide(aide, relationUtilisateur),
    }),
  }),
};

export { adaptateursCorpsMessage };
