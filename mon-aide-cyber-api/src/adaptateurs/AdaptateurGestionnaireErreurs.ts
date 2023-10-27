import { ConsignateurErreurs } from './ConsignateurErreurs';
import { ErrorRequestHandler, RequestHandler } from 'express';

export interface AdaptateurGestionnaireErreurs {
  consignateur(): ConsignateurErreurs;

  controleurRequete(): RequestHandler;

  controleurErreurs(): ErrorRequestHandler;
}
