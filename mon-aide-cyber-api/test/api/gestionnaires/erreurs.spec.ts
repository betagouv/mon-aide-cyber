import { beforeEach, describe, expect, it } from 'vitest';
import { gestionnaireErreurGeneralisee } from '../../../src/api/gestionnaires/erreurs';
import { ConsignateurErreursMemoire } from '../../../src/infrastructure/adaptateurs/ConsignateurErreursMemoire';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { ErreurMAC } from '../../../src/domaine/erreurMAC';
import { ErreurAccesRefuse } from '../../../src/adaptateurs/AdaptateurDeVerificationDeSession';
import { CorpsRequeteAuthentification } from '../../../src/api/routesAPIAuthentification';
import { ErreurValidationMotDePasse } from '../../../src/api/validateurs/motDePasse';
import { ErreurModificationProfil } from '../../../src/api/aidant/routesAPIProfil';
import { ErreurAuthentification } from '../../../src/authentification/Utilisateur';
import { ErreurCreationEspaceAidant } from '../../../src/espace-aidant/Aidant';
import { ErreurProConnectApresAuthentification } from '../../../src/api/pro-connect/routeProConnect';
import { liensPublicsAttendus } from '../hateoas/liensAttendus';
import { ErreurRequeteHTTP } from '../../../src/api/recherche-entreprise/routesAPIRechercheEntreprise';

