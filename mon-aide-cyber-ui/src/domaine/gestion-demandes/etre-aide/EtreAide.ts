import { UUID } from '../../../types/Types.ts';

export type Email = string;
export const partageEmail = () => {
  const encode = (email: string, clefQueryString: string) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa#unicode_strings
    const enBinaire = Array.from(new TextEncoder().encode(email), (byte) =>
      String.fromCodePoint(byte)
    ).join('');
    const base64 = btoa(enBinaire);
    return `${clefQueryString}=${encodeURIComponent(base64)}`;
  };

  return {
    encodePourMAC: (email: string) => encode(email, 'utilisateur'),
    encodePourMSC: (email: string) => encode(email, 'email-utilisateur-mac'),
    encodeIdentifiantPourMSC: (nomPrenom: string, identifiant: UUID) =>
      `${encode(nomPrenom, 'nom-usage')}&identifiant-utilisateur-mac=${identifiant}`,
    decodePourMAC: (queryString: URLSearchParams) => {
      const utilisateur = queryString.get('utilisateur');

      if (!utilisateur) return '';

      return atob(decodeURIComponent(utilisateur));
    },
  };
};
