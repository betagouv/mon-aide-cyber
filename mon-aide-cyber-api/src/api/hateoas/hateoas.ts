type Methode = 'GET' | 'POST' | 'PATCH';
type SuiteHATEOAS = { suite?: { url: string; methode?: Methode } };
type LiensHATEOAS =
  | SuiteHATEOAS
  | Record<string, { url: string; methode: Methode }>;
export type ReponseHATEOAS = {
  liens: LiensHATEOAS;
};

class ConstructeurActionsHATEOAS {
  private readonly actions: Map<string, { url: string; methode: Methode }> =
    new Map();
  private suite: { url: string; methode?: Methode } = {} as { url: string };

  lancerDiagnostic(): ConstructeurActionsHATEOAS {
    this.actions.set('lancer-diagnostic', {
      url: '/api/diagnostic',
      methode: 'POST',
    });
    return this;
  }

  postAuthentification(): ConstructeurActionsHATEOAS {
    this.suite = { url: '/tableau-de-bord' };
    return this;
  }

  construis = (): ReponseHATEOAS => {
    return {
      liens: {
        suite: this.suite,
        ...(this.actions.size > 0 &&
          Array.from(this.actions).reduce(
            (accumulateur, [action, lien]) => ({
              ...accumulateur,
              [action]: lien,
            }),
            {},
          )),
      },
    };
  };
}

export const constructeurActionsHATEOAS = (): ConstructeurActionsHATEOAS =>
  new ConstructeurActionsHATEOAS();
