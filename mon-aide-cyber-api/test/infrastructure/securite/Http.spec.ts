import { describe, expect, it, beforeEach } from 'vitest';
import {
  ContientHeader,
  positionneLesCsp,
} from '../../../src/infrastructure/securite/Http';

describe('Le sécurité HTTP', () => {
  describe('sur le positionnement des CSP (Content-Security-Policy)', () => {
    let reponseSpy: { headers: Record<string, string> } & ContientHeader;

    beforeEach(() => {
      reponseSpy = {
        headers: {},
        setHeader: (cle: string, valeur: string) => {
          reponseSpy.headers[cle] = valeur;
        },
      };
    });

    it("positionne une valeur « * » si aucune valeur n'est passée", () => {
      positionneLesCsp(reponseSpy, '');

      expect(reponseSpy.headers['Content-Security-Policy']).toBe('*');
    });

    it("utilise la valeur passée si celle-ci n'est pas vide", () => {
      positionneLesCsp(reponseSpy, "default-src 'self';");

      expect(reponseSpy.headers['Content-Security-Policy']).toBe(
        "default-src 'self';"
      );
    });
  });
});
