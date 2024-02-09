import {
  Action,
  ActionReponseDiagnostic,
  Diagnostic,
  EntrepotDiagnostic,
  Reponse,
} from '../../domaine/diagnostic/Diagnostic.ts';
import { FormatLien, LienRoutage } from '../../domaine/LienRoutage.ts';
import { APIEntrepot } from './EntrepotsAPI.ts';
import { UUID } from '../../types/Types.ts';
import { Restitution } from '../../domaine/diagnostic/Restitution.ts';
import { RessourceActionRestituer } from 'mon-aide-cyber-api/src/api/representateurs/types.ts';
import { ParametresAPI } from '../../domaine/diagnostic/ParametresAPI.ts';

type RepresentationReponseDonnee = {
  valeur: string | null;
  reponses: { identifiant: string; reponses: string[] }[];
};
type Format = 'texte' | 'nombre' | undefined;
type RepresentationReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  questions?: RepresentationQuestion[];
  type?: { type: RepresentationTypeDeSaisie; format?: Format } | undefined;
};
type RepresentationQuestion = {
  identifiant: string;
  libelle: string;
  reponseDonnee: RepresentationReponseDonnee;
  reponsesPossibles: RepresentationReponsePossible[];
  type?: Exclude<RepresentationTypeDeSaisie, 'saisieLibre'>;
};
type RepresentationGroupes = {
  numero: number;
  questions: RepresentationQuestion[];
}[];
export type RepresentationTypeDeSaisie =
  | 'choixMultiple'
  | 'choixUnique'
  | 'saisieLibre'
  | 'liste';
type RepresentationThematique = {
  groupes: RepresentationGroupes;
};
type RepresentationReferentiel = {
  [clef: string]: RepresentationThematique;
};
type RepresentationDiagnostic = {
  identifiant: UUID;
  referentiel: RepresentationReferentiel;
  actions: Action[];
};

export class APIEntrepotDiagnostic
  extends APIEntrepot<Diagnostic>
  implements EntrepotDiagnostic
{
  constructor() {
    super('diagnostic');
  }

  lancer(parametresAPI: ParametresAPI): Promise<LienRoutage> {
    return super
      .persiste(parametresAPI)
      .then((reponse) => {
        const lien = reponse.headers.get('Link');
        return lien !== null
          ? new LienRoutage(lien as FormatLien)
          : Promise.reject(
              'Impossible de récupérer le lien vers le diagnostic',
            );
      })
      .catch((erreur) =>
        Promise.reject({
          message: `Lors de la création ou de la récupération du diagnostic pour les raisons suivantes : '${erreur}'`,
        }),
      );
  }

  repond(
    action: ActionReponseDiagnostic,
    reponseDonnee: Reponse,
  ): Promise<void> {
    const actionAMener = Object.entries(action).map(([thematique, action]) => ({
      chemin: thematique,
      ressource: action.ressource,
    }))[0];
    return fetch(actionAMener.ressource.url, {
      method: actionAMener.ressource.methode,
      body: JSON.stringify({
        chemin: actionAMener.chemin,
        identifiant: reponseDonnee.identifiantQuestion,
        reponse: reponseDonnee.reponseDonnee,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then();
  }

  protected transcris(
    json: Promise<RepresentationDiagnostic>,
  ): Promise<Diagnostic> {
    return json.then((corps) => {
      const referentiel = Object.entries(corps.referentiel).reduce(
        (accumulateur, [clef, thematique]) => {
          const groupes = thematique.groupes.flatMap((groupe) => {
            const questions = groupe.questions.map((question) => ({
              ...question,
              reponseDonnee: {
                valeur: question.reponseDonnee.valeur,
                reponses: question.reponseDonnee.reponses.map((rep) => ({
                  identifiant: rep.identifiant,
                  reponses: new Set(rep.reponses),
                })),
              },
            }));
            return { numero: groupe.numero, questions };
          });
          return {
            ...accumulateur,
            [clef]: { ...thematique, groupes },
          };
        },
        {},
      );
      return {
        ...corps,
        referentiel,
      };
    });
  }

  restitution(
    idDiagnostic: string,
    action?: RessourceActionRestituer,
  ): Promise<Restitution> {
    if (action) {
      return fetch(action.ressource.url, {
        method: action.ressource.methode,
        headers: { Accept: action.ressource.contentType },
      }).then((reponse) => {
        if (!reponse.ok) {
          return reponse.json().then((reponse) => Promise.reject(reponse));
        }
        if (reponse.headers.get('Content-Type') === 'application/pdf') {
          return reponse
            .blob()
            .then((blob) => window.open(URL.createObjectURL(blob)))
            .then();
        }
        return reponse.json();
      });
    }

    return fetch(`/api/diagnostic/${idDiagnostic}/restitution`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then((reponse) => {
      if (!reponse.ok) {
        return reponse.json().then((reponse) => Promise.reject(reponse));
      }
      return reponse.json();
    });
  }
}
