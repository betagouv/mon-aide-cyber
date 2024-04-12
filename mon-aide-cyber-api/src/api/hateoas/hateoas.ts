import { AidantAuthentifie } from '../../authentification/Aidant';

type Methode = 'DELETE' | 'GET' | 'POST' | 'PATCH';
type LiensHATEOAS = Record<string, Options>;
export type ReponseHATEOAS = {
  liens: LiensHATEOAS;
};

type Options = { url: string; methode?: Methode; contentType?: string };

class ConstructeurActionsHATEOAS {
  private readonly actions: Map<string, Options> = new Map();

  lancerDiagnostic(): ConstructeurActionsHATEOAS {
    this.actions.set('lancer-diagnostic', {
      url: '/api/diagnostic',
      methode: 'POST',
    });
    return this;
  }

  postAuthentification(
    aidantAuthentifie: AidantAuthentifie,
  ): ConstructeurActionsHATEOAS {
    if (!aidantAuthentifie.dateSignatureCGU) {
      return this.creerEspaceAidant();
    }

    return this.lancerDiagnostic().afficherProfil();
  }

  afficherProfil(): ConstructeurActionsHATEOAS {
    this.actions.set('afficher-profil', {
      url: '/api/profil',
      methode: 'GET',
    });

    return this;
  }

  creerEspaceAidant(): ConstructeurActionsHATEOAS {
    this.actions.set('creer-espace-aidant', {
      url: '/api/espace-aidant/cree',
      methode: 'POST',
    });
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
  seConnecter(): ConstructeurActionsHATEOAS {
    this.actions.set('se-connecter', { url: '/api/token', methode: 'POST' });
    return this;
  }

  modifierMotDePasse(): ConstructeurActionsHATEOAS {
    this.actions.set('modifier-mot-de-passe', {
      url: '/api/profil/modifier-mot-de-passe',
      methode: 'POST',
    });
    return this;
  }

  private seDeconnecter(): ConstructeurActionsHATEOAS {
    this.actions.set('se-deconnecter', {
      url: '/api/token',
      methode: 'DELETE',
    });
    return this;
  }

  affichageProfil(): ConstructeurActionsHATEOAS {
    return this.lancerDiagnostic().modifierMotDePasse().seDeconnecter();
  }

  demanderAide() {
    this.actions.set('demander-aide', {
      url: '/api/aide/demande',
      methode: 'POST',
    });
    return this;
  }

  construis = (): ReponseHATEOAS => {
    return {
      liens: {
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
