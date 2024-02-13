import crypto from 'crypto';
import { creeAidant } from '../aidant/creeAidant';
import { EntrepotAidant } from '../../authentification/Aidant';
import { BusEvenement } from '../../domaine/BusEvenement';

type StatusImportation = 'importé' | 'existant';

export type ImportAidant = {
  email: string;
  motDePasse?: string;
  nomPrenom: string;
  region: string;
  status: StatusImportation;
  telephone: string;
};

export type ResultatImportationAidants = {
  aidantsImportes: ImportAidant[];
  aidantsExistants: ImportAidant[];
};

function recupereListeAidants(aidants: string) {
  const tableauAidants = aidants.split('\n');

  if (tableauAidants[tableauAidants.length - 1].trim() === '') {
    return tableauAidants.slice(1, -1);
  }

  return tableauAidants.slice(1);
}

export const importeAidants = async (
  entrepotAidant: EntrepotAidant,
  busEvenement: BusEvenement,
  aidants: string,
  generateurMotDePasse: () => string = genereMotDePasse,
): Promise<ResultatImportationAidants> => {
  const resultat: ResultatImportationAidants = {
    aidantsImportes: [],
    aidantsExistants: [],
  };

  const transcris = (
    aidant: string[],
  ): {
    identifiantConnexion: string;
    nomPrenom: string;
    numeroTelephone: string;
    region: string;
  } => {
    return {
      identifiantConnexion: aidant[2].toLowerCase().trim(),
      nomPrenom: aidant[1],
      numeroTelephone: aidant[3],
      region: aidant[0],
    };
  };

  const importAidants: Promise<ImportAidant[]> = Promise.all(
    recupereListeAidants(aidants).map(async (aidantCourant) => {
      const aidant = aidantCourant.split(';');
      const aidantTranscris = transcris(aidant);
      const aidantExistant = await entrepotAidant
        .rechercheParIdentifiantDeConnexion(
          aidantTranscris.identifiantConnexion,
        )
        .then((aidantDejaCree) => aidantDejaCree)
        .catch(() => undefined);
      if (aidantExistant) {
        return {
          email: aidantExistant.identifiantConnexion,
          nomPrenom: aidantExistant.nomPrenom,
          region: aidantTranscris.region,
          status: 'existant',
          telephone: aidantTranscris.numeroTelephone,
        };
      }

      const motDePasse = generateurMotDePasse();
      const aidantImporte = await creeAidant(entrepotAidant, busEvenement, {
        identifiantConnexion: aidantTranscris.identifiantConnexion,
        motDePasse,
        nomPrenom: aidantTranscris.nomPrenom,
      });
      return {
        email: aidantImporte!.identifiantConnexion,
        motDePasse,
        nomPrenom: aidantImporte!.nomPrenom,
        region: aidantTranscris.region,
        status: 'importé',
        telephone: aidantTranscris.numeroTelephone,
      };
    }),
  );
  return importAidants.then((aidants) => {
    aidants.forEach((aidant) => {
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
  const expressionReguliere = /^[a-zA-Z0-9!@#$&()\-.+,/]*$/;

  const chaineAleatoire = () => {
    const valeurAleatoire = String.fromCharCode(
      crypto.webcrypto.getRandomValues(new Uint8Array(1))[0],
    );
    if (expressionReguliere.test(valeurAleatoire)) {
      return valeurAleatoire;
    }
    return undefined;
  };

  return new Array(16)
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
