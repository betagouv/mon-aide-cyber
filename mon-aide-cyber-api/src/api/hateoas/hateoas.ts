import crypto from 'crypto';
import { InformationsContexte } from '../../adaptateurs/AdaptateurDeVerificationDeSession';
import {
  ContexteSpecifique,
  contextesUtilisateur,
} from './contextesUtilisateur';
import { demandeAide } from './etreAide';
import { afficherTableauDeBord } from './aidant';
import { demandeDevenirAidant } from './devenirAidant';

type Methode = 'DELETE' | 'GET' | 'POST' | 'PATCH';
export type LiensHATEOAS = Record<string, Options>;
export type ReponseHATEOAS = {
  liens: LiensHATEOAS;
};

export type ReponseHATEOASEnErreur = ReponseHATEOAS & { message: string };

export type Options = {
  url: string;
  methode?: Methode;
  contentType?: string;
  typeAppel?: 'API' | 'DIRECT';
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
  private readonly actions: Map<string, Options> = new Map();

  constructor(informationsContexte: InformationsContexte) {
    const contextes = informationsContexte.contexte.split(':');
    const options = contextesUtilisateur()[contextes[0]];
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
    this.actions.set(
      'afficher-tableau-de-bord',
      afficherTableauDeBord['afficher-tableau-de-bord']
    );
    return this;
  }

  public demandeLaRestitution(identifiant: string): ConstructeurActionsHATEOAS {
    this.pour({ contexte: 'aidant:acceder-aux-informations-utilisateur' })
      .restituerDiagnostic(identifiant)
      .modifierDiagnostic(identifiant);
    return this;
  }

  public demandeAide() {
    this.actions.set('demander-aide', demandeAide['demander-aide']);
    return this;
  }

  public afficherLesDiagnostics(
    idDiagnostics: string[]
  ): ConstructeurActionsHATEOAS {
    idDiagnostics.forEach((idDiagnostic) =>
      this.afficherDiagnostic(idDiagnostic as crypto.UUID)
    );
    return this;
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

  public ajoutReponseAuDiagnostic(
    identifiantDiagnostic: crypto.UUID
  ): ConstructeurActionsHATEOAS {
    this.afficherDiagnostic(identifiantDiagnostic);
    this.repondreDiagnostic(identifiantDiagnostic);
    return this;
  }

  public actionsPubliques(): ConstructeurActionsHATEOAS {
    this.pour({
      contexte: 'demande-devenir-aidant:demande-devenir-aidant',
    })
      .pour({ contexte: 'demande-etre-aide' })
      .pour({ contexte: 'se-connecter' });
    return this;
  }

  public demandeDevenirAidant(): ConstructeurActionsHATEOAS {
    this.actions.set(
      'envoyer-demande-devenir-aidant',
      demandeDevenirAidant['demande-devenir-aidant'][
        'envoyer-demande-devenir-aidant'
      ]
    );
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

  private afficherDiagnostic(
    idDiagnostic: crypto.UUID
  ): ConstructeurActionsHATEOAS {
    this.actions.set(`afficher-diagnostic-${idDiagnostic}`, {
      url: `/api/diagnostic/${idDiagnostic}/restitution`,
      methode: 'GET',
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
            {}
          )),
      },
    };
  };
}

export const constructeurActionsHATEOAS = (): ConstructeurActionsHATEOAS =>
  new ConstructeurActionsHATEOAS();
