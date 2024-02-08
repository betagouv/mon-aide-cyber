export type Commande = {
  type: string;
};

export type Saga = Commande;

export interface CapteurSaga<S extends Saga, R> {
  execute(saga: S): Promise<R>;
}
export interface CapteurCommande<C extends Commande, R> {
  execute(commande: C): Promise<R>;
}

export interface BusCommande {
  publie<C extends Commande, R>(commande: C): Promise<R>;
}
