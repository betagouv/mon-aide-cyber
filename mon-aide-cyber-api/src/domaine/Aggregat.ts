import crypto from 'crypto';

export interface Aggregat {
  identifiant: crypto.UUID;
}

export class AggregatNonTrouve implements Error {
  message: string;
  name: string;

  constructor(typeAggregat: string) {
    this.name = '';
    this.message = `Le ${typeAggregat} demandé n'existe pas.`;
  }
}
