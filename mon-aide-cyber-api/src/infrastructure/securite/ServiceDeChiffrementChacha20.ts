import { ServiceDeChiffrement } from '../../securite/ServiceDeChiffrement';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const decoupeLaChaineChiffree = (chaineChiffree: string) => {
  return {
    chaineDonneesChiffrees: chaineChiffree.slice(56, -32),
    chaineIV: chaineChiffree.slice(0, 24),
    chaineDonneesAdditionnelles: chaineChiffree.slice(24, 56),
    chaineTag: chaineChiffree.slice(-32),
  };
};
export class ServiceDeChiffrementChacha20 implements ServiceDeChiffrement {
  private readonly NOMBRE_DE_PASSE = 10;
  encoding: BufferEncoding = 'hex';

  constructor(
    private readonly donneesAdditionnelles = crypto.randomBytes(16),
    private readonly clefSecrete = process.env.CLEF_SECRETE_CHIFFREMENT || ''
  ) {}

  async compare(hash: string, motDePasse: string): Promise<boolean> {
    return bcrypt.compare(motDePasse, hash);
  }

  async hache(chaine: string): Promise<string> {
    return await bcrypt.hash(chaine, this.NOMBRE_DE_PASSE);
  }

  chiffre(chaine: string): string {
    const iv = crypto.randomBytes(12);
    const chiffrement = crypto.createCipheriv(
      'chacha20-poly1305',
      this.clefSecrete,
      iv,
      {
        authTagLength: 16,
      }
    );
    chiffrement.setAAD(this.donneesAdditionnelles, {
      plaintextLength: Buffer.byteLength(chaine),
    });

    const donneesChiffrees = Buffer.concat([
      chiffrement.update(chaine, 'utf-8'),
      chiffrement.final(),
    ]);
    const tag = chiffrement.getAuthTag();

    return (
      iv.toString(this.encoding) +
      this.donneesAdditionnelles.toString(this.encoding) +
      donneesChiffrees.toString(this.encoding) +
      tag.toString(this.encoding)
    );
  }

  dechiffre(chaine: string): string {
    const {
      chaineDonneesChiffrees,
      chaineIV,
      chaineDonneesAdditionnelles,
      chaineTag,
    } = decoupeLaChaineChiffree(chaine);

    const iv = Buffer.from(chaineIV, this.encoding);
    const donneesChiffrees = Buffer.from(chaineDonneesChiffrees, this.encoding);
    const tag = Buffer.from(chaineTag, this.encoding);

    const dechiffrement = crypto.createDecipheriv(
      'chacha20-poly1305',
      this.clefSecrete,
      iv,
      { authTagLength: 16 }
    );
    dechiffrement.setAAD(
      Buffer.from(chaineDonneesAdditionnelles, this.encoding),
      {
        plaintextLength: chaineDonneesChiffrees.length,
      }
    );
    dechiffrement.setAuthTag(Buffer.from(tag));

    const donneesDechiffrees = dechiffrement.update(donneesChiffrees);
    return Buffer.concat([
      donneesDechiffrees,
      dechiffrement.final(),
    ]).toString();
  }
}
