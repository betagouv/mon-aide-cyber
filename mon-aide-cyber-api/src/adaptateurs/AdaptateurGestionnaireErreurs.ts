import { ConsignateurErreurs } from "./ConsignateurErreurs";
import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";

export type ControleurGestionnaireErreurs = (
  erreur: Error,
  requete: Request,
  reponse: Response,
  suite: NextFunction,
) => void;

export interface AdaptateurGestionnaireErreurs {
  consignateur(): ConsignateurErreurs;

  controleurRequete(): ControleurGestionnaireErreurs;

  controleurErreurs(): ControleurGestionnaireErreurs;
}
