import crypto from 'crypto';
import { creeAidant } from '../aidant/creeAidant';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { EntrepotAidant } from '../../authentification/Aidant';
import { BusEvenement } from '../../domaine/BusEvenement';

export type ResultatImportationAidants = {
  aidantsImportes: ImportAidant[];
  aidantsNonImportes: ImportAidant[];
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
    aidantsNonImportes: [],
    aidantsExistants: [],
  };

  const transcris = (
    aidant: string[],
  ): {
    nomPrenom: string;
    identifiantConnexion: string;
    doitImporterAidant: boolean;
    numeroTelephone: string;
    region: string;
  } => {
    return {
      doitImporterAidant: aidant[2] === 'OK',
      nomPrenom: aidant[1],
      identifiantConnexion: aidant[3],
      numeroTelephone: aidant[4],
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
          charteSignee: true,
          cguSignee: true,
          email: aidantExistant.identifiantConnexion,
          nomPrenom: aidantExistant.nomPrenom,
          telephone: aidantTranscris.numeroTelephone,
          region: aidantTranscris.region,
        };
      }

      if (aidantTranscris.doitImporterAidant) {
        const motDePasse = generateurMotDePasse();
        const aidantImporte = await creeAidant(entrepotAidant, busEvenement, {
          identifiantConnexion: aidantTranscris.identifiantConnexion,
          motDePasse,
          nomPrenom: aidantTranscris.nomPrenom,
          dateSignatureCGU: FournisseurHorloge.maintenant(),
          dateSignatureCharte: FournisseurHorloge.maintenant(),
        });
        return {
          charteSignee: true,
          cguSignee: true,
          email: aidantImporte!.identifiantConnexion,
          motDePasse,
          nomPrenom: aidantImporte!.nomPrenom,
          telephone: aidantTranscris.numeroTelephone,
          region: aidantTranscris.region,

      };
        }
      return {
        charteSignee: false,
        cguSignee: false,
        email: aidantTranscris.identifiantConnexion,
        nomPrenom: aidantTranscris.nomPrenom,
        telephone: aidantTranscris.numeroTelephone,
        region: aidantTranscris.region,
      };
    }),
  );
  return importAidants.then((aidants) => {
    aidants.forEach((aidant) => {
      const aidantExistant =
        !aidant.motDePasse && aidant.cguSignee && aidant.charteSignee;
      if (aidantExistant) {
        resultat.aidantsExistants.push(aidant);
      }
      const aidantImporte = aidant.motDePasse;
      if (aidantImporte) {
        resultat.aidantsImportes.push(aidant);
      }
      const aidantNonImporte = !aidant.charteSignee && !aidant.cguSignee;
      if (aidantNonImporte) {
        resultat.aidantsNonImportes.push(aidant);
      }
    });
    return resultat;
  });
};

type ImportAidant = {
  charteSignee: boolean;
  cguSignee: boolean;
  email: string;
  motDePasse?: string;
  nomPrenom: string;
  telephone: string;
  region: string;
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
