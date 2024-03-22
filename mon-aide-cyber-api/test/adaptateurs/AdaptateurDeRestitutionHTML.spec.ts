import { describe, it } from 'vitest';

import { unAdaptateurDeRestitutionHTML } from './ConstructeurAdaptateurRestitutionHTML';
import {
  AdaptateurDeRestitutionHTML,
  RestitutionHTML,
} from '../../src/adaptateurs/AdaptateurDeRestitutionHTML';
import { Entrepots } from '../../src/domaine/Entrepots';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import {
  desInformationsDeRestitution,
  uneRestitution,
} from '../constructeurs/constructeurRestitution';
import { uneMesurePriorisee } from '../constructeurs/constructeurMesure';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import crypto from 'crypto';

describe('Adapatateur de Restitution HTML', () => {
  const entrepots: Entrepots = new EntrepotsMemoire();

  describe('genère la restitution', () => {
    it('intègre les informations', async () => {
      const restitution = uneRestitution()
        .avecIdentifiant(crypto.randomUUID())
        .avecInformations(desInformationsDeRestitution().construis())
        .construis();
      entrepots.restitution().persiste(restitution);
      const adaptateurDeRestitutionHTML = unAdaptateurDeRestitutionHTML()
        .avecMesuresPrioritaires('une mesure prioritaire')
        .construis();

      const restitutionHTML =
        await adaptateurDeRestitutionHTML.genereRestitution(restitution);

      expect(restitutionHTML).toStrictEqual<RestitutionHTML>({
        autresMesures: '',
        indicateurs: '',
        informations: JSON.stringify(restitution.informations),
        mesuresPrioritaires: 'une mesure prioritaire',
      });
    });

    it('intègre des mesures prioritaires', async () => {
      const restitution = uneRestitution()
        .avecIdentifiant(crypto.randomUUID())
        .avecMesures([uneMesurePriorisee().construis()])
        .construis();
      entrepots.restitution().persiste(restitution);

      const adaptateurDeRestitutionHTML = unAdaptateurDeRestitutionHTML()
        .avecMesuresPrioritaires('une mesure prioritaire')
        .construis();

      const restitutionHTML =
        await adaptateurDeRestitutionHTML.genereRestitution(restitution);

      expect(restitutionHTML).toStrictEqual<RestitutionHTML>({
        autresMesures: '',
        indicateurs: '',
        informations: JSON.stringify(restitution.informations),
        mesuresPrioritaires: 'une mesure prioritaire',
      });
    });

    it('intègre un indicateur', async () => {
      const restitution = uneRestitution()
        .avecIdentifiant(crypto.randomUUID())
        .avecIndicateurs('thematique', 2)
        .construis();
      entrepots.restitution().persiste(restitution);

      const adaptateurDeRestitutionHTML = unAdaptateurDeRestitutionHTML()
        .avecIndicateurs("un graphe d'indicateurs")
        .construis();

      const restitutionHTML =
        await adaptateurDeRestitutionHTML.genereRestitution(restitution);

      expect(restitutionHTML).toStrictEqual<RestitutionHTML>({
        autresMesures: '',
        indicateurs: "un graphe d'indicateurs",
        informations: JSON.stringify(restitution.informations),
        mesuresPrioritaires: '',
      });
    });

    it('intègre les autres mesures', async () => {
      const adaptateurDeRestitutionHTML = unAdaptateurDeRestitutionHTML()
        .avecAutresMesures('une mesure non prioritaire')
        .construis();
      const mesurePriorisee = uneMesurePriorisee().construis();
      const restitution = uneRestitution()
        .avecIdentifiant(crypto.randomUUID())
        .avecMesures(Array(7).fill(mesurePriorisee))
        .construis();
      entrepots.restitution().persiste(restitution);

      const restitutionHTML =
        await adaptateurDeRestitutionHTML.genereRestitution(restitution);

      expect(restitutionHTML).toStrictEqual<RestitutionHTML>({
        autresMesures: 'une mesure non prioritaire',
        indicateurs: '',
        informations: JSON.stringify(restitution.informations),
        mesuresPrioritaires: '',
      });
    });
  });

  it('représente les informations du diagnostic', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-06-01T14:30:00+01:00')),
    );
    const restitution = uneRestitution()
      .avecIdentifiant('63a5fba6-efe0-4da1-ab6f-45d4cb330938')
      .avecIndicateurs('thematique', 0)
      .avecInformations(
        desInformationsDeRestitution()
          .avecSecteurActivite('')
          .avecZoneGeographique('')
          .construis(),
      )
      .avecMesures([])
      .construis();
    await entrepots.restitution().persiste(restitution);

    const informations = await new AdaptateurDeRestitutionHTML(
      new Map(),
    ).genereRestitution(restitution);

    expect(informations.informations).toMatchSnapshot();
  });
});
