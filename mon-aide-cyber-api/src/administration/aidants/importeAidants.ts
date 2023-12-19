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
  } => {
    return {
      doitImporterAidant: aidant[2] === 'OK',
      nomPrenom: aidant[1],
      identifiantConnexion: aidant[3],
    };
  };

  const importAidants: Promise<ImportAidant[]> = Promise.all(
    aidants
      .split('\n')
      .slice(1)
      .map(async (aidantCourant) => {
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
          };
        }
        return {
          charteSignee: false,
          cguSignee: false,
          email: aidantTranscris.identifiantConnexion,
          nomPrenom: aidantTranscris.nomPrenom,
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
