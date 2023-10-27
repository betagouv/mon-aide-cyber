import { describe, expect, it } from 'vitest';
import { gestionnaireErreurGeneralisee } from '../../../src/api/gestionnaires/erreurs';
import { ConsignateurErreursMemoire } from '../../../src/infrastructure/adaptateurs/ConsignateurErreursMemoire';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { ErreurMAC } from '../../../src/domaine/erreurMAC';

describe("Gestionnaire d'erreur", () => {
  let codeRecu = 0;
  let corpsRecu = {};
  let erreurRecue = '';

  const fausseRequete: Request = {} as Request;
  const fausseReponse: Response = {
    status(code: number) {
      codeRecu = code;
    },
    json(corps: any) {
      corpsRecu = corps;
    },
  } as Response;
  const fausseSuite: NextFunction = (erreur: any) => {
    erreurRecue = erreur;
  };

  beforeEach(() => {
    codeRecu = 0;
    corpsRecu = {};
    erreurRecue = '';
  });

  it("génère une erreur 500 et ne consigne pas l'erreur", () => {
    const consignateurErreurs = new ConsignateurErreursMemoire();

    gestionnaireErreurGeneralisee(consignateurErreurs)(
      new Error('Quelque chose est arrivé'),
      fausseRequete,
      fausseReponse,
      fausseSuite,
    );

    expect(consignateurErreurs.tous()).toHaveLength(0);
    expect(codeRecu).toBe(500);
    expect(corpsRecu).toStrictEqual({
      message: "MonAideCyber n'est pas en mesure de traiter votre demande.",
    });
    expect(erreurRecue).toStrictEqual(new Error('Quelque chose est arrivé'));
  });

  it("génère une erreur 500 lorsqu'une erreur MAC non identifiée est reçue et ne consigne pas l'erreur", () => {
    const consignateurErreurs = new ConsignateurErreursMemoire();

    gestionnaireErreurGeneralisee(consignateurErreurs)(
      ErreurMAC.cree('Accès diagnostic', new Error('Erreur non identifiée')),
      fausseRequete,
      fausseReponse,
      fausseSuite,
    );

    expect(consignateurErreurs.tous()).toHaveLength(0);
    expect(codeRecu).toBe(500);
    expect(corpsRecu).toStrictEqual({
      message: "MonAideCyber n'est pas en mesure de traiter votre demande.",
    });
    expect(erreurRecue).toStrictEqual(
      ErreurMAC.cree('Accès diagnostic', new Error('Erreur non identifiée')),
    );
  });
});
