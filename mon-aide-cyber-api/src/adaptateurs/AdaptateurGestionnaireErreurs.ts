import { ConsignateurErreurs } from './ConsignateurErreurs';
import { ErrorRequestHandler } from 'express';

export interface AdaptateurGestionnaireErreurs {
  initialise(): void;
  consignateur(): ConsignateurErreurs;

  controleurErreurs(): ErrorRequestHandler;
}
