import crypto from 'crypto';
import { EntrepotAidant } from '../../../authentification/Aidant';
import { BusEvenement } from '../../../domaine/BusEvenement';
import { creeAidant } from '../../aidant/creeAidant';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';

type StatusImportation = 'importé' | 'existant';

export type ImportAidant = {
  email: string;
  nomPrenom: string;
  region: string;
  status: StatusImportation;
  telephone: string;
  charte: string;
  todo: string;
  qui: string;
  compteCree: string;
  commentaires: string;
  messageAvecMDP: string;
};

export type ResultatImportationAidants = {
  aidantsImportes: ImportAidant[];
  aidantsExistants: ImportAidant[];
};

const recupereListeAidants = (aidants: string) => {
  const tableauAidants = aidants.split('\n');

  if (tableauAidants[tableauAidants.length - 1].trim() === '') {
    return tableauAidants.slice(1, -1);
  }

  return tableauAidants.slice(1);
};

export type AidantTranscris = {
  identifiantConnexion: string;
  nomPrenom: string;
  numeroTelephone: string;
  region: string;
  charte: string;
  todo: string;
  qui: string;
  compteCree: string;
  commentaires: string;
  messageAvecMDP: string;
};
export const importeAidants = async (
  entrepotAidant: EntrepotAidant,
  busEvenement: BusEvenement,
  aidants: string,
  generateurMotDePasse: () => string = genereMotDePasse
): Promise<ResultatImportationAidants> => {
  const resultat: ResultatImportationAidants = {
    aidantsImportes: [],
    aidantsExistants: [],
  };

  const transcris = (aidant: string[]): AidantTranscris | undefined => {
    const identifiant = aidant[3];
    if (!identifiant) {
      return undefined;
    }
    return {
      identifiantConnexion: identifiant.toLowerCase().trim(),
      nomPrenom: aidant[1],
      numeroTelephone: aidant[4],
      region: aidant[0],
      charte: aidant[2],
      todo: aidant[5],
      qui: aidant[6],
      compteCree: aidant[7],
      commentaires: aidant[8],
      messageAvecMDP: aidant[9],
    };
  };

  const importAidants: Promise<(ImportAidant | undefined)[]> = Promise.all(
    recupereListeAidants(aidants).map(async (aidantCourant) => {
      const aidantTranscris = transcris(aidantCourant.split(';'));
      if (aidantTranscris) {
        const aidantExistantRecu = await entrepotAidant
          .rechercheParIdentifiantDeConnexion(
            aidantTranscris.identifiantConnexion
          )
          .then((aidantDejaCree) => aidantDejaCree)
          .catch(() => undefined);
        if (aidantExistantRecu) {
          const aidantExistant: ImportAidant = {
            email: aidantExistantRecu.identifiantConnexion,
            nomPrenom: aidantExistantRecu.nomPrenom,
            region: aidantTranscris.region,
            status: 'existant',
            telephone: aidantTranscris.numeroTelephone,
            charte: aidantTranscris.charte,
            qui: aidantTranscris.qui,
            commentaires: aidantTranscris.commentaires,
            compteCree: aidantTranscris.compteCree,
            messageAvecMDP: aidantTranscris.messageAvecMDP,
            todo: aidantTranscris.todo,
          };
          return aidantExistant;
        }
        const motDePasse = generateurMotDePasse();
        const aidantImporte = await creeAidant(entrepotAidant, busEvenement, {
          identifiantConnexion: aidantTranscris.identifiantConnexion,
          motDePasse,
          nomPrenom: aidantTranscris.nomPrenom,
        });
        const importAidant: ImportAidant = {
          email: aidantImporte!.identifiantConnexion,
          nomPrenom: aidantImporte!.nomPrenom,
          region: aidantTranscris.region,
          status: 'importé',
          telephone: aidantTranscris.numeroTelephone,
          charte: aidantTranscris.charte,
          qui: '',
          todo: 'message à envoyer',
          messageAvecMDP: `"Bonjour,\nVotre mot de passe MonAideCyber : ${motDePasse}\nPour toute information monaidecyber@ssi.gouv.fr\nBonne journée\nL'équipe MonAideCyber"`,
          compteCree: 'oui',
          commentaires: `importé le ${FournisseurHorloge.maintenant().toISOString()}`,
        };
        return importAidant;
      }
      return undefined;
    })
  );
  return importAidants.then((aidants) => {
    aidants
      .filter((aidant): aidant is ImportAidant => !!aidant)
      .forEach((aidant) => {
        if (aidant.status === 'importé') {
          resultat.aidantsImportes.push(aidant);
        } else {
          resultat.aidantsExistants.push(aidant);
        }
      });

    return resultat;
  });
};

const genereMotDePasse = () => {
  const expressionReguliere = /^[a-hj-km-np-zA-HJ-KM-NP-Z1-9!@#&()\-.+/]*$/;

  const chaineAleatoire = () => {
    const valeurAleatoire = String.fromCharCode(
      crypto.webcrypto.getRandomValues(new Uint8Array(1))[0]
    );
    if (expressionReguliere.test(valeurAleatoire)) {
      return valeurAleatoire;
    }
    return undefined;
  };

  return new Array(19)
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
