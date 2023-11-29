import crypto from 'crypto';

export interface Aggregat {
  identifiant: crypto.UUID;
}

export class AggregatNonTrouve extends Error {
  constructor(typeAggregat: string) {
    super(`Le ${typeAggregat} demandé n'existe pas.`);
  }
}
