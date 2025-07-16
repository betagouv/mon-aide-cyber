import { ConfigurationServeur } from '../../serveur';
import express, { Router } from 'express';
import { routesAPILiveStorm } from './routesAPIWebhooks.livestorm';
import { routesAPITally } from './routesAPIWebhooks.tally';

export const routesAPIWebhooks = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use('/tally', routesAPITally(configuration));
  routes.use('/livestorm', routesAPILiveStorm(configuration));

  return routes;
};
