import { describe, expect, it } from 'vitest';
import { gestionnaireErreurGeneralisee } from '../../../src/api/gestionnaires/erreurs';
import { ConsignateurErreursMemoire } from '../../../src/infrastructure/adaptateurs/ConsignateurErreursMemoire';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { ErreurMAC } from '../../../src/domaine/erreurMAC';
import {
  ErreurAuthentification,
  ErreurFinalisationCompte,
} from '../../../src/authentification/Aidant';
import { ErreurAccesRefuse } from '../../../src/adaptateurs/AdaptateurDeVerificationDeSession';
import { CorpsRequeteAuthentification } from '../../../src/api/routesAPIAuthentification';
import { CorpsRequeteFinalisationCompte } from '../../../src/api/routesAPIUtilisateur';

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

  it("consigne l'erreur en cas d'authentification erronée", () => {
    const consignateurErreurs = new ConsignateurErreursMemoire();
    const corpsAuthentification: CorpsRequeteAuthentification = {
      identifiant: 'jean',
      motDePasse: 'abc123',
    };
    fausseRequete.body = corpsAuthentification;

    gestionnaireErreurGeneralisee(consignateurErreurs)(
      ErreurMAC.cree(
        "Demande d'Authentification",
        new ErreurAuthentification(new Error('Quelque chose est arrivé')),
      ),
      fausseRequete,
      fausseReponse,
      fausseSuite,
    );

    expect(consignateurErreurs.tous()).toHaveLength(1);
    expect(fausseRequete.body).toStrictEqual<CorpsRequeteAuthentification>({
      identifiant: 'jean',
      motDePasse: '<MOT_DE_PASSE_OBFUSQUE/>',
    });
  });

  it("génère une erreur 403 lorsqu'une erreur MAC 'Accès ressource protégée' est reçue et consigne l'erreur avec le détail", () => {
    const consignateurErreurs = new ConsignateurErreursMemoire();

    const messageInterne = "une explication de l'erreur pour le développeur";
    gestionnaireErreurGeneralisee(consignateurErreurs)(
      ErreurMAC.cree(
        'Ajout réponse au diagnostic',
        new ErreurAccesRefuse(messageInterne),
      ),
      fausseRequete,
      fausseReponse,
      fausseSuite,
    );

    expect(
      (consignateurErreurs.tous()[0] as ErreurMAC).erreurOriginelle.message,
    ).toStrictEqual(messageInterne);
    expect(codeRecu).toBe(403);
    expect(corpsRecu).toStrictEqual({
      message: "L'accès à la ressource est interdit.",
    });
  });

  it("consigne l'erreur en cas de finalisation de compte erronée", () => {
    const consignateurErreurs = new ConsignateurErreursMemoire();
    const corpsAuthentification: CorpsRequeteFinalisationCompte = {
      cguSignees: true,
      motDePasse: 'abc123',
    };
    fausseRequete.body = corpsAuthentification;

    gestionnaireErreurGeneralisee(consignateurErreurs)(
      ErreurMAC.cree(
        'Finalise la création du compte',
        new ErreurFinalisationCompte('Quelque chose est arrivé'),
      ),
      fausseRequete,
      fausseReponse,
      fausseSuite,
    );

    expect(consignateurErreurs.tous()).toHaveLength(1);
    expect(fausseRequete.body).toStrictEqual<CorpsRequeteFinalisationCompte>({
      cguSignees: true,
      motDePasse: '<MOT_DE_PASSE_OBFUSQUE/>',
    });
  });
});
