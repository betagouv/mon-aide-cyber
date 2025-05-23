import { ConfigurationServeur } from '../../serveur';
import express, { Request, Response } from 'express';
import { Article } from '../../adaptateurs/AdaptateurCmsCrispMAC';

export const routesAPIArticles = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const { adaptateurCmsCrisp } = configuration;

  routes.get(
    '/:article',
    async (_requete: Request, reponse: Response<ReponseArticle>) => {
      const article = await adaptateurCmsCrisp.recupereGuideAidantCyber();
      return reponse.status(200).json(article);
    }
  );

  return routes;
};
export type ReponseArticle = Article;
