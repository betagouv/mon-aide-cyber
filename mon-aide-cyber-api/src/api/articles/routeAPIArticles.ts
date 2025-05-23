import { ConfigurationServeur } from '../../serveur';
import express, { Request, Response } from 'express';
import { Article } from '../../adaptateurs/AdaptateurCmsCrispMAC';

export const routesAPIArticles = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const { adaptateurCmsCrisp } = configuration;

  const articlesCrisp: Map<string, () => Promise<Article>> = new Map([
    ['guide-aidant-cyber', () => adaptateurCmsCrisp.recupereGuideAidantCyber()],
    [
      'promouvoir-diagnostic-cyber',
      () => adaptateurCmsCrisp.promouvoirDiagnosticCyber(),
    ],
  ]);

  routes.get(
    '/:article',
    async (requete: Request, reponse: Response<ReponseArticle>) => {
      const article = await articlesCrisp.get(requete.params.article)!();
      return reponse.status(200).json(article);
    }
  );

  return routes;
};
export type ReponseArticle = Article;
