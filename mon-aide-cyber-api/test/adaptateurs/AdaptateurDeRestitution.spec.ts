import { describe, it } from 'vitest';
import { AdaptateurDeRestitution } from '../../src/adaptateurs/AdaptateurDeRestitution';
import {
  Indicateurs,
  RecommandationPriorisee,
} from '../../src/diagnostic/Diagnostic';
import { ContenuHtml } from '../../src/infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';
import { Entrepots } from '../../src/domaine/Entrepots';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { Restitution } from '../../src/restitution/Restitution';
import {
  desInformationsDeRestitution,
  uneRestitution,
} from '../constructeurs/constructeurRestitution';
import { uneRecommandationPriorisee } from '../constructeurs/constructeurRecommandation';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import crypto from 'crypto';

describe('Adaptateur de Restitution', () => {
  beforeEach(() =>
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2023-02-04T10:30+01:00')),
    ),
  );
  const entrepots: Entrepots = new EntrepotsMemoire();
  const adaptateurRestitution =
    new (class extends AdaptateurDeRestitution<Buffer> {
      protected genere(
        htmlRecommandations: Promise<ContenuHtml>[],
      ): Promise<Buffer> {
        return Promise.all(htmlRecommandations).then((htmls) => {
          const resultat: ContenuHtml[] = [];

          htmls.forEach((html) => {
            resultat.push(html);
          });

          return Buffer.from(JSON.stringify(resultat), 'utf-8');
        });
      }

      protected genereInformations(
        restitution: Restitution,
      ): Promise<ContenuHtml> {
        return Promise.resolve({
          corps: JSON.stringify(restitution.informations),
          entete: '',
          piedPage: '',
        });
      }

      protected genereIndicateurs(
        indicateurs: Indicateurs | undefined,
      ): Promise<ContenuHtml> {
        const resultat: ContenuHtml = {
          corps: '',
          entete: 'entete indicateur',
          piedPage: 'piedPage indicateur',
        };

        Object.entries(indicateurs || {})?.forEach(
          ([thematique, indicateur]) => {
            resultat.corps += JSON.stringify({ thematique, indicateur });
          },
        );

        return Promise.resolve(resultat);
      }

      protected genereAutresMesures(
        autresRecommandations: RecommandationPriorisee[] | undefined,
      ): Promise<ContenuHtml> {
        const resultat: ContenuHtml = {
          corps: '',
          entete: 'entete',
          piedPage: 'piedPage',
        };

        autresRecommandations?.forEach((reco) => {
          resultat.corps += JSON.stringify(reco);
        });

        return Promise.resolve(resultat);
      }

      protected genereMesuresPrioritaires(
        recommandationsPrioritaires: RecommandationPriorisee[] | undefined,
      ): Promise<ContenuHtml> {
        const resultat: ContenuHtml = {
          corps: '',
          entete: 'entete',
          piedPage: 'piedPage',
        };

        recommandationsPrioritaires?.forEach((reco) => {
          resultat.corps += JSON.stringify(reco);
        });

        return Promise.resolve(resultat);
      }
    })();

  it('génère la restitution sans annexe', async () => {
    const restitution = uneRestitution()
      .avecIdentifiant(crypto.randomUUID())
      .avecInformations(
        desInformationsDeRestitution()
          .avecSecteurActivite('Loisir')
          .avecZoneGeographique('Ile de France, Paris')
          .construis(),
      )
      .avecIndicateurs('thematique', 0)
      .avecRecommandations([
        uneRecommandationPriorisee()
          .avecTitre('reco 1')
          .avecPourquoi('parce-que')
          .avecComment('comme ça')
          .avecPriorisation(3)
          .avecValeurObtenue(0)
          .construis(),
      ])
      .construis();
    entrepots.restitution().persiste(restitution);

    expect(
      JSON.parse(
        (await adaptateurRestitution.genereRestitution(restitution)).toString(),
      ),
    ).toMatchSnapshot();
  });

  it('génère la restitution avec annexe', async () => {
    const recommandationPriorisee = uneRecommandationPriorisee()
      .avecTitre('reco 2')
      .avecPourquoi('parce-que')
      .avecComment('comme ça')
      .avecPriorisation(2)
      .avecValeurObtenue(0)
      .construis();
    const restitution = uneRestitution()
      .avecIdentifiant(crypto.randomUUID())
      .avecInformations(
        desInformationsDeRestitution()
          .avecSecteurActivite('Administration')
          .avecZoneGeographique('Bretagne, Finistère')
          .construis(),
      )
      .avecIndicateurs('thematique', 0)
      .avecRecommandations(
        Array(7)
          .fill(recommandationPriorisee, 0, 6)
          .fill(
            uneRecommandationPriorisee()
              .avecTitre('reco 1')
              .avecPourquoi('parce-que')
              .avecComment('comme ça')
              .avecPriorisation(3)
              .avecValeurObtenue(0)
              .construis(),
            6,
          ),
      )
      .construis();
    entrepots.restitution().persiste(restitution);

    expect(
      JSON.parse(
        (await adaptateurRestitution.genereRestitution(restitution)).toString(),
      ),
    ).toMatchSnapshot();
  });
});
