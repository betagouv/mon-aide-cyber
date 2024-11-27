import { Request, Response } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

const CINQ_MINUTES = 5 * 60 * 1000;
const CENT_APPELS = 100;
const VINGT_APPELS = 20;
const DIX_APPELS = 10;
const CINQ_APPELS = 5;

type Configuration<Limiteur extends { type: string }> = {
  [E in Limiteur as E['type']]: () => RateLimitRequestHandler;
};

type TypeLimiteur = {
  type: 'STANDARD' | 'AUTHENTIFICATION' | 'LIMITE' | 'TRES-LIMITE';
};

type Configurations = Configuration<TypeLimiteur>;

const conf: Configurations = {
  STANDARD: () => {
    const dureePeriodeConnexionMs =
      Number(process.env.MAC_LIMITEUR_TRAFFIC_DUREE_PERIODE_CONNEXIONS_MS) ||
      CINQ_MINUTES;
    const nombreMaximumDeConnexions =
      Number(
        process.env.MAC_LIMITEUR_TRAFFIC_NOMBRE_CONNEXIONS_MAXIMUM_PAR_PERIODE
      ) || CENT_APPELS;
    return adaptateurLimiteurTraffic(
      dureePeriodeConnexionMs,
      nombreMaximumDeConnexions
    );
  },
  AUTHENTIFICATION: (): RateLimitRequestHandler => {
    return adaptateurLimiteurTraffic(
      Number(
        process.env.MAC_LIMITEUR_TRAFFIC_AUTH_DUREE_PERIODE_CONNEXIONS_MS
      ) || CINQ_MINUTES,
      Number(
        process.env.MAC_LIMITEUR_TRAFFIC_AUTH_NOMBRE_CONNEXIONS_PAR_PERIODE
      ) || CINQ_APPELS
    );
  },
  LIMITE: function (): RateLimitRequestHandler {
    return adaptateurLimiteurTraffic(
      Number(
        process.env.MAC_LIMITEUR_TRAFFIC_LIMITE_DUREE_PERIODE_CONNEXIONS_MS
      ) || CINQ_MINUTES,
      Number(
        process.env
          .MAC_LIMITEUR_TRAFFIC_LIMITE_NOMBRE_CONNEXIONS_MAX_PAR_PERIODE
      ) || VINGT_APPELS
    );
  },
  'TRES-LIMITE': (): RateLimitRequestHandler => {
    return adaptateurLimiteurTraffic(
      Number(
        process.env.MAC_LIMITEUR_TRAFFIC_TRES_LIMITE_DUREE_PERIODE_CONNEXIONS_MS
      ) || CINQ_MINUTES,
      Number(
        process.env
          .MAC_LIMITEUR_TRAFFIC_TRES_LIMITE_DUREE_PERIODE_CON_MAX_PERIODE
      ) || DIX_APPELS
    );
  },
};

const adaptateurLimiteurTraffic = (
  dureePeriodeConnexionMs: number,
  nombreMaximumDeConnexions: number
): RateLimitRequestHandler =>
  rateLimit({
    windowMs: dureePeriodeConnexionMs,
    max: nombreMaximumDeConnexions,
    message:
      "Vous avez atteint le nombre maximal d'appel à MonAideCyber. Veuillez réessayer ultérieurement.",
    standardHeaders: true,
    keyGenerator: (requete: Request, __: Response) =>
      requete.headers['x-real-ip'] as string,
    legacyHeaders: false,
    skip: (requete: Request, __) =>
      ['/assets/', '/fontes/', '/images/'].some((req) =>
        requete.path.startsWith(req)
      ),
    handler: (_requete, reponse, _next, options) =>
      reponse.status(options.statusCode).json({ message: options.message }),
  });

export const adaptateurConfigurationLimiteurTraffic = (
  typeConfiguration: 'STANDARD' | 'AUTHENTIFICATION' | 'LIMITE' | 'TRES-LIMITE'
): RateLimitRequestHandler => conf[typeConfiguration]();
