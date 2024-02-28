import { ConfigurationServeur } from '../serveur';
import express, { Response } from 'express';
import { RequeteUtilisateur } from './routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { ErreurMAC } from '../domaine/erreurMAC';

export const routesAPIProfil = (configuration: ConfigurationServeur) => {
  const routes = express.Router();
  const {
    entrepots,
    adaptateurDeVerificationDeSession: session,
    adaptateurDeVerificationDeCGU: cgu,
  } = configuration;

  routes.get(
    '/',
    session.verifie('Accède au profil'),
    cgu.verifie(),
    async (
      requete: RequeteUtilisateur,
      reponse: Response,
      suite: NextFunction,
    ) => {
      return entrepots
        .aidants()
        .lis(requete.identifiantUtilisateurCourant!)
        .then((aidant) => {
          const dateSignatureCGU = aidant.dateSignatureCGU;
          return reponse.status(200).json({
            nomPrenom: aidant.nomPrenom,
            dateSignatureCGU: dateSignatureCGU
              ? FournisseurHorloge.formateDate(dateSignatureCGU).date
              : '',
            identifiantConnexion: aidant.identifiantConnexion,
          });
        })
        .catch((erreur) => suite(ErreurMAC.cree('Accède au profil', erreur)));
    },
  );

  return routes;
};
