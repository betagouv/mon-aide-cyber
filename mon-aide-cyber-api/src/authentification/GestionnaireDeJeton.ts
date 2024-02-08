import { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';

export type Jeton = string;

export type DonneesJetonMAC = {
  identifiant: string;
};

export type JwtMACPayload = JwtPayload & {
  identifiant: crypto.UUID;
};

export interface GestionnaireDeJeton {
  verifie(jeton: string): JwtMACPayload;

  genereJeton(donnee: DonneesJetonMAC): Jeton;
}
