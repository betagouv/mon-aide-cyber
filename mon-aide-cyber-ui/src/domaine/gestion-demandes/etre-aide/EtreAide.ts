import { ReponseHATEOAS } from '../../Lien.ts';
import { Departement } from '../departement.ts';
import { UUID } from '../../../types/Types.ts';

export type CorpsDemandeEtreAide = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
  relationAidant: boolean;
};

export type CorpsDemandeSolliciterAidant = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
  aidantSollicite: UUID;
};

export type ReponseDemandeEtreAide = ReponseHATEOAS & {
  departements: Departement[];
};

export const partageEmail = () => ({
  encode: (email: string) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa#unicode_strings
    const enBinaire = Array.from(new TextEncoder().encode(email), (byte) =>
      String.fromCodePoint(byte)
    ).join('');
    const base64 = btoa(enBinaire);
    return `utilisateur=${encodeURIComponent(base64)}`;
  },

  decode: (queryString: URLSearchParams) => {
    const utilisateur = queryString.get('utilisateur');

    if (!utilisateur) return '';

    return atob(decodeURIComponent(utilisateur));
  },
});
