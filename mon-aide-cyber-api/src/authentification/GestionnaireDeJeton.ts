import { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';

export type Jeton = string;

export type DonneesJetonMAC = {
  identifiant: string;
};

export type JwtMACPayload = JwtPayload & {
  identifiant: crypto.UUID;
  estProconnect: boolean;
};

export interface GestionnaireDeJeton {
  verifie(jeton: string, jetonProconnect?: string): JwtMACPayload;

  genereJeton(donnee: DonneesJetonMAC): Jeton;
}
