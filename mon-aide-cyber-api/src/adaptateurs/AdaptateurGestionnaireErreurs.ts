import { ConsignateurErreurs } from './ConsignateurErreurs';
import { ErrorRequestHandler, Express, RequestHandler } from 'express';

export interface AdaptateurGestionnaireErreurs {
  initialise(applicationExpress: Express): void;
  consignateur(): ConsignateurErreurs;

  controleurRequete(): RequestHandler;

  controleurErreurs(): ErrorRequestHandler;
}
