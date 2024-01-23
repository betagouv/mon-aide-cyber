import { Knex } from 'knex';
import { RepresentationReferentiel } from '../../../../api/representateurs/types';
import { ReferentielDeMesures } from '../../../../diagnostic/ReferentielDeMesures';
import { Mesures, Restitution } from '../../../../diagnostic/Diagnostic';
import crypto from 'crypto';

function remplaceRecommandationsParMesures(chemin: string) {
  return chemin.replace('recommandations', 'mesures');
}

function metAJourMesuresRestitution({
  autresMesures,
  mesuresPrioritaires,
}: Mesures): Mesures {
  return {
    autresMesures: autresMesures.map(({ comment, pourquoi, ...mesure }) => {
      return {
        comment: remplaceRecommandationsParMesures(comment),
        pourquoi: remplaceRecommandationsParMesures(pourquoi),
        ...mesure,
      };
    }),
    mesuresPrioritaires: mesuresPrioritaires.map(
      ({ comment, pourquoi, ...mesure }) => {
        return {
          comment: remplaceRecommandationsParMesures(comment),
          pourquoi: remplaceRecommandationsParMesures(pourquoi),
          ...mesure,
        };
      },
    ),
  };
}

function metMesuresReferentielAJour(mesures: ReferentielDeMesures) {
  return Object.fromEntries(
    Object.entries(mesures).map(([identifiantQuestion, mesure]) => {
      const niveau2 = mesure.niveau2;

      if (niveau2) {
        return [
          identifiantQuestion,
          {
            niveau1: {
              titre: mesure.niveau1.titre,
              pourquoi: remplaceRecommandationsParMesures(
                mesure.niveau1.pourquoi,
              ),
              comment: remplaceRecommandationsParMesures(
                mesure.niveau1.comment,
              ),
            },
            niveau2: {
              titre: niveau2.titre,
              pourquoi: remplaceRecommandationsParMesures(niveau2.pourquoi),
              comment: remplaceRecommandationsParMesures(niveau2.comment),
            },
            priorisation: mesure.priorisation,
          },
        ];
      }

      return [
        identifiantQuestion,
        {
          niveau1: {
            titre: mesure.niveau1.titre,
            pourquoi: remplaceRecommandationsParMesures(
              mesure.niveau1.pourquoi,
            ),
            comment: remplaceRecommandationsParMesures(mesure.niveau1.comment),
          },
          priorisation: mesure.priorisation,
        },
      ];
    }),
  );
}

export async function up(knex: Knex): Promise<void> {
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
        const { mesures, restitution, ...donneesSansMesureNiRestitution } =
          donnees;

        if (restitution) {
          return knex('diagnostics')
            .where('id', ligne.id)
            .update({
              donnees: {
                mesures: metMesuresReferentielAJour(mesures),
                restitution: {
                  mesures: {
                    ...(restitution.mesures
                      ? metAJourMesuresRestitution(restitution.mesures)
                      : {}),
                  },
                  indicateurs: restitution.indicateurs,
                },
                ...donneesSansMesureNiRestitution,
              },
            });
        } else {
          return knex('diagnostics')
            .where('id', ligne.id)
            .update({
              donnees: {
                mesures: metMesuresReferentielAJour(mesures),
                ...donneesSansMesureNiRestitution,
              },
            });
        }
      });

      return Promise.all(misesAJour);
    },
  );
}

export async function down(_: Knex): Promise<void> {}
