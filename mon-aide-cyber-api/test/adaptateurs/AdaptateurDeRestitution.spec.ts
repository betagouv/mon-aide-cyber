import { describe, it } from 'vitest';
import { AdaptateurDeRestitution } from '../../src/adaptateurs/AdaptateurDeRestitution';
import { Indicateurs, MesurePriorisee } from '../../src/diagnostic/Diagnostic';
import { ContenuHtml } from '../../src/infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';
import { Entrepots } from '../../src/domaine/Entrepots';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { Restitution } from '../../src/restitution/Restitution';
import {
  desInformationsDeRestitution,
  uneRestitution,
} from '../constructeurs/constructeurRestitution';
import { uneMesurePriorisee } from '../constructeurs/constructeurMesure';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import crypto from 'crypto';

describe('Adaptateur de Restitution', () => {
  beforeEach(() =>
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2023-02-04T10:30+01:00'))
    )
  );
  const entrepots: Entrepots = new EntrepotsMemoire();
  const adaptateurRestitution =
    new (class extends AdaptateurDeRestitution<Buffer> {
      genereHtml(_: string, __: any): Promise<ContenuHtml> {
        return Promise.resolve({} as ContenuHtml);
      }
      protected genere(htmlMesures: Promise<ContenuHtml>[]): Promise<Buffer> {
        return Promise.all(htmlMesures).then((htmls) => {
          const resultat: ContenuHtml[] = [];

          htmls.forEach((html) => {
            resultat.push(html);
          });

          return Buffer.from(JSON.stringify(resultat), 'utf-8');
        });
      }

      protected genereInformations(
        restitution: Restitution
      ): Promise<ContenuHtml> {
        return Promise.resolve({
          corps: JSON.stringify(restitution.informations),
          entete: '',
          piedPage: '',
        });
      }

      protected genereIndicateurs(
        indicateurs: Indicateurs | undefined
      ): Promise<ContenuHtml> {
        const resultat: ContenuHtml = {
          corps: '',
          entete: 'entete indicateur',
          piedPage: 'piedPage indicateur',
        };

        Object.entries(indicateurs || {})?.forEach(
          ([thematique, indicateur]) => {
            resultat.corps += JSON.stringify({ thematique, indicateur });
          }
        );

        return Promise.resolve(resultat);
      }

      protected genereAutresMesures(
        autresMesures: MesurePriorisee[] | undefined
      ): Promise<ContenuHtml> {
        const resultat: ContenuHtml = {
          corps: '',
          entete: 'entete',
          piedPage: 'piedPage',
        };

        autresMesures?.forEach((mesure) => {
          resultat.corps += JSON.stringify(mesure);
        });

        return Promise.resolve(resultat);
      }

      protected genereMesuresPrioritaires(
        mesuresPrioritaires: MesurePriorisee[] | undefined
      ): Promise<ContenuHtml> {
        const resultat: ContenuHtml = {
          corps: '',
          entete: 'entete',
          piedPage: 'piedPage',
        };

        mesuresPrioritaires?.forEach((mesure) => {
          resultat.corps += JSON.stringify(mesure);
        });

        return Promise.resolve(resultat);
      }
    })(new Map());

  it('génère la restitution sans annexe', async () => {
    const restitution = uneRestitution()
      .avecIdentifiant(crypto.randomUUID())
      .avecInformations(
        desInformationsDeRestitution()
          .avecSecteurActivite('Loisir')
          .avecZoneGeographique('Ile de France, Paris')
          .construis()
      )
      .avecIndicateurs('thematique', 0)
      .avecMesures([
        uneMesurePriorisee()
          .avecTitre('mesure 1')
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
        (await adaptateurRestitution.genereRestitution(restitution)).toString()
      )
    ).toMatchSnapshot();
  });

  it('génère la restitution avec annexe', async () => {
    const mesurePrioritaire = uneMesurePriorisee()
      .avecTitre('mesure 2')
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
          .construis()
      )
      .avecIndicateurs('thematique', 0)
      .avecMesures(
        Array(7)
          .fill(mesurePrioritaire, 0, 6)
          .fill(
            uneMesurePriorisee()
              .avecTitre('mesure 1')
              .avecPourquoi('parce-que')
              .avecComment('comme ça')
              .avecPriorisation(3)
              .avecValeurObtenue(0)
              .construis(),
            6
          )
      )
      .construis();
    entrepots.restitution().persiste(restitution);

    expect(
      JSON.parse(
        (await adaptateurRestitution.genereRestitution(restitution)).toString()
      )
    ).toMatchSnapshot();
  });

  it("génère une restitution en conservant l'ordre des thématiques", async () => {
    const restitution = uneRestitution()
      .avecIdentifiant(crypto.randomUUID())
      .avecInformations(
        desInformationsDeRestitution()
          .avecSecteurActivite('Administration')
          .avecZoneGeographique('Bretagne, Finistère')
          .construis()
      )
      .avecIndicateurs('reaction', 2)
      .avecIndicateurs('gouvernance', 2.5)
      .avecIndicateurs('securiteposte', 3)
      .avecIndicateurs('SecuriteAcces', 2.2)
      .avecIndicateurs('securiteinfrastructure', 4)
      .avecIndicateurs('sensibilisation', 2.5)
      .construis();
    entrepots.restitution().persiste(restitution);

    expect(
      JSON.parse(
        (await adaptateurRestitution.genereRestitution(restitution)).toString()
      )
    ).toMatchSnapshot();
  });
});
