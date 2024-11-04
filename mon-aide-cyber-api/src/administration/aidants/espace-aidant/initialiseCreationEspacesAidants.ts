import { BusEvenement } from '../../../domaine/BusEvenement';
import crypto from 'crypto';
import { CapteurCommandeEnvoiMailCreationCompteAidant } from '../../../gestion-demandes/devenir-aidant/CapteurCommandeEnvoiMailCreationCompteAidant';
import { fabriqueAdaptateurEnvoiMail } from '../../../infrastructure/adaptateurs/fabriqueAdaptateurEnvoiMail';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { Entrepots } from '../../../domaine/Entrepots';
import { ConstructeursImportAidant } from './constructeursImportAidant';
import { DemandeDevenirAidant } from '../../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { CapteurCommandeDevenirAidant } from '../../../gestion-demandes/devenir-aidant/CapteurCommandeDevenirAidant';
import { fabriqueAnnuaireCOT } from '../../../infrastructure/adaptateurs/fabriqueAnnuaireCOT';
import { mappeurDROMCOM, mappeurRegionsCSV } from './mappeurRegions';
import { Departement } from '../../../gestion-demandes/departements';
import { unServiceAidant } from '../../../espace-aidant/ServiceAidantMAC';

export type StatusImportation =
  | 'email-creation-espace-aidant-envoyé'
  | 'demande-en-attente'
  | 'demande-devenir-aidant-envoyee'
  | 'en-erreur';

export type TraitementCreationEspaceAidant = {
  email: string;
  nomPrenom: string;
  region: string;
  status: StatusImportation;
  telephone: string;
  charte: Statut;
  formation: Statut;
  todo: string;
  qui: string;
  compteCree: string;
  commentaires: string;
  lieuDeFormation: string;
};

export type ResultatCreationEspacesAidants = {
  demandesDevenirAidant: TraitementCreationEspaceAidant[];
  mailsCreationEspaceAidantEnvoyes: TraitementCreationEspaceAidant[];
  mailsCreationEspaceAidantEnAttente: TraitementCreationEspaceAidant[];
  erreurs: TraitementCreationEspaceAidant[];
};
export const EN_TETES_FICHIER_CSV = [
  'Région',
  'nom',
  'formation',
  'charte',
  'mail',
  'telephone',
  'TO DO',
  'qui',
  'Compte Créé ?',
  'commentaires',
  'lieu de formation',
];

const recupereListeAidants = (aidants: string) => {
  const tableauAidants = aidants.split('\n');
  const entetes = tableauAidants[0].split(';');

  const entetesPresentes = EN_TETES_FICHIER_CSV.every(
    (valeur, index) => valeur === entetes[index]
  );
  if (!entetesPresentes || entetes.length < 11) {
    throw new Error(
      `Le fichier doit contenir les colones suivantes '${EN_TETES_FICHIER_CSV.join(';')}'.`
    );
  }

  if (tableauAidants[tableauAidants.length - 1].trim() === '') {
    return tableauAidants.slice(1, -1);
  }

  return tableauAidants.slice(1);
};

export type Statut = 'OK' | 'NOK';
export type AidantCSV = {
  identifiantConnexion: string;
  nomPrenom: string;
  numeroTelephone: string;
  region: string;
  charte: Statut;
  formation: Statut;
  todo: string;
  qui: string;
  compteCree: string;
  commentaires: string;
  lieuDeFormation: string;
};

const charteSigneeEtFormationFaite = (aidantCSV: AidantCSV) =>
  aidantCSV.formation === 'OK' && aidantCSV.charte === 'OK';

