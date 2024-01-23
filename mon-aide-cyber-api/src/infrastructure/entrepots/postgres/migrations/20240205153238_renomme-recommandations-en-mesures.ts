import { Knex } from 'knex';
import { ReferentielDeMesures } from '../../../../diagnostic/ReferentielDeMesures';
import { RepresentationReferentiel } from '../../../../api/representateurs/types';
import crypto from 'crypto';
import { Restitution } from '../../../../diagnostic/Diagnostic';
import { Referentiel } from '../../../../diagnostic/Referentiel';

type Valeur = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | null | undefined;

type RecommandationPriorisee = {
  titre: string;
  pourquoi: string;
  comment: string;
  valeurObtenue: Valeur;
  priorisation: number;
};

type Recommandation = {
  recommandationsPrioritaires: RecommandationPriorisee[];
  autresRecommandations: RecommandationPriorisee[];
};

type MesurePriorisee = RecommandationPriorisee;

type Mesures = {
  mesuresPrioritaires: MesurePriorisee[];
  autresMesures: MesurePriorisee[];
};

type RepresentationRestitution = {
  indicateurs?: Indicateurs;
  recommandations?: Recommandation;
  mesures?: Mesures;
};

type RepresentationDiagnostic = {
  dateCreation: Date;
  dateDerniereModification: Date;
  identifiant: crypto.UUID;
  referentiel: Referentiel;
  restitution?: RepresentationRestitution;
  mesures: ReferentielDeMesures;
  tableauDesRecommandations?: ReferentielDeMesures;
};

export async function up(knex: Knex): Promise<void> {
  knex('diagnostics').then(
    (
      lignes: {
        id: crypto.UUID;
        donnees: {
          restitution?: RepresentationRestitution;
          tableauDesRecommandations: ReferentielDeMesures;
        };
      }[],
    ) => {
      const misesAJour = lignes.map((ligne) => {
        const donnees: RepresentationDiagnostic = {
          ...ligne.donnees,
        } as RepresentationDiagnostic;

        donnees.mesures = donnees.tableauDesRecommandations!;

        delete donnees['tableauDesRecommandations'];

        if (donnees.restitution) {
          const mesuresRestitution = { ...donnees.restitution.recommandations };

          donnees.restitution.mesures = {
            mesuresPrioritaires:
              mesuresRestitution.recommandationsPrioritaires || [],
            autresMesures: mesuresRestitution.autresRecommandations || [],
          };

          delete donnees.restitution.recommandations;
        }

        return knex('diagnostics').where('id', ligne.id).update({
          donnees,
        });
      });

      return Promise.all(misesAJour);
    },
  );
}

type Indicateurs = {
  [thematique: string]: { moyennePonderee: number };
};

export async function down(knex: Knex): Promise<void> {
  knex('diagnostics').then(
    (
      lignes: {
        id: crypto.UUID;
        donnees: {
          dateCreation: Date;
          dateDerniereModification: Date;
          identifiant: crypto.UUID;
          referentiel: RepresentationReferentiel;
          mesures: ReferentielDeMesures;
          restitution: Restitution;
        };
      }[],
    ) => {
      const misesAJour = lignes.map((ligne) => {
        const donnees = ligne.donnees;
        const { mesures, restitution, ...donneesSansMesure } = donnees;

        if (restitution) {
          const {
            mesures: mesuresRestituees,
            ...restitutionSansMesuresRestituees
          } = restitution;

          return knex('diagnostics')
            .where('id', ligne.id)
            .update({
              donnees: {
                ...donneesSansMesure,
                tableauDesRecommandations: mesures,
                restitution: {
                  autresRecommandations: mesuresRestituees?.autresMesures || [],
                  recommandationsPrioritaires:
                    mesuresRestituees?.mesuresPrioritaires || [],
                  restitutionSansMesuresRestituees,
                },
              },
            });
        }

        return knex('diagnostics')
          .where('id', ligne.id)
          .update({
            donnees: {
              ...donneesSansMesure,
              tableauDesRecommandations: mesures,
            },
          });
      });

      return Promise.all(misesAJour);
    },
  );
}
