import { Knex } from 'knex';
import crypto from 'crypto';
import { ReferentielDiagnostic } from '../../../../diagnostic/Diagnostic';

type NiveauDeRecommandation = {
  titre: string;
  pourquoi: string;
  comment: string;
};

type ObjetDeRecommandation = {
  niveau1: NiveauDeRecommandation;
  niveau2?: NiveauDeRecommandation;
  priorisation: number;
};

type TableauDeRecommandations = {
  [identifiantQuestion: string]: ObjetDeRecommandation;
};

type Valeur = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | null | undefined;

type RecommandationPriorisee = {
  titre: string;
  pourquoi: string;
  comment: string;
  valeurObtenue: Valeur;
  priorisation: number;
};

type Indicateurs = {
  [thematique: string]: { moyennePonderee: number };
};

type Restitution = {
  indicateurs?: Indicateurs;
  recommandations?: Recommandations;
};

type Recommandations = {
  recommandationsPrioritaires: RecommandationPriorisee[];
  autresRecommandations: RecommandationPriorisee[];
};

export async function up(knex: Knex): Promise<void> {
  knex('diagnostics').then(
    (
      lignes: {
        id: crypto.UUID;
        donnees: {
          dateCreation: Date;
          dateDerniereModification: Date;
          identifiant: crypto.UUID;
          recommandations?: Recommandations;
          restitution?: Restitution;
          referentiel: ReferentielDiagnostic;
          tableauDesRecommandations: TableauDeRecommandations;
        };
      }[],
    ) => {
      const misesAJour = lignes.map((ligne) => {
        if (ligne.donnees.recommandations) {
          const { recommandations, ...reste } = ligne.donnees;
          ligne.donnees = {
            restitution: { recommandations },
            ...reste,
          };
        }
        return knex('diagnostics')
          .where('id', ligne.id)
          .update({ donnees: ligne.donnees });
      });
      return Promise.all(misesAJour);
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(__: Knex): Promise<void> {}
