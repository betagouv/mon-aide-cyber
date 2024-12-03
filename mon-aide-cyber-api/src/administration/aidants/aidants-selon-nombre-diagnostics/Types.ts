import { Aggregat } from '../../../domaine/Aggregat';

export type Aidant = {
  email: string;
  nomPrenom: string;
  compteCree?: Date;
} & Aggregat;