describe("Gestionnaire d'erreur", () => {
  let codeRecu = 0;
  let corpsRecu = {};
  let erreurRecue = '';

  const fausseRequete: Request = {} as Request;
  const fausseReponse: Response = {
    status(code: number) {
      codeRecu = code;
      this.statusCode = codeRecu;
    },
    json(corps: any) {
      if (corps) {
        corpsRecu = corps;
      }
      return corpsRecu;
    },
    statusCode: codeRecu,
    redirect(__url: string) {
      this.statusCode = 302;
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
      fausseSuite
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
      fausseSuite
    );

    expect(consignateurErreurs.tous()).toHaveLength(0);
    expect(codeRecu).toBe(500);
    expect(corpsRecu).toStrictEqual({
      message: "MonAideCyber n'est pas en mesure de traiter votre demande.",
    });
    expect(erreurRecue).toStrictEqual(
      ErreurMAC.cree('Accès diagnostic', new Error('Erreur non identifiée'))
    );
  });

  it("Ne consigne pas l'erreur en cas d'authentification erronée", () => {
    const consignateurErreurs = new ConsignateurErreursMemoire();
    const corpsAuthentification: CorpsRequeteAuthentification = {
      identifiant: 'jean',
      motDePasse: 'abc123',
    };
    fausseRequete.body = corpsAuthentification;

    gestionnaireErreurGeneralisee(consignateurErreurs)(
      ErreurMAC.cree(
        "Demande d'Authentification",
        new ErreurAuthentification(new Error('Quelque chose est arrivé'))
      ),
      fausseRequete,
      fausseReponse,
      fausseSuite
    );

    expect(consignateurErreurs.tous()).toHaveLength(0);
    expect(fausseRequete.body).toStrictEqual<CorpsRequeteAuthentification>({
      identifiant: 'jean',
      motDePasse: '<MOT_DE_PASSE_OBFUSQUE/>',
    });
  });

  describe('Dans le cadre d’un accès refusé', () => {
    it("génère une erreur 403 lorsqu'une erreur MAC 'Accès ressource protégée' est reçue et ne consigne pas l'erreur", () => {
      const consignateurErreurs = new ConsignateurErreursMemoire();

      const messageInterne = "une explication de l'erreur pour le développeur";
      gestionnaireErreurGeneralisee(consignateurErreurs)(
        ErreurMAC.cree(
          'Ajout réponse au diagnostic',
          new ErreurAccesRefuse(messageInterne)
        ),
        fausseRequete,
        fausseReponse,
        fausseSuite
      );

      expect(consignateurErreurs.tous()).toHaveLength(0);
      expect(codeRecu).toBe(403);
      expect(corpsRecu).toStrictEqual({
        message: "L'accès à la ressource est interdit.",
        ...liensPublicsAttendus,
      });
    });

    it('Retourne le lien correspondant à une finalisation de demande devenir Aidant', () => {
      const consignateurErreurs = new ConsignateurErreursMemoire();

      gestionnaireErreurGeneralisee(consignateurErreurs)(
        ErreurMAC.cree(
          'Ajout réponse au diagnostic',
          new ErreurAccesRefuse('', {
            contexte: 'demande-devenir-aidant:finalise-creation-espace-aidant',
          })
        ),
        fausseRequete,
        fausseReponse,
        fausseSuite
      );

      expect(corpsRecu).toStrictEqual({
        message: "L'accès à la ressource est interdit.",
        liens: {
          'finalise-creation-nouvel-espace-aidant': {
            url: '/api/demandes/devenir-aidant/creation-espace-aidant',
            methode: 'POST',
          },
        },
      });
    });
  });

  describe('Dans le cadre de la création de l’espace Aidant', () => {
    it("Consigne l'erreur en cas d'échec", () => {
      const consignateurErreurs = new ConsignateurErreursMemoire();
      const corpsAuthentification = {
        cguSignees: true,
        motDePasse: 'abc123',
        motDePasseTemporaire: 'tmp',
      };
      fausseRequete.body = corpsAuthentification;

      gestionnaireErreurGeneralisee(consignateurErreurs)(
        ErreurMAC.cree(
          "Crée l'espace Aidant",
          new ErreurCreationEspaceAidant('Quelque chose est arrivé')
        ),
        fausseRequete,
        fausseReponse,
        fausseSuite
      );

      expect(consignateurErreurs.tous()).toHaveLength(1);
      expect(fausseRequete.body).toStrictEqual({
        cguSignees: true,
        motDePasse: '<MOT_DE_PASSE_OBFUSQUE/>',
        motDePasseTemporaire: '<MOT_DE_PASSE_OBFUSQUE/>',
      });
    });

    it("Ne consigne pas l'erreur en cas d'échec sur une erreur de validation", () => {
      const consignateurErreurs = new ConsignateurErreursMemoire();
      const corpsAuthentification = {
        cguSignees: true,
        motDePasse: 'abc123',
        motDePasseTemporaire: 'tmp',
      };
      fausseRequete.body = corpsAuthentification;

      gestionnaireErreurGeneralisee(consignateurErreurs)(
        ErreurMAC.cree(
          "Crée l'espace Aidant",
          new ErreurValidationMotDePasse(
            'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.'
          )
        ),
        fausseRequete,
        fausseReponse,
        fausseSuite
      );

      expect(consignateurErreurs.tous()).toHaveLength(0);
      expect(fausseRequete.body).toStrictEqual({
        cguSignees: true,
        motDePasse: '<MOT_DE_PASSE_OBFUSQUE/>',
        motDePasseTemporaire: '<MOT_DE_PASSE_OBFUSQUE/>',
      });
    });
  });

  describe('Danse le cadre de la modification du profil de l’Aidant', () => {
    it('Consigne l’erreur', () => {
      const consignateurErreurs = new ConsignateurErreursMemoire();
      fausseRequete.body = {
        consentementAnnuaire: true,
      };

      gestionnaireErreurGeneralisee(consignateurErreurs)(
        ErreurMAC.cree(
          'Modifie le profil Aidant',
          new ErreurModificationProfil(
            'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.'
          )
        ),
        fausseRequete,
        fausseReponse,
        fausseSuite
      );

      expect(consignateurErreurs.tous()).toHaveLength(1);
      expect(fausseRequete.body).toStrictEqual({
        consentementAnnuaire: true,
      });
    });
  });

  describe('Dans le cadre de la connexion ProConnect', () => {
    it('Consigne l’erreur', () => {
      const consignateur = new ConsignateurErreursMemoire();

      gestionnaireErreurGeneralisee(consignateur)(
        ErreurMAC.cree(
          'Authentification ProConnect',
          new ErreurProConnectApresAuthentification(new Error('Erreur'))
        ),
        fausseRequete,
        fausseReponse,
        fausseSuite
      );

      expect(consignateur.tous()).toHaveLength(1);
      expect(fausseReponse.statusCode).toStrictEqual(302);
    });
  });

  it("Obfusque quelconque attribut ayant en nom la chaine de caractère contenant 'mot de passe'", () => {
    const consignateurErreurs = new ConsignateurErreursMemoire();
    const corpsAuthentification = {
      cguSignees: true,
      motDePasse: 'abc123',
      motPasse: 'abc123',
      motDePasseTemporaire: 'tmp',
      'mot-de-passe': 'test',
      'mot-de-passe-': 'test',
      motsDePasse: 'test',
      'motsDePasse-': 'test',
      'mots-De-Passe': 'test',
      'mots-de-passe': 'test',
      'mots-De-Passe-': 'test',
    };
    fausseRequete.body = corpsAuthentification;

    gestionnaireErreurGeneralisee(consignateurErreurs)(
      new Error('Erreur'),
      fausseRequete,
      fausseReponse,
      fausseSuite
    );

    expect(fausseRequete.body).toStrictEqual({
      cguSignees: true,
      motDePasse: '<MOT_DE_PASSE_OBFUSQUE/>',
      motDePasseTemporaire: '<MOT_DE_PASSE_OBFUSQUE/>',
      'mot-de-passe': '<MOT_DE_PASSE_OBFUSQUE/>',
      'mot-de-passe-': '<MOT_DE_PASSE_OBFUSQUE/>',
      motsDePasse: '<MOT_DE_PASSE_OBFUSQUE/>',
      motPasse: '<MOT_DE_PASSE_OBFUSQUE/>',
      'motsDePasse-': '<MOT_DE_PASSE_OBFUSQUE/>',
      'mots-De-Passe': '<MOT_DE_PASSE_OBFUSQUE/>',
      'mots-de-passe': '<MOT_DE_PASSE_OBFUSQUE/>',
      'mots-De-Passe-': '<MOT_DE_PASSE_OBFUSQUE/>',
    });
  });

  describe('Dans le cadre d’une requête HTTP vers un service tiers', () => {
    it('Consigne l’erreur', () => {
      const consignateurErreurs = new ConsignateurErreursMemoire();

      gestionnaireErreurGeneralisee(consignateurErreurs)(
        ErreurMAC.cree(
          'Exécution requête HTTP',
          new ErreurRequeteHTTP(
            { codeErreur: 429, corps: { erreur: 'Une erreur' } },
            'Un appel'
          )
        ),
        fausseRequete,
        fausseReponse,
        fausseSuite
      );

      expect(consignateurErreurs.tous()).toHaveLength(1);
      expect(fausseReponse.statusCode).toStrictEqual(400);
    });
  });
});
