import { ConfigurationServeur } from '../../serveur';
import express from 'express';
import { CommandeAttribueDemandeAide } from '../../gestion-demandes/aide/CapteurCommandeAttribueDemandeAide';

export const routesAPIAidantRepondreAUneDemande = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();

  const { busCommande } = configuration;

  routes.post('/', async (_requete, reponse, _suite) => {
    const commandeAttribueDemandeAide: CommandeAttribueDemandeAide = {
      type: 'CommandeAttribueDemandeAide',
    };

    await busCommande.publie(commandeAttribueDemandeAide);

    return reponse.status(202).send();
  });

  return routes;
};
