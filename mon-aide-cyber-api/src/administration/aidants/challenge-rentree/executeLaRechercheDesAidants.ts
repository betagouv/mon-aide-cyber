import crypto from 'crypto';
import { Aidant } from '../../../espace-aidant/Aidant';

export type ResultatChallenge = {
  nomPrenom: string;
  date: string;
  nombreDiagnostics: number;
};

export const executeLaRechercheDesAidants = (
  ligne: string,
  aidants: Aidant[]
): ResultatChallenge | undefined => {
  const [identifiant, date, nombreDiagnostics] = ligne.split(';');
  const aidantCorrespondant = aidants.find(
    (a) =>
      crypto.createHash('sha256').update(a.identifiant).digest('hex') ===
      identifiant
  );
  if (aidantCorrespondant) {
    return {
      nomPrenom: aidantCorrespondant?.nomPrenom,
      date,
      nombreDiagnostics: parseInt(nombreDiagnostics),
    };
  }
  return undefined;
};
