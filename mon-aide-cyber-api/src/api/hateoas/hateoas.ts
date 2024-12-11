import crypto from 'crypto';
import { InformationsContexte } from '../../adaptateurs/AdaptateurDeVerificationDeSession';
import { UtilisateurAuthentifie } from '../../authentification/Utilisateur';
import {
  ContexteSpecifique,
  contextesUtilisateur,
} from './contextesUtilisateur';

type Methode = 'DELETE' | 'GET' | 'POST' | 'PATCH';
export type LiensHATEOAS = Record<string, Options>;
export type ReponseHATEOAS = {
  liens: LiensHATEOAS;
};

export type ReponseHATEOASEnErreur = ReponseHATEOAS & { message: string };

export type Options = { url: string; methode?: Methode; contentType?: string };

const estInformationContexte = (
  informationsContexte: InformationsContexte | undefined
): informationsContexte is InformationsContexte =>
  !!informationsContexte && !!informationsContexte.contexte;

const estOption = (option: Options | ContexteSpecifique): option is Options => {
  const opt = option as Options;
  return !!opt.url && !!opt.methode;
};

class ConstructeurActionsDepuisContexte {
  private readonly actions: Map<string, Options> = new Map();

  constructor(informationsContexte: InformationsContexte) {
    const contextes = informationsContexte.contexte.split(':');
    const options = contextesUtilisateur[contextes[0]];
    if (options) {
      if (contextes[1]) {
        Object.entries(options[contextes[1]]).forEach(
          ([clef, opt]: [clef: string, opt: Options]) => {
            let option: Options = { ...opt };
            if (contextes[2]) {
              clef = `afficher-diagnostic-${contextes[2]}`;
              option = {
                url: opt.url.replace('__ID__', contextes[2]),
                methode: opt.methode,
              } as Options;
            }
            this.actions.set(clef, option);
          }
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

  public afficherTableauDeBord(): ConstructeurActionsHATEOAS {
    this.actions.set('afficher-tableau-de-bord', {
      url: '/api/espace-aidant/tableau-de-bord',
      methode: 'GET',
    });
    return this;
  }

  public postAuthentification(
    utilisateurAuthentifie: UtilisateurAuthentifie
  ): ConstructeurActionsHATEOAS {
    if (!utilisateurAuthentifie.dateSignatureCGU) {
      return this.creerEspaceAidant();
    }

    return this.lancerDiagnostic().afficherMesInformations();
  }

  public creerEspaceAidant(): ConstructeurActionsHATEOAS {
    this.actions.set('creer-espace-aidant', {
      url: '/api/espace-aidant/cree',
      methode: 'POST',
    });
    return this;
  }

  public demandeLaRestitution(identifiant: string): ConstructeurActionsHATEOAS {
    this.lancerDiagnostic()
      .restituerDiagnostic(identifiant)
      .modifierDiagnostic(identifiant)
      .afficherMesInformations();
    return this;
  }

  public creeEspaceAidant(): ConstructeurActionsHATEOAS {
    this.lancerDiagnostic().afficherMesInformations();
    return this;
  }

  public accedeAuProfil(): ConstructeurActionsHATEOAS {
    return this.lancerDiagnostic()
      .modifierProfil()
      .modifierMotDePasse()
      .seDeconnecter();
  }

  public demandeAide() {
    this.actions.set('demander-aide', {
      url: '/api/demandes/etre-aide',
      methode: 'POST',
    });
    return this;
  }

  public accedeAuTableauDeBord(
    idDiagnostics: string[]
  ): ConstructeurActionsHATEOAS {
    this.actions.set('lancer-diagnostic', {
      url: '/api/diagnostic',
      methode: 'POST',
    });
    idDiagnostics.forEach((idDiagnostic) =>
      this.afficherDiagnostic(idDiagnostic as crypto.UUID)
    );
    return this.afficherMesInformations().seDeconnecter();
  }

  public accesDiagnostic(
    idDiagnostic: crypto.UUID
  ): ConstructeurActionsHATEOAS {
    this.afficherDiagnostic(idDiagnostic);
    this.repondreDiagnostic(idDiagnostic);
    this.afficherTableauDeBord();
    return this;
  }

  private repondreDiagnostic(
    idDiagnostic: `${string}-${string}-${string}-${string}-${string}`
  ) {
    this.actions.set('repondre-diagnostic', {
      url: `/api/diagnostic/${idDiagnostic}`,
      methode: 'PATCH',
    });
  }

  public actionsAccesDiagnosticNonAutorise(): ConstructeurActionsHATEOAS {
    return this.afficherTableauDeBord()
      .afficherMesInformations()
      .seDeconnecter();
  }

  public ajoutReponseAuDiagnostic(
    identifiantDiagnostic: crypto.UUID
  ): ConstructeurActionsHATEOAS {
    this.afficherDiagnostic(identifiantDiagnostic);
    this.repondreDiagnostic(identifiantDiagnostic);
    return this;
  }

  public actionsPubliques(): ConstructeurActionsHATEOAS {
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

  public demandeDevenirAidant(): ConstructeurActionsHATEOAS {
    this.actions.set('envoyer-demande-devenir-aidant', {
      url: '/api/demandes/devenir-aidant',
      methode: 'POST',
    });
    return this;
  }

  public actionsCreationCompte(): ConstructeurActionsHATEOAS {
    this.seConnecter();
    return this;
  }

  public pour(
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

  public modifierPreferences(): ConstructeurActionsHATEOAS {
    this.actions.set('modifier-preferences', {
      url: '/api/aidant/preferences',
      methode: 'PATCH',
    });
    return this;
  }

  public accedeAuxInformationsUtilisateur(): ConstructeurActionsHATEOAS {
    this.lancerDiagnostic().afficherMesInformations();
    return this;
  }

  private lancerDiagnostic(): ConstructeurActionsHATEOAS {
    this.actions.set('lancer-diagnostic', {
      url: '/api/diagnostic',
      methode: 'POST',
    });
    this.afficherTableauDeBord();
    return this;
  }

  private afficherMesInformations(): ConstructeurActionsHATEOAS {
    this.actions.set('afficher-profil', {
      url: '/api/profil',
      methode: 'GET',
    });
    this.actions.set('afficher-preferences', {
      url: '/api/aidant/preferences',
      methode: 'GET',
    });

    return this;
  }

  private restituerDiagnostic(
    idDiagnostic: string
  ): ConstructeurActionsHATEOAS {
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

  private modifierDiagnostic(idDiagnostic: string): ConstructeurActionsHATEOAS {
    this.actions.set('modifier-diagnostic', {
      url: `/api/diagnostic/${idDiagnostic}`,
      methode: 'GET',
    });
    return this;
  }

  private seConnecter(): ConstructeurActionsHATEOAS {
    this.actions.set('se-connecter', { url: '/api/token', methode: 'POST' });
    if (process.env.PRO_CONNECT_ACTIF === 'true') {
      this.actions.set('se-connecter-avec-pro-connect', {
        url: '/pro-connect/connexion',
        methode: 'GET',
      });
    }
    return this;
  }

  private modifierMotDePasse(): ConstructeurActionsHATEOAS {
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

  private afficherDiagnostic(
    idDiagnostic: crypto.UUID
  ): ConstructeurActionsHATEOAS {
    this.actions.set(`afficher-diagnostic-${idDiagnostic}`, {
      url: `/api/diagnostic/${idDiagnostic}/restitution`,
      methode: 'GET',
    });
    return this;
  }

  private modifierProfil(): ConstructeurActionsHATEOAS {
    if (
      process.env.FEATURE_FLAG_ESPACE_AIDANT_ECRAN_PROFIL_MODIFIER_PROFIL ===
      'true'
    ) {
      this.actions.set('modifier-profil', {
        url: '/api/profil',
        methode: 'PATCH',
      });
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
