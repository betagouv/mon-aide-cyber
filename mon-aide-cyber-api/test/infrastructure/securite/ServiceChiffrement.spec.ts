import { describe, expect } from 'vitest';
import { ServiceDeChiffrement } from '../../../src/infrastructure/securite/ServiceChiffrement';

describe('Service de chiffrement', () => {
  it('est capable de chiffrer une chaine de caractère', () => {
    const chaineChiffree = new ServiceDeChiffrement(
      Buffer.from('ivlongueur12'),
      Buffer.from('assoc-longueur16'),
      'ma-clef-secrete-de-longueur-0032',
    ).chiffre('contenu à chiffrer');

    expect(chaineChiffree).toBe(
      '69766c6f6e677565757231326173736f632d6c6f6e67756575723136edb9dabf70ccb254aa95be2682b4fe9ef399822cab7c76219230aee727cb907a0bb7ff',
    );
  });

  it('est capable de déchiffrer une chaine de caractère', () => {
    '69762d64652d6c6f6e67756575723136';
    const chaineDechiffree = new ServiceDeChiffrement(
      Buffer.from('ivlongueur12'),
      Buffer.from('assoc-longueur16'),
      'ma-clef-secrete-de-longueur-0032',
    ).dechiffre(
      '69766c6f6e677565757231326173736f632d6c6f6e67756575723136edb9dabf70ccb254aa95be2682b4fe9ef399822cab7c76219230aee727cb907a0bb7ff',
    );

    expect(chaineDechiffree).toBe('contenu à chiffrer');
  });
});
