import { BusEvenement } from '../../../domaine/BusEvenement';
import { creeAidant } from '../../aidant/creeAidant';
import crypto from 'crypto';
import { CapteurCommandeEnvoiMailCreationCompteAidant } from '../../../gestion-demandes/devenir-aidant/CapteurCommandeEnvoiMailCreationCompteAidant';
import { fabriqueAdaptateurEnvoiMail } from '../../../infrastructure/adaptateurs/fabriqueAdaptateurEnvoiMail';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { Entrepots } from '../../../domaine/Entrepots';
import { ConstructeursImportAidant } from './constructeursImportAidant';
import { DemandeDevenirAidant } from '../../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';

export type StatusImportation =
  | 'importé'
  | 'existant'
  | 'email-envoyé'
  | 'demande-en-attente';

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
  messageAvecMDP: string;
};

export type ResultatCreationEspacesAidants = {
  aidantsImportes: TraitementCreationEspaceAidant[];
  aidantsExistants: TraitementCreationEspaceAidant[];
  mailsCreationEspaceAidantEnvoyes: TraitementCreationEspaceAidant[];
  mailsCreationEspaceAidantEnAttente: TraitementCreationEspaceAidant[];
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
  'message avec mot de passe',
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
  messageAvecMDP: string;
};

export const initialiseCreationEspacesAidants = async (
  entrepots: Entrepots,
  busEvenement: BusEvenement,
  aidants: string,
  generateurMotDePasse: () => string = genereMotDePasse
): Promise<ResultatCreationEspacesAidants> => {
  const resultat: ResultatCreationEspacesAidants = {
    aidantsImportes: [],
    aidantsExistants: [],
    mailsCreationEspaceAidantEnvoyes: [],
    mailsCreationEspaceAidantEnAttente: [],
  };

  const transcris = (aidant: string[]): AidantCSV | undefined => {
    const identifiant = aidant[4];
    if (!identifiant) {
      return undefined;
    }
    return {
      identifiantConnexion: identifiant.toLowerCase().trim(),
      nomPrenom: aidant[1],
      numeroTelephone: aidant[5],
      region: aidant[0],
      charte: aidant[3] as Statut,
      formation: aidant[2] as Statut,
      todo: aidant[6],
      qui: aidant[7],
      compteCree: aidant[8],
      commentaires: aidant[9],
      messageAvecMDP: aidant[10],
    };
  };

  const creeEspaceAidantTemporaire = async (
    aidantCSV: AidantCSV
  ): Promise<TraitementCreationEspaceAidant> => {
    const aidantExistantRecu = await entrepots
      .aidants()
      .rechercheParIdentifiantDeConnexion(aidantCSV.identifiantConnexion)
      .then((aidantDejaCree) => aidantDejaCree)
      .catch(() => undefined);
    if (aidantExistantRecu) {
      return ConstructeursImportAidant.aidantExistant(aidantCSV).construis();
    }
    const aidantImporte = await creeAidant(entrepots.aidants(), busEvenement, {
      identifiantConnexion: aidantCSV.identifiantConnexion,
      motDePasse: generateurMotDePasse(),
      nomPrenom: aidantCSV.nomPrenom,
    });
    return ConstructeursImportAidant.importe(
      aidantImporte!,
      aidantCSV
    ).construis();
  };

  const traiteLaDemandeAidantEnCours = async (
    aidantCSV: AidantCSV,
    demandeEnCours: DemandeDevenirAidant
  ) => {
    if (aidantCSV.formation === 'OK' && aidantCSV.charte === 'OK') {
      const demandeCreationEspaceAidantTransmise =
        await new CapteurCommandeEnvoiMailCreationCompteAidant(
          entrepots,
          busEvenement,
          fabriqueAdaptateurEnvoiMail(),
          adaptateurServiceChiffrement()
        ).execute({
          mail: demandeEnCours.mail,
          type: 'CommandeEnvoiMailCreationCompteAidant',
        });
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

  const traitements: Promise<(TraitementCreationEspaceAidant | undefined)[]> =
    Promise.all(
      recupereListeAidants(aidants).map(async (aidantCourant) => {
        const aidantCSV = transcris(aidantCourant.split(';'));
        if (aidantCSV) {
          const demandeEnCours = await entrepots
            .demandesDevenirAidant()
            .rechercheDemandeEnCoursParMail(aidantCSV.identifiantConnexion);
          if (demandeEnCours) {
            return await traiteLaDemandeAidantEnCours(
              aidantCSV,
              demandeEnCours
            );
          }
          return await creeEspaceAidantTemporaire(aidantCSV);
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
    'existant',
    (resultat, importAidant) => resultat.aidantsExistants.push(importAidant),
  ],
  [
    'importé',
    (resultat, importAidant) => resultat.aidantsImportes.push(importAidant),
  ],
  [
    'email-envoyé',
    (resultat, importAidant) =>
      resultat.mailsCreationEspaceAidantEnvoyes.push(importAidant),
  ],
  [
    'demande-en-attente',
    (resultat, importAidant) =>
      resultat.mailsCreationEspaceAidantEnAttente.push(importAidant),
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
