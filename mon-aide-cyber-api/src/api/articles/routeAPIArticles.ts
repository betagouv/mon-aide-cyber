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
    [
      'promouvoir-communaute-aidants-cyber',
      () => adaptateurCmsCrisp.promouvoirCommunauteAidantsCyber(),
    ],
    ['relais-associatifs', () => adaptateurCmsCrisp.relaisAssociatifs()],
  ]);

  routes.get(
    '/:article',
    async (
      requete: Request,
      reponse: Response<ReponseArticle | { message: string }>
    ) => {
      const appelCrisp: (() => Promise<Article>) | undefined =
        articlesCrisp.get(requete.params.article);

      if (typeof appelCrisp !== 'function') {
        return reponse.status(404).json({
          message: 'L’article demandé n’est pas disponible.',
        });
      }

      const article = await appelCrisp();
      return reponse.status(200).json(article);
    }
  );

  return routes;
};
export type ReponseArticle = Article;
