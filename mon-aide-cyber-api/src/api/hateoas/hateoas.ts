import { AidantAuthentifie } from '../../authentification/Aidant';
import crypto from 'crypto';
import { InformationsContexte } from '../../adaptateurs/AdaptateurDeVerificationDeSession';

type Methode = 'DELETE' | 'GET' | 'POST' | 'PATCH';
export type LiensHATEOAS = Record<string, Options>;
export type ReponseHATEOAS = {
  liens: LiensHATEOAS;
};

type Options = { url: string; methode?: Methode; contentType?: string };

type ContexteSpecifique = {
  [clef: string]: Options;
};
type ContexteGeneral = {
  [clef: string]: ContexteSpecifique | Options;
};

const estInformationContexte = (
  informationsContexte: InformationsContexte | undefined
): informationsContexte is InformationsContexte =>
  !!informationsContexte && !!informationsContexte.contexte;

const estOption = (option: Options | ContexteSpecifique): option is Options => {
  const opt = option as Options;
  return !!opt.url && !!opt.methode;
};

class ConstructeurActionsDepuisContexte {
  private readonly contextes: Map<string, ContexteGeneral> = new Map([
    [
      'demande-devenir-aidant',
      {
        'finalise-creation-espace-aidant': {
          'finalise-creation-espace-aidant': {
            url: '/api/demandes/devenir-aidant/creation-espace-aidant',
            methode: 'POST',
          },
        },
        'demande-devenir-aidant': {
          'envoyer-demande-devenir-aidant': {
            url: '/api/demandes/devenir-aidant',
            methode: 'POST',
          },
          'demande-devenir-aidant': {
            url: '/api/demandes/devenir-aidant',
            methode: 'GET',
          },
        },
      },
    ],
    [
      'demande-etre-aide',
      {
        'demande-etre-aide': {
          url: '/api/demandes/etre-aide',
          methode: 'GET',
        },
        'demander-aide': {
          url: '/api/demandes/etre-aide',
          methode: 'POST',
        },
      },
    ],
    [
      'se-connecter',
      { 'se-connecter': { url: '/api/token', methode: 'POST' } },
    ],
  ]);
  private readonly actions: Map<string, Options> = new Map();

  constructor(informationsContexte: InformationsContexte) {
    const contextes = informationsContexte.contexte.split(':');
    const options = this.contextes.get(contextes[0]);
    if (options) {
      if (contextes[1]) {
        Object.entries(options[contextes[1]]).forEach(([clef, opt]) =>
          this.actions.set(clef, opt)
        );
      } else {
        Object.entries(options)
          .filter(([, opt]) => estOption(opt))
          .forEach(([clef, opt]) => this.actions.set(clef, opt as Options));
      }
    }
  }

  construis(): Map<string, Options> {
    return this.actions;
  }
}

class ConstructeurActionsHATEOAS {
  private readonly actions: Map<string, Options> = new Map();

  lancerDiagnostic(): ConstructeurActionsHATEOAS {
    this.actions.set('lancer-diagnostic', {
      url: '/api/diagnostic',
      methode: 'POST',
    });
    this.afficherTableauDeBord();
    return this;
  }

  private afficherTableauDeBord() {
    this.actions.set('afficher-tableau-de-bord', {
      url: '/api/espace-aidant/tableau-de-bord',
      methode: 'GET',
    });
  }

  postAuthentification(
    aidantAuthentifie: AidantAuthentifie
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
      url: `/api/diagnostic/${idDiagnostic}`,
      methode: 'GET',
    });
    return this;
  }

  private seConnecter(): ConstructeurActionsHATEOAS {
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
      url: '/api/demandes/etre-aide',
      methode: 'POST',
    });
    return this;
  }

  actionsTableauDeBord(idDiagnostics: string[]): ConstructeurActionsHATEOAS {
    this.actions.set('lancer-diagnostic', {
      url: '/api/diagnostic',
      methode: 'POST',
    });
    idDiagnostics.forEach((idDiagnostic) =>
      this.afficherDiagnostic(idDiagnostic as crypto.UUID)
    );
    return this.afficherProfil().seDeconnecter();
  }

  actionsDiagnosticLance(
    idDiagnostic: crypto.UUID
  ): ConstructeurActionsHATEOAS {
    this.afficherDiagnostic(idDiagnostic);
    this.afficherTableauDeBord();
    return this;
  }

  private afficherDiagnostic(idDiagnostic: crypto.UUID) {
    this.actions.set(`afficher-diagnostic-${idDiagnostic}`, {
      url: `/api/diagnostic/${idDiagnostic}/restitution`,
      methode: 'GET',
    });
  }

  actionsAccesDiagnosticNonAutorise(): ConstructeurActionsHATEOAS {
    this.afficherTableauDeBord();
    return this.afficherProfil().seDeconnecter();
  }

  reponseDonneeAuDiagnostic(
    identifiantDiagnostic: crypto.UUID
  ): ConstructeurActionsHATEOAS {
    this.afficherDiagnostic(identifiantDiagnostic);
    return this;
  }

  actionsPubliques(): ConstructeurActionsHATEOAS {
    this.actions.set('demande-devenir-aidant', {
      url: '/api/demandes/devenir-aidant',
      methode: 'GET',
    });

    this.actions.set('demande-etre-aide', {
      url: '/api/demandes/etre-aide',
      methode: 'GET',
    });

    return this.seConnecter();
  }

  actionsDemandeDevenirAidant(): ConstructeurActionsHATEOAS {
    this.actions.set('envoyer-demande-devenir-aidant', {
      url: '/api/demandes/devenir-aidant',
      methode: 'POST',
    });
    return this;
  }

  actionsCreationCompte(): ConstructeurActionsHATEOAS {
    this.seConnecter();
    return this;
  }

  pour(
    informationsContexte: InformationsContexte | undefined
  ): ConstructeurActionsHATEOAS {
    if (estInformationContexte(informationsContexte)) {
      const actions = Object.entries(
        Object.fromEntries(
          new ConstructeurActionsDepuisContexte(informationsContexte)
            .construis()
            .entries()
        )
      );
      actions.forEach(([clef, options]) => this.actions.set(clef, options));
    } else {
      this.actionsPubliques();
    }
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
            {}
          )),
      },
    };
  };
}

export const constructeurActionsHATEOAS = (): ConstructeurActionsHATEOAS =>
  new ConstructeurActionsHATEOAS();