export const initialiseCreationEspacesAidants = async (
  entrepots: Entrepots,
  busEvenement: BusEvenement,
  aidants: string
): Promise<ResultatCreationEspacesAidants> => {
  const resultat: ResultatCreationEspacesAidants = {
    demandesDevenirAidant: [],
    mailsCreationEspaceAidantEnvoyes: [],
    mailsCreationEspaceAidantEnAttente: [],
    erreurs: [],
  };

  const transcris = (aidant: string[]): AidantCSV | undefined => {
    const identifiant = aidant[4];
    if (!identifiant) {
      return undefined;
    }
    return {
      identifiantConnexion: identifiant.toLowerCase().trim(),
      nomPrenom: aidant[1].trim(),
      numeroTelephone: aidant[5],
      region: aidant[0],
      charte: aidant[3] as Statut,
      formation: aidant[2] as Statut,
      todo: aidant[6],
      qui: aidant[7],
      compteCree: aidant[8],
      commentaires: aidant[9],
      lieuDeFormation: aidant[10],
    };
  };

  const executeLaCommandeEnvoiMailCreationEspaceAidant = async (
    demandeEnCours: DemandeDevenirAidant
  ) =>
    await new CapteurCommandeEnvoiMailCreationCompteAidant(
      entrepots,
      busEvenement,
      fabriqueAdaptateurEnvoiMail(),
      adaptateurServiceChiffrement()
    ).execute({
      mail: demandeEnCours.mail,
      type: 'CommandeEnvoiMailCreationCompteAidant',
    });

  const traiteLaDemandeAidantEnCours = async (
    aidantCSV: AidantCSV,
    demandeEnCours: DemandeDevenirAidant
  ) => {
    if (charteSigneeEtFormationFaite(aidantCSV)) {
      const demandeCreationEspaceAidantTransmise =
        await executeLaCommandeEnvoiMailCreationEspaceAidant(demandeEnCours);
      if (demandeCreationEspaceAidantTransmise) {
        return ConstructeursImportAidant.mailCreationEspaceAidantEnvoye(
          aidantCSV
        ).construis();
      }
    }
    return ConstructeursImportAidant.demandeEnAttenteDeValidation(
      aidantCSV
    ).construis();
  };

  const executeLaCommandeDemandeDevenirAidant = async (
    aidantCSV: AidantCSV
  ): Promise<DemandeDevenirAidant> => {
    const nomPrenom = aidantCSV.nomPrenom.split(' ');

    const mapDepartement = (): Departement => {
      const paris: Departement = {
        nom: 'Paris',
        code: '75',
        codeRegion: '11',
      };
      if (aidantCSV.region.trim() === 'DROM COM') {
        return mappeurDROMCOM.get(aidantCSV.lieuDeFormation) || paris;
      }
      return mappeurRegionsCSV.get(aidantCSV.region) || paris;
    };

    const departement = mapDepartement();
    return await new CapteurCommandeDevenirAidant(
      entrepots,
      busEvenement,
      fabriqueAdaptateurEnvoiMail(),
      fabriqueAnnuaireCOT().annuaireCOT,
      unServiceAidant(entrepots.aidants())
    ).execute({
      type: 'CommandeDevenirAidant',
      departement,
      mail: aidantCSV.identifiantConnexion,
      prenom: nomPrenom.at(0)!.trim(),
      nom: nomPrenom.slice(1).join(' ').trim(),
    });
  };

  const creeLaDemandeDevenirAidant = async (aidantCSV: AidantCSV) => {
    await executeLaCommandeDemandeDevenirAidant(aidantCSV);
    return ConstructeursImportAidant.demandeDevenirAidantCree(
      aidantCSV
    ).construis();
  };

  const initieUnParcoursDevenirAidantComplet = async (aidantCSV: AidantCSV) => {
    const demandeDevenirAidant =
      await executeLaCommandeDemandeDevenirAidant(aidantCSV);
    await executeLaCommandeEnvoiMailCreationEspaceAidant(demandeDevenirAidant);
    return ConstructeursImportAidant.parcoursDevenirAidantComplet(
      aidantCSV
    ).construis();
  };

  const traitements: Promise<(TraitementCreationEspaceAidant | undefined)[]> =
    Promise.all(
      recupereListeAidants(aidants).map(async (aidantCourant) => {
        const aidantCSV = transcris(aidantCourant.split(';'));
        if (aidantCSV) {
          try {
            const demandeEnCours = await entrepots
              .demandesDevenirAidant()
              .rechercheDemandeEnCoursParMail(aidantCSV.identifiantConnexion);
            if (demandeEnCours) {
              return await traiteLaDemandeAidantEnCours(
                aidantCSV,
                demandeEnCours
              );
            }
            if (!charteSigneeEtFormationFaite(aidantCSV)) {
              return await creeLaDemandeDevenirAidant(aidantCSV);
            }
            return await initieUnParcoursDevenirAidantComplet(aidantCSV);
          } catch (erreur: unknown | Error) {
            return ConstructeursImportAidant.enErreur(
              erreur as Error,
              aidantCSV
            ).construis();
          }
        }
        return undefined;
      })
    );
  return traitements.then((aidants) => {
    aidants
      .filter((aidant): aidant is TraitementCreationEspaceAidant => !!aidant)
      .forEach((aidant) => {
        mappeurResultat.get(aidant.status)?.(resultat, aidant);
      });

    return resultat;
  });
};
const mappeurResultat: Map<
  StatusImportation,
  (
    resultat: ResultatCreationEspacesAidants,
    importAidant: TraitementCreationEspaceAidant
  ) => void
> = new Map([
  [
    'email-creation-espace-aidant-envoyé',
    (resultat, importAidant) =>
      resultat.mailsCreationEspaceAidantEnvoyes.push(importAidant),
  ],
  [
    'demande-en-attente',
    (resultat, importAidant) =>
      resultat.mailsCreationEspaceAidantEnAttente.push(importAidant),
  ],
  [
    'demande-devenir-aidant-envoyee',
    (resultat, importAidant) =>
      resultat.demandesDevenirAidant.push(importAidant),
  ],
  [
    'en-erreur',
    (resultat, importAidant) => resultat.erreurs.push(importAidant),
  ],
]);
export const genereMotDePasse = () => {
  const expressionReguliere = /^[a-hj-km-np-zA-HJ-KM-NP-Z1-9/]*$/;

  const chaineAleatoire = () => {
    const valeurAleatoire = String.fromCharCode(
      crypto.webcrypto.getRandomValues(new Uint8Array(1))[0]
    );
    if (expressionReguliere.test(valeurAleatoire)) {
      return valeurAleatoire;
    }
    return undefined;
  };

  return new Array(21)
    .fill('')
    .map(() => {
      let caractereAleatoire = undefined;
      while (caractereAleatoire === undefined) {
        caractereAleatoire = chaineAleatoire();
      }
      return caractereAleatoire;
    })
    .join('');
};
