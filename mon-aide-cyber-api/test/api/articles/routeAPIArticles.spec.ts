import { beforeEach, describe, expect, it } from 'vitest';
import { executeRequete } from '../executeurRequete';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { AdaptateurCmsCrispMACMemoire } from '../../adaptateurs/AdaptateurCmsCrispMACMemoire';
import { unArticle } from '../../constructeurs/constructeurArticle';
import { ReponseArticle } from '../../../src/api/articles/routeAPIArticles';

describe('Articles', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  it('Retourne l’article fourni en paramètre', async () => {
    (
      testeurMAC.adaptateurCmsCrisp as AdaptateurCmsCrispMACMemoire
    ).retourneArticle(
      unArticle()
        .avecLeTitre('Un titre')
        .avecLaDescription('Une description')
        .avecLeContenu('un contenu')
        .construis()
    );
    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      '/api/articles/un-article'
    );

    expect(reponse.statusCode).toBe(200);
    expect(await reponse.json()).toStrictEqual<ReponseArticle>({
      titre: 'Un titre',
      contenu: 'un contenu',
      description: 'Une description',
      tableDesMatieres: [],
    });
  });
});
