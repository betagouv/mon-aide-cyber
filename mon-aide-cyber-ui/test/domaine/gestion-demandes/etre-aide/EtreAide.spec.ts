import { describe, expect, it } from 'vitest';
import { partageEmail } from '../../../../src/domaine/gestion-demandes/etre-aide/EtreAide.ts';

describe('EtreAide', () => {
  describe("le partage d'email d'utilisateur ", () => {
    it("encode en base64 et « URI component » l'email qu'on lui passe", () => {
      const apresEncodage = partageEmail().encodePourMAC(
        'utilisateur@societe.fr'
      );
      expect(apresEncodage).toBe(
        'utilisateur=dXRpbGlzYXRldXJAc29jaWV0ZS5mcg%3D%3D'
      );
    });

    it("encode en base64 et « URI component » l'email qu'on lui passe pour MSC", () => {
      const apresEncodage = partageEmail().encodePourMSC(
        'utilisateur@societe.fr'
      );
      expect(apresEncodage).toBe(
        'utilisateur-mac=dXRpbGlzYXRldXJAc29jaWV0ZS5mcg%3D%3D'
      );
    });

    it('encode en base64 et « URI component » le nom de l’Aidant et ajoute son identifiant que l’on passe pour MSC', () => {
      const apresEncodage = partageEmail().encodeIdentifiantPourMSC(
        'Jean D.',
        '1d07eb19-9317-47d8-acbb-5f47044f29b5'
      );
      expect(apresEncodage).toBe(
        'nom-usage=SmVhbiBELg%3D%3D&identifiant-utilisateur-mac=1d07eb19-9317-47d8-acbb-5f47044f29b5'
      );
    });

    it('décode un email encodé, peu importe où il est dans la query string', () => {
      const apresDecodage = partageEmail().decodePourMAC(
        new URLSearchParams(
          'a=b&utilisateur=dXRpbGlzYXRldXJAc29jaWV0ZS5mcg%3D%3D&c=d'
        )
      );

      expect(apresDecodage).toBe('utilisateur@societe.fr');
    });

    it("reste robuste et renvoie vide si jamais l'utilisateur n'est pas trouvé dans la query string", () => {
      const sansUtilisateur = partageEmail().decodePourMAC(
        new URLSearchParams('a=b&c=d')
      );

      expect(sansUtilisateur).toBe('');
    });
  });
});
