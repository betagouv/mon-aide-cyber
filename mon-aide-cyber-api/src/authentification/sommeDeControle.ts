import crypto from 'crypto';

export const sommeDeControle = (valeur: string) =>
  crypto.createHash('sha256').update(valeur).digest('base64');
