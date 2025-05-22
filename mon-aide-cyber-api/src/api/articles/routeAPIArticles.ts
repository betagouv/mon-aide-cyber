import { ConfigurationServeur } from '../../serveur';
import express, { Request, Response } from 'express';
import { Article } from '../../adaptateurs/AdaptateurCmsCrispMAC';
import { constructeurActionsHATEOAS, ReponseHATEOAS } from '../hateoas/hateoas';

export const routesAPIArticles = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const { adaptateurCmsCrisp } = configuration;

  routes.get(
    '/:article',
    async (_requete: Request, reponse: Response<ReponseArticle>) => {
      const article: Article =
        await adaptateurCmsCrisp.recupereGuideAidantCyber();
      const actionsHATEOAS = {
        ...constructeurActionsHATEOAS().actionsPubliques().construis(),
      };
      return reponse.status(200).json({ ...actionsHATEOAS, ...article });
    }
  );

  return routes;
};
export type ReponseArticle = ReponseHATEOAS & Article;
