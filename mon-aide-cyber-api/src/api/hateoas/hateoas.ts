type Methode = 'GET' | 'POST' | 'PATCH';
type SuiteHATEOAS = { suite?: Options };
type LiensHATEOAS = SuiteHATEOAS | Record<string, Options>;
export type ReponseHATEOAS = {
  liens: LiensHATEOAS;
};

type Options = { url: string; methode?: Methode; contentType?: string };

class ConstructeurActionsHATEOAS {
  private readonly actions: Map<string, Options> = new Map();
  private suite: Options = {} as { url: string };

  lancerDiagnostic(): ConstructeurActionsHATEOAS {
    this.actions.set('lancer-diagnostic', {
      url: '/api/diagnostic',
      methode: 'POST',
    });
    return this;
  }

  postAuthentification(): ConstructeurActionsHATEOAS {
    this.tableauDeBord();
    return this;
  }

  tableauDeBord(): ConstructeurActionsHATEOAS {
    this.suite = { url: '/tableau-de-bord' };
    return this;
  }

  restituerDiagnostic(idDiagnostic: string): ConstructeurActionsHATEOAS {
    this.actions.set('restitution-pdf', {
      url: `/api/diagnostic/${idDiagnostic}/restitution`,
      methode: 'GET',
      contentType: 'application/pdf',
    });
    this.actions.set('restitution-json', {
      url: `/api/diagnostic/${idDiagnostic}/restitution`,
      methode: 'GET',
      contentType: 'application/json',
    });
    return this;
  }

  modifierDiagnostic(idDiagnostic: string): ConstructeurActionsHATEOAS {
    this.actions.set('modifier-diagnostic', {
      url: `/diagnostic/${idDiagnostic}`,
    });
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
