import { beforeEach, describe, expect, it } from 'vitest';
import { executeRequete } from '../executeurRequete';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { AdaptateurCmsCrispMACMemoire } from '../../adaptateurs/AdaptateurCmsCrispMACMemoire';
import { unArticle } from '../../constructeurs/constructeurArticle';
import { ReponseArticle } from '../../../src/api/articles/routeAPIArticles';
import { Article } from '../../../src/adaptateurs/AdaptateurCmsCrispMAC';

type ParametresDeTest = {
  nomArticle: string;
  articleAttendu: Article;
};

describe('Articles', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  const retourneArticleAttendu = (nomArticle: string, article: Article) => {
    (
      testeurMAC.adaptateurCmsCrisp as AdaptateurCmsCrispMACMemoire
    ).retourneArticle(nomArticle, article);
  };

  it.each<ParametresDeTest>([
    {
      nomArticle: 'guide-aidant-cyber',
      articleAttendu: unArticle()
        .avecLeTitre('Un titre')
        .avecLaDescription('Une description')
        .avecLeContenu('Un contenu')
        .construis(),
    },
    {
      nomArticle: 'promouvoir-diagnostic-cyber',
      articleAttendu: unArticle()
        .avecLeTitre('Promouvoir')
        .avecLaDescription('Promouvoir le diagnostic')
        .avecLeContenu('Un contenu de promotion')
        .construis(),
    },
    {
      nomArticle: 'promouvoir-communaute-aidants-cyber',
      articleAttendu: unArticle()
        .avecLeTitre('Promouvoir')
        .avecLaDescription('Promouvoir la communauté d’Aidants')
        .avecLeContenu('Un contenu de promotion')
        .construis(),
    },
    {
      nomArticle: 'relais-associatifs',
      articleAttendu: unArticle()
        .avecLeTitre('Relais associatifs')
        .avecLaDescription('Ler relais associatifs')
        .avecLeContenu('Un contenu avec des relais associatifs')
        .construis(),
    },
  ])(
    'Retourne l’article $nomArticle fourni en paramètre',
    async ({ nomArticle, articleAttendu }) => {
      retourneArticleAttendu(nomArticle, articleAttendu);
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/articles/${nomArticle}`
      );

      expect(reponse.statusCode).toBe(200);
      const contenu = await reponse.json();
      expect(contenu).toStrictEqual<ReponseArticle>(articleAttendu);
    }
  );

  it('Retourne une erreur HTTP 404 si l’article n’existe pas', async () => {
    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      `/api/articles/article-inconnu`
    );

    expect(reponse.statusCode).toBe(404);
    const contenu = await reponse.json();
    expect(contenu).toStrictEqual<{ message: string }>({
      message: 'L’article demandé n’est pas disponible.',
    });
  });
});
