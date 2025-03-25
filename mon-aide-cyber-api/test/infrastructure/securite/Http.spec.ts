import { describe, expect, it, beforeEach } from 'vitest';
import { Response } from 'express';
import { positionneLesCsp } from '../../../src/infrastructure/securite/Http';

type ResponsePourExpect = Response & { headers: Record<string, string> };

describe('Le sécurité HTTP', () => {
  describe('sur le positionnement des CSP (Content-Security-Policy)', () => {
    let reponseSpy: ResponsePourExpect;

    beforeEach(() => {
      reponseSpy = {
        headers: {},
        locals: {},
        setHeader: (cle: string, valeur: string) => {
          reponseSpy.headers[cle] = valeur;
        },
      } as unknown as ResponsePourExpect;
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

    it('ajoute un nonce aléatoire à « style-src »', () => {
      positionneLesCsp(reponseSpy, "default-src 'self'; style-src 'self';");

      expect(reponseSpy.headers['Content-Security-Policy']).toMatch(
        /default-src 'self'; style-src 'self' 'nonce-[A-Za-z0-9+/=]{24}';/
      );
    });

    it("stocke le nonce aléatoire du style dans `reponse.locals` pour permettre aux suivants d'y avoir accès", () => {
      positionneLesCsp(reponseSpy, "default-src 'self'; style-src 'self';");

      expect(reponseSpy.locals.nonce).toMatch(/[A-Za-z0-9+/=]{24}/);
    });
  });
});
