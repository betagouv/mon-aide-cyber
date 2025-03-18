import { describe, expect, it } from 'vitest';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { ServiceDeHashageMac } from '../../../src/infrastructure/securite/ServiceDeHashageMac';

describe('ServiceDeHashage', () => {
  it('Hashe et sale une chaîne de caractère', () => {
    adaptateurEnvironnement.parametresDeHash().sel = () => 'ma-clef-de-salage';

    const chaineHashee = new ServiceDeHashageMac().hashe('Hello le monde !');

    expect(chaineHashee).toBe(
      '979360f344bb37a8a25bd2a6e248bda9c6d177ec4b8102980622b08d22fad055fb2aad50f4aef2354df9141625416b1241da915e74e45df58cfa6740eb6ae64e'
    );
  });
});
