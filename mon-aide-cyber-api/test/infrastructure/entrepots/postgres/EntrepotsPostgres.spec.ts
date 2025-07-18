import { assert, beforeEach, describe, expect, it } from 'vitest';
import {
  nettoieLaBaseDeDonneesAidants,
  nettoieLaBaseDeDonneesDiagnostics,
  nettoieLaBaseDeDonneesRelations,
  nettoieLaBaseDeDonneesUtilisateurs,
  nettoieLaBaseDeDonneesUtilisateursInscrits,
} from '../../../utilitaires/nettoyeurBDD';
import { EntrepotAidantPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { ServiceDeChiffrementClair } from '../../securite/ServiceDeChiffrementClair';
import { EntrepotRelationPostgres } from '../../../../src/relation/infrastructure/EntrepotRelationPostgres';
import {
  unDiagnostic,
  unDiagnosticAvecSecteurActivite,
  unDiagnosticCompletEnGirondeAvecDesReponsesDonnees,
  unDiagnosticEnGironde,
  uneQuestionDiagnostic,
  uneReponseDonnee,
} from '../../../constructeurs/constructeurDiagnostic';
import { EntrepotDiagnosticPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotDiagnosticPostgres';
import {
  uneQuestion,
  uneReponsePossible,
  unReferentiel,
} from '../../../constructeurs/constructeurReferentiel';
import { FournisseurHorlogeDeTest } from '../../horloge/FournisseurHorlogeDeTest';
import {
  EntrepotRestitutionPostgres,
  mappeurRestitution,
} from '../../../../src/infrastructure/entrepots/postgres/EntrepotRestitutionPostgres';
import { Restitution } from '../../../../src/restitution/Restitution';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import {
  genereLaRestitution,
  QuestionDiagnostic,
} from '../../../../src/diagnostic/Diagnostic';
import { EntrepotAnnuaireAidantsPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotAnnuaireAidantsPostgres';
import { FauxServiceDeChiffrement } from '../../securite/FauxServiceDeChiffrement';
import { Aidant as AnnuaireAidant } from '../../../../src/annuaire-aidants/annuaireAidants';
import {
  allier,
  Departement,
  departements,
  finistere,
  gironde,
} from '../../../../src/gestion-demandes/departements';
import { SecteurActivite } from '../../../../src/espace-aidant/preferences/secteursActivite';
import { EntrepotUtilisateurPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotUtilisateurPostgres';
import { Utilisateur } from '../../../../src/authentification/Utilisateur';
import {
  Aidant,
  associations,
  EntiteAidant,
  EntitesAssociations,
  EntitesOrganisationsPubliques,
  entitesPubliques,
  TypeAffichageAnnuaire,
  typesEntites,
  TypesEntites,
} from '../../../../src/espace-aidant/Aidant';
import {
  unAidant,
  unUtilisateur,
  unUtilisateurInscrit,
} from '../../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { adaptateurServiceChiffrement } from '../../../../src/infrastructure/adaptateurs/adaptateurServiceChiffrement';
import {
  unTupleAidantInitieDiagnostic,
  unTupleAttributionDemandeAideAAidant,
  unTupleUtilisateurInscritInitieDiagnostic,
} from '../../../../src/diagnostic/tuples';
import { ProfilAidant } from '../../../../src/espace-aidant/profil/profilAidant';
import { EntrepotProfilAidantPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotProfilAidantPostgres';
import knexfile from './../../../../src/infrastructure/entrepots/postgres/knexfile';
import knex from 'knex';
import { AggregatNonTrouve } from '../../../../src/domaine/Aggregat';
import { UtilisateurMAC } from '../../../../src/recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { EntrepotUtilisateurMACPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotUtilisateurMACPostgres';
import { EntrepotUtilisateurInscritPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotUtilisateurInscritPostgres';
import {
  EntiteUtilisateurInscrit,
  UtilisateurInscrit,
} from '../../../../src/espace-utilisateur-inscrit/UtilisateurInscrit';
import { ServiceDeChiffrement } from '../../../../src/securite/ServiceDeChiffrement';
import { EntrepotStatistiquesAidantPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotStatistiquesAidantPostgres';
import { StatistiquesAidant as AidantExtraction } from '../../../../src/statistiques/aidant/StastistiquesAidant';
import { EntrepotStatistiquesUtilisateursInscritsPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotStatistiquesUtilisateursInscritsPostgres';
import { uneDemandeAide } from '../../../gestion-demandes/aide/ConstructeurDemandeAide';
import { EntrepotAideConcret } from '../../../../src/infrastructure/entrepots/postgres/EntrepotAideConcret';
import { AdaptateurRepertoireDeContactsMemoire } from '../../../../src/infrastructure/adaptateurs/AdaptateurRepertoireDeContactsMemoire';
import { EntrepotAideBrevoMemoire } from './aideAuxTests/EntrepotAideBrevoMemoire';

describe('Tous les entreprôts Postgres', () => {
  describe('Entrepot Diagnostic Postgres', () => {
    const entrepotDiagnosticPostgres = new EntrepotDiagnosticPostgres();

    beforeEach(async () => {
      await nettoieLaBaseDeDonneesDiagnostics();
    });

    it('persiste un diagnostic', async () => {
      const diagnostic = unDiagnostic().construis();

      await entrepotDiagnosticPostgres.persiste(diagnostic);

      expect(
        await entrepotDiagnosticPostgres.lis(diagnostic.identifiant)
      ).toStrictEqual(diagnostic);
    });

    it('persiste un diagnostic avec les réponses données', async () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique('question-set', [
              uneQuestion()
                .aChoixMultiple('Sauvegardes-tu les set?', [
                  uneReponsePossible().avecLibelle('Oui').construis(),
                  uneReponsePossible().avecLibelle('Un peu').construis(),
                  uneReponsePossible().avecLibelle('Beaucoup').construis(),
                ])
                .construis(),
            ])
            .construis()
        )
        .avecLesReponsesDonnees('question-set', [
          { 'sauvegardestu-les-set': ['un-peu', 'beaucoup'] },
        ])
        .construis();

      await entrepotDiagnosticPostgres.persiste(diagnostic);

      expect(
        await entrepotDiagnosticPostgres.lis(diagnostic.identifiant)
      ).toStrictEqual(diagnostic);
    });

    it('Récupère les diagnostics pour les identifiants donnés', async () => {
      const diagnostic1 = unDiagnostic().construis();
      const diagnostic2 = unDiagnostic().construis();

      await entrepotDiagnosticPostgres.persiste(diagnostic1);
      await entrepotDiagnosticPostgres.persiste(diagnostic2);

      expect(
        await entrepotDiagnosticPostgres.tousLesDiagnosticsAyantPourIdentifiant(
          [diagnostic1.identifiant, diagnostic2.identifiant]
        )
      ).toStrictEqual([diagnostic1, diagnostic2]);
    });
  });

  describe('Entrepôt Restitution Postgres', () => {
    const entrepotDiagnostic = new EntrepotDiagnosticPostgres();
    const entrepotRestitution = new EntrepotRestitutionPostgres();

    beforeEach(() => FournisseurHorlogeDeTest.initialise(new Date()));
    beforeEach(async () => {
      await nettoieLaBaseDeDonneesDiagnostics();
    });
    it('retourne une restitution sans indicateurs', async () => {
      const diagnostic = unDiagnostic().construis();
      await entrepotDiagnostic.persiste(diagnostic);

      expect(
        await entrepotRestitution.lis(diagnostic.identifiant)
      ).toStrictEqual<Restitution>({
        identifiant: diagnostic.identifiant,
        informations: {
          dateCreation: FournisseurHorloge.maintenant(),
          dateDerniereModification: FournisseurHorloge.maintenant(),
          secteurGeographique: 'non renseigné',
          secteurActivite: 'non renseigné',
        },
        indicateurs: {},
        mesures: {
          mesuresPrioritaires: [],
          autresMesures: [],
        },
      });
    });

    it("remonte une erreur si la restitution n'existe pas", async () => {
      const identifiant = crypto.randomUUID();

      await expect(entrepotRestitution.lis(identifiant)).rejects.toThrowError(
        "Le restitution demandé n'existe pas"
      );
    });

    describe('retourne les informations de restitution', () => {
      it('avec la zone géographique', async () => {
        const diagnostic = unDiagnosticEnGironde().construis();
        genereLaRestitution(diagnostic);
        await entrepotDiagnostic.persiste(diagnostic);

        expect(
          await entrepotRestitution.lis(diagnostic.identifiant)
        ).toStrictEqual<Restitution>({
          identifiant: diagnostic.identifiant,
          informations: {
            dateCreation: FournisseurHorloge.maintenant(),
            dateDerniereModification: FournisseurHorloge.maintenant(),
            secteurGeographique: 'Gironde, Nouvelle-Aquitaine',
            secteurActivite: 'non renseigné',
          },
          indicateurs: {},
          mesures: {
            mesuresPrioritaires: [],
            autresMesures: [],
          },
        });
      });

      it("avec le secteur d'activité", async () => {
        const diagnostic =
          unDiagnosticAvecSecteurActivite('Construction').construis();
        genereLaRestitution(diagnostic);
        await entrepotDiagnostic.persiste(diagnostic);

        expect(
          await entrepotRestitution.lis(diagnostic.identifiant)
        ).toStrictEqual<Restitution>({
          identifiant: diagnostic.identifiant,
          informations: {
            dateCreation: FournisseurHorloge.maintenant(),
            dateDerniereModification: FournisseurHorloge.maintenant(),
            secteurGeographique: 'non renseigné',
            secteurActivite: 'Construction',
          },
          indicateurs: {},
          mesures: {
            mesuresPrioritaires: [],
            autresMesures: [],
          },
        });
      });
    });

    describe('retourne les mesures', () => {
      it('avec toutes les mesures et indicateurs', async () => {
        const diagnostic =
          unDiagnosticCompletEnGirondeAvecDesReponsesDonnees().construis();
        genereLaRestitution(diagnostic);
        await entrepotDiagnostic.persiste(diagnostic);

        expect(
          await entrepotRestitution.lis(diagnostic.identifiant)
        ).toStrictEqual<Restitution>({
          identifiant: diagnostic.identifiant,
          informations: {
            dateCreation: FournisseurHorloge.maintenant(),
            dateDerniereModification: FournisseurHorloge.maintenant(),
            secteurGeographique: 'Gironde, Nouvelle-Aquitaine',
            secteurActivite: 'non renseigné',
          },
          indicateurs: { thematique: { moyennePonderee: 0 } },
          mesures: {
            mesuresPrioritaires: [
              {
                valeurObtenue: 0,
                priorisation: 1,
                titre: 'mesure 1',
                pourquoi: 'parce-que',
                comment: 'comme ça',
              },
              {
                valeurObtenue: 0,
                priorisation: 2,
                titre: 'mesure 2',
                pourquoi: 'parce-que',
                comment: 'comme ça',
              },
              {
                valeurObtenue: 0,
                priorisation: 3,
                titre: 'mesure 3',
                pourquoi: 'parce-que',
                comment: 'comme ça',
              },
              {
                valeurObtenue: 0,
                priorisation: 4,
                titre: 'mesure 4',
                pourquoi: 'parce-que',
                comment: 'comme ça',
              },
              {
                valeurObtenue: 0,
                priorisation: 5,
                titre: 'mesure 5',
                pourquoi: 'parce-que',
                comment: 'comme ça',
              },
              {
                valeurObtenue: 0,
                priorisation: 6,
                titre: 'mesure 6',
                pourquoi: 'parce-que',
                comment: 'comme ça',
              },
            ],
            autresMesures: [
              {
                titre: 'mesure 7',
                pourquoi: 'parce-que',
                comment: 'comme ça',
                valeurObtenue: 0,
                priorisation: 7,
              },
            ],
          },
        });
      });
    });

    describe('Mappeur de restitution', () => {
      const mappeurRestitutionDTODepuisQuestion = (questions: {
        questionRegion?: QuestionDiagnostic;
        questionDepartement?: QuestionDiagnostic;
        questionActivite?: QuestionDiagnostic;
      }) => {
        const enDTO = (question: QuestionDiagnostic) => ({
          identifiant: question.identifiant,
          libelle: question.libelle,
          poids: question.poids,
          reponseDonnee: {
            reponseUnique: question.reponseDonnee.reponseUnique,
            reponsesMultiples: question.reponseDonnee.reponsesMultiples.map(
              (rep) => ({
                identifiant: rep.identifiant,
                reponses: Array.from(rep.reponses.values()),
              })
            ),
          },
          reponsesPossibles: question.reponsesPossibles,
          type: question.type,
        });

        return {
          id: crypto.randomUUID(),
          datecreation: FournisseurHorloge.maintenant().toISOString(),
          datedernieremodification:
            FournisseurHorloge.maintenant().toISOString(),
          departement: enDTO(
            questions.questionDepartement || uneQuestionDiagnostic().construis()
          ),
          region: enDTO(
            questions.questionRegion || uneQuestionDiagnostic().construis()
          ),
          restitution: {
            indicateurs: {},
            mesures: {
              mesuresPrioritaires: [],
              autresMesures: [],
            },
          },
          secteuractivite: enDTO(
            questions.questionActivite || uneQuestionDiagnostic().construis()
          ),
        };
      };

      describe("secteur d'activité de l'entité", () => {
        it("si renseigné, représente le secteur d'activité", () => {
          const questionSecteurActivite = uneQuestionDiagnostic()
            .avecLibelle("Secteur d'activité?")
            .avecLesReponsesPossibles([
              uneReponsePossible().avecLibelle('a').construis(),
              uneReponsePossible().avecLibelle('b').construis(),
            ])
            .ayantLaReponseDonnee(
              uneReponseDonnee().ayantPourReponse('b').construis()
            )
            .construis();

          expect(
            mappeurRestitution(
              mappeurRestitutionDTODepuisQuestion({
                questionActivite: questionSecteurActivite,
              })
            ).secteurActivite
          ).toStrictEqual('b');
        });

        it("si non renseigné, indique 'non renseigné'", () => {
          const questionSecteurActivite = uneQuestionDiagnostic()
            .avecLibelle("Secteur d'activité?")
            .avecLesReponsesPossibles([
              uneReponsePossible().avecLibelle('a').construis(),
              uneReponsePossible().avecLibelle('b').construis(),
            ])
            .construis();

          expect(
            mappeurRestitution(
              mappeurRestitutionDTODepuisQuestion({
                questionActivite: questionSecteurActivite,
              })
            ).secteurActivite
          ).toStrictEqual('non renseigné');
        });
      });

      describe("Zone géographique de l'entité", () => {
        it("Représente la zone géographique au format '<département>, <région>'", () => {
          const questionRegion = uneQuestionDiagnostic()
            .avecLibelle('Région?')
            .avecLesReponsesPossibles([
              uneReponsePossible()
                .avecLibelle('Nouvelle-Aquitaine')
                .construis(),
              uneReponsePossible().avecLibelle('Bretagne').construis(),
            ])
            .ayantLaReponseDonnee(
              uneReponseDonnee()
                .ayantPourReponse('nouvelleaquitaine')
                .construis()
            )
            .construis();
          const questionDepartement = uneQuestionDiagnostic()
            .avecLibelle('Département?')
            .avecLesReponsesPossibles([
              uneReponsePossible().avecLibelle('Finistère').construis(),
              uneReponsePossible().avecLibelle('Gironde').construis(),
            ])
            .ayantLaReponseDonnee(
              uneReponseDonnee().ayantPourReponse('gironde').construis()
            )
            .construis();

          expect(
            mappeurRestitution(
              mappeurRestitutionDTODepuisQuestion({
                questionRegion: questionRegion,
                questionDepartement: questionDepartement,
              })
            ).secteurGeographique
          ).toStrictEqual('Gironde, Nouvelle-Aquitaine');
        });

        it("Si seulement le département est renseigné, représente la zone géographique au format '<département>'", () => {
          const questionDepartement = uneQuestionDiagnostic()
            .avecLibelle('Département?')
            .avecLesReponsesPossibles([
              uneReponsePossible().avecLibelle('Finistère').construis(),
              uneReponsePossible().avecLibelle('Gironde').construis(),
            ])
            .ayantLaReponseDonnee(
              uneReponseDonnee().ayantPourReponse('gironde').construis()
            )
            .construis();

          expect(
            mappeurRestitution(
              mappeurRestitutionDTODepuisQuestion({
                questionDepartement: questionDepartement,
              })
            ).secteurGeographique
          ).toStrictEqual('Gironde');
        });

        it("Si seulement la région est renseigné, représente la zone géographique au format '<région>'", () => {
          const questionRegion = uneQuestionDiagnostic()
            .avecLibelle('Région?')
            .avecLesReponsesPossibles([
              uneReponsePossible()
                .avecLibelle('Nouvelle-Aquitaine')
                .construis(),
              uneReponsePossible().avecLibelle('Bretagne').construis(),
            ])
            .ayantLaReponseDonnee(
              uneReponseDonnee()
                .ayantPourReponse('nouvelleaquitaine')
                .construis()
            )
            .construis();

          expect(
            mappeurRestitution(
              mappeurRestitutionDTODepuisQuestion({
                questionRegion: questionRegion,
              })
            ).secteurGeographique
          ).toStrictEqual('Nouvelle-Aquitaine');
        });

        it("Si ni le département ni la région ne sont renseignés, affiche 'non renseigné'", () => {
          expect(
            mappeurRestitution(mappeurRestitutionDTODepuisQuestion({}))
              .secteurGeographique
          ).toStrictEqual('non renseigné');
        });
      });
    });
  });

  describe('Entrepot Aidant', () => {
    const serviceDeChiffrement: FauxServiceDeChiffrement =
      new FauxServiceDeChiffrement(new Map());
    let entrepot = new EntrepotAidantPostgres(serviceDeChiffrement);

    beforeEach(async () => {
      await nettoieLaBaseDeDonneesAidants();
      serviceDeChiffrement.nettoie();
    });

    it('Persiste un Aidant', async () => {
      const aidant = unAidant().construis();
      serviceDeChiffrement.ajoute(aidant.email, 'aaa');
      serviceDeChiffrement.ajoute(aidant.nomPrenom, 'ccc');
      serviceDeChiffrement.ajoute(
        aidant.preferences.nomAffichageAnnuaire,
        'ddd'
      );

      await entrepot.persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).lis(aidant.identifiant);
      expect(aidantRecu).toStrictEqual<Aidant>(aidant);
    });

    it('Persiste un aidant avec son Siret', async () => {
      const aidant = unAidant().avecUnSiret('1234567890').construis();
      serviceDeChiffrement.ajoute(aidant.email, 'aaa');
      serviceDeChiffrement.ajoute(aidant.nomPrenom, 'ccc');

      await entrepot.persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).lis(aidant.identifiant);
      expect(aidantRecu).toStrictEqual<Aidant>(aidant);
    });

    it('Persiste un aidant avec la date de la signature de la charte', async () => {
      const dateSignatureCharte = new Date();
      const aidant = unAidant()
        .avecUneDateDeSignatureDeCharte(dateSignatureCharte)
        .construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(new Map());

      await entrepot.persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).lis(aidant.identifiant);
      expect(aidantRecu.dateSignatureCharte).toStrictEqual(dateSignatureCharte);
    });

    it("Persiste un Aidant avec l'entité", async () => {
      const aidant = unAidant()
        .faisantPartieDeEntite('Association')
        .construis();
      serviceDeChiffrement.ajoute(aidant.entite!.nom!, 'aaaa');
      serviceDeChiffrement.ajoute(aidant.entite!.siret!, 'bbbb');
      serviceDeChiffrement.ajoute(aidant.entite!.type!, 'cccc');

      await entrepot.persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).lis(aidant.identifiant);
      expect(aidantRecu.entite).toStrictEqual<EntiteAidant>({
        nom: aidant.entite!.nom!,
        siret: aidant.entite!.siret!,
        type: 'Association',
      });
    });

    it("Persiste un Aidant sans entité mais en sachant qu'il souhaite être en association", async () => {
      const aidant = unAidant()
        .faisantPartieDeEntite('Association')
        .construis();
      serviceDeChiffrement.ajoute(aidant.entite!.type!, 'cccc');

      await entrepot.persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).lis(aidant.identifiant);
      expect(aidantRecu.entite).toStrictEqual<EntiteAidant>({
        type: 'Association',
      });
    });

    it('Persiste un Aidant préalablement Utilisateur Inscrit', async () => {
      const entrepot = new EntrepotAidantPostgres(
        new ServiceDeChiffrementClair()
      );
      const utilisateurInscrit = unUtilisateurInscrit()
        .avecUnEmail('jean.dujardin@mail.com')
        .construis();
      await new EntrepotUtilisateurInscritPostgres(
        new ServiceDeChiffrementClair()
      ).persiste(utilisateurInscrit);
      const aidant = unAidant()
        .avecUnEmail('jean.dujardin@mail.com')
        .avecUnIdentifiant(utilisateurInscrit.identifiant)
        .construis();

      await entrepot.persiste(aidant);

      expect(
        await entrepot.lis(utilisateurInscrit.identifiant)
      ).toStrictEqual<Aidant>(aidant);
      await expect(() =>
        new EntrepotUtilisateurInscritPostgres(
          new ServiceDeChiffrementClair()
        ).lis(utilisateurInscrit.identifiant)
      ).rejects.toThrowError("Le utilisateur inscrit demandé n'existe pas.");
    });

    it('Met à jour le consentement pour apparaître dans l’annuaire', async () => {
      const aidant = unAidant().construis();
      const serviceDeChiffrement = new ServiceDeChiffrementClair();
      await entrepot.persiste(aidant);

      aidant.consentementAnnuaire = true;
      await entrepot.persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).lis(aidant.identifiant);
      expect(aidantRecu.consentementAnnuaire).toBe(true);
    });

    describe('Met à jour les préférences', () => {
      const serviceDeChiffrement: ServiceDeChiffrement =
        new ServiceDeChiffrementClair();
      const entrepot = new EntrepotAidantPostgres(serviceDeChiffrement);

      it('Persiste les types d’entités de l’Aidant', async () => {
        const organisationsPubliques: EntitesOrganisationsPubliques = {
          nom: 'Organisations publiques',
          libelle:
            'Organisations publiques (ex. collectivité, administration, etc.)',
        };
        const associations: EntitesAssociations = {
          nom: 'Associations',
          libelle: 'Associations (ex. association loi 1901, GIP)',
        };
        const aidant = unAidant()
          .ayantPourTypesEntite([organisationsPubliques, associations])
          .construis();

        await entrepot.persiste(aidant);

        const aidantRecu = await entrepot.lis(aidant.identifiant);
        expect(aidantRecu.preferences.typesEntites).toStrictEqual<TypesEntites>(
          [organisationsPubliques, associations]
        );
      });

      it('Persiste les départements où l’Aidant souhaite intervenir', async () => {
        const finistere: Departement = {
          nom: 'Finistère',
          code: '29',
          codeRegion: '53',
        };
        const gironde: Departement = {
          nom: 'Gironde',
          code: '33',
          codeRegion: '75',
        };
        const gard: Departement = {
          nom: 'Gard',
          code: '30',
          codeRegion: '76',
        };
        const aidant = unAidant()
          .ayantPourDepartements([finistere, gironde, gard])
          .construis();

        await entrepot.persiste(aidant);

        const aidantRecu = await entrepot.lis(aidant.identifiant);
        expect(aidantRecu.preferences.departements).toStrictEqual<
          Departement[]
        >([finistere, gard, gironde]);
      });

      it('Persiste les secteurs d’activité pour lesquels l’Aidant peut intervenir', async () => {
        const administration: SecteurActivite = {
          nom: 'Administration',
        };
        const industrie: SecteurActivite = {
          nom: 'Industrie',
        };
        const aidant = unAidant()
          .ayantPourSecteursActivite([administration, industrie])
          .construis();

        await entrepot.persiste(aidant);

        const aidantRecu = await entrepot.lis(aidant.identifiant);
        expect(aidantRecu.preferences.secteursActivite).toStrictEqual<
          SecteurActivite[]
        >([administration, industrie]);
      });
    });

    describe('Recherche par email', () => {
      it("L'aidant est trouvé", async () => {
        const aidant = unAidant().construis();
        serviceDeChiffrement.ajoute(aidant.email, 'aaa');
        serviceDeChiffrement.ajoute(aidant.nomPrenom, 'ccc');

        await entrepot.persiste(aidant);

        const aidantTrouve = await new EntrepotAidantPostgres(
          serviceDeChiffrement
        ).rechercheParEmail(aidant.email);

        expect(aidantTrouve).toStrictEqual<Aidant>(aidant);
      });

      it("Retourne un erreur s'il ne s'agit pas d'un Aidant", async () => {
        await knex(knexfile)
          .insert({
            id: crypto.randomUUID(),
            type: 'UTILISATEUR_INSCRIT',
            donnees: { email: 'jean.dupont@utilisateur-inscrit.com' },
          })
          .into('utilisateurs_mac');

        const aidantTrouve = new EntrepotAidantPostgres(
          new ServiceDeChiffrementClair()
        ).rechercheParEmail('jean.dupont@utilisateur-inscrit.com');

        expect(aidantTrouve).rejects.toStrictEqual(
          new AggregatNonTrouve('aidant')
        );
      });

      it("L'aidant n'est pas trouvé", () => {
        expect(
          new EntrepotAidantPostgres(
            new FauxServiceDeChiffrement(new Map())
          ).rechercheParEmail('identifiant-inconnu')
        ).rejects.toThrow(new Error("Le aidant demandé n'existe pas."));
      });
    });

    describe('Pour le type Aidant', () => {
      it('Retourne une erreur s’il ne s’agit pas d’un Aidant', async () => {
        const id = crypto.randomUUID();
        await knex(knexfile)
          .insert({
            id,
            type: 'UTILISATEUR_INSCRIT',
            donnees: { email: 'jean.dupont@utilisateur-inscrit.com' },
          })
          .into('utilisateurs_mac');

        const aidantTrouve = new EntrepotAidantPostgres(
          new ServiceDeChiffrementClair()
        ).lis(id);

        expect(aidantTrouve).rejects.toStrictEqual(
          new AggregatNonTrouve('aidant')
        );
      });

      it('Retourne uniquement les Aidants', async () => {
        const aidant = unAidant().construis();
        const serviceDeChiffrement = new ServiceDeChiffrementClair();
        entrepot = new EntrepotAidantPostgres(serviceDeChiffrement);

        await entrepot.persiste(aidant);
        await knex(knexfile)
          .insert({
            id: crypto.randomUUID(),
            type: 'UTILISATEUR_INSCRIT',
            donnees: { email: 'jean.dupont@utilisateur-inscrit.com' },
          })
          .into('utilisateurs_mac');

        const aidants = await new EntrepotAidantPostgres(
          serviceDeChiffrement
        ).tous();

        expect(aidants).toStrictEqual<Aidant[]>([aidant]);
      });
    });

    describe('Recherche les Aidants correspondant aux critères de l’entité à moins de 2 diagnostics sur 30 jours glissant', () => {
      const creeDeuxDemandesAideEnDatePour = async (
        aidantAyantPostuleADeuxDemandesAide: Aidant,
        lesDates: Date[]
      ) => {
        const serviceDeChiffrement = new ServiceDeChiffrementClair();
        const entrepotAideConcret = new EntrepotAideConcret(
          serviceDeChiffrement,
          new AdaptateurRepertoireDeContactsMemoire(),
          new EntrepotAideBrevoMemoire()
        );
        const premiereDemande = uneDemandeAide()
          .avecUneDateDeSignatureDesCGU(lesDates[0])
          .construis();
        const secondeDemande = uneDemandeAide()
          .avecUneDateDeSignatureDesCGU(lesDates[1])
          .construis();
        await entrepotAideConcret.persiste(premiereDemande);
        await entrepotAideConcret.persiste(secondeDemande);
        const entrepotRelation = new EntrepotRelationPostgres();
        await entrepotRelation.persiste(
          unTupleAttributionDemandeAideAAidant(
            premiereDemande.identifiant,
            aidantAyantPostuleADeuxDemandesAide.identifiant
          )
        );
        await entrepotRelation.persiste(
          unTupleAttributionDemandeAideAAidant(
            secondeDemande.identifiant,
            aidantAyantPostuleADeuxDemandesAide.identifiant
          )
        );
      };

      it('recherche les Aidants correspondants aux 3 critères', async () => {
        const unAidantEnGirondeDansLesTransportsAssociatifs = unAidant()
          .ayantPourDepartements([gironde])
          .ayantPourSecteursActivite([{ nom: 'Transports' }])
          .ayantPourTypesEntite([associations])
          .construis();
        const unAidantEnAllierPourAdministrationPublique = unAidant()
          .ayantPourDepartements([allier])
          .ayantPourTypesEntite([entitesPubliques])
          .ayantPourSecteursActivite([{ nom: 'Administration' }])
          .construis();
        const entrepotAidant = new EntrepotAidantPostgres(
          new ServiceDeChiffrementClair()
        );
        await entrepotAidant.persiste(
          unAidantEnGirondeDansLesTransportsAssociatifs
        );
        await entrepotAidant.persiste(
          unAidantEnAllierPourAdministrationPublique
        );

        const aidantsTrouvesEnGironde =
          await entrepotAidant.lesAidantsCorrespondantAuxCriteresDeEntiteAMoinsDe2DiagsSur30JoursGlissant(
            {
              departement: gironde,
              secteursActivite: [{ nom: 'Transports' }],
              typeEntite: associations,
            }
          );

        expect(aidantsTrouvesEnGironde).toStrictEqual<Aidant[]>([
          unAidantEnGirondeDansLesTransportsAssociatifs,
        ]);
      });

      it('recherche les Aidants de manière disctincte', async () => {
        const unAidantEnGirondeDansLesTransportsAssociatifs = unAidant()
          .ayantPourDepartements([gironde])
          .ayantPourSecteursActivite([{ nom: 'Transports' }])
          .ayantPourTypesEntite([associations])
          .construis();
        const unAidantEnAllierPourAdministrationPublique = unAidant()
          .ayantPourDepartements([allier])
          .ayantPourTypesEntite([entitesPubliques])
          .ayantPourSecteursActivite([
            { nom: 'Administration' },
            { nom: 'Tertiaire' },
          ])
          .construis();
        const entrepotAidant = new EntrepotAidantPostgres(
          new ServiceDeChiffrementClair()
        );
        await entrepotAidant.persiste(
          unAidantEnGirondeDansLesTransportsAssociatifs
        );
        await entrepotAidant.persiste(
          unAidantEnAllierPourAdministrationPublique
        );

        const aidantsTrouvesEnGironde =
          await entrepotAidant.lesAidantsCorrespondantAuxCriteresDeEntiteAMoinsDe2DiagsSur30JoursGlissant(
            {
              departement: allier,
              secteursActivite: [
                { nom: 'Administration' },
                { nom: 'Tertiaire' },
              ],
              typeEntite: entitesPubliques,
            }
          );

        expect(aidantsTrouvesEnGironde).toStrictEqual<Aidant[]>([
          unAidantEnAllierPourAdministrationPublique,
        ]);
      });

      it('Retourne un Aidant parmi 2', async () => {
        const entrepotAidant = new EntrepotAidantPostgres(
          new ServiceDeChiffrementClair()
        );
        FournisseurHorlogeDeTest.initialise(
          new Date('2025-03-19T13:50:00.000Z')
        );
        const aidantAyantPostuleADeuxDemandesAide = unAidant()
          .ayantPourDepartements([finistere])
          .ayantPourSecteursActivite([{ nom: 'Transports' }])
          .ayantPourTypesEntite([entitesPubliques])
          .avecUnEmail('aidant-avec-deux-demandes@mail.con')
          .avecUnNomPrenom('Jean DUPONT')
          .construis();
        const secondAidant = unAidant()
          .ayantPourDepartements([finistere])
          .ayantPourSecteursActivite([{ nom: 'Transports' }])
          .ayantPourTypesEntite([entitesPubliques])
          .avecUnEmail('aidant-qui-matche@mail.con')
          .avecUnNomPrenom('Jean MARTIN')
          .construis();
        await entrepotAidant.persiste(aidantAyantPostuleADeuxDemandesAide);
        await entrepotAidant.persiste(secondAidant);
        await creeDeuxDemandesAideEnDatePour(
          aidantAyantPostuleADeuxDemandesAide,
          [
            new Date('2025-02-21T14:50:00.000Z'),
            new Date('2025-03-15T08:50:00.000Z'),
          ]
        );

        const lesAidantsRetournes =
          await entrepotAidant.lesAidantsCorrespondantAuxCriteresDeEntiteAMoinsDe2DiagsSur30JoursGlissant(
            {
              departement: finistere,
              secteursActivite: [{ nom: 'Transports' }],
              typeEntite: entitesPubliques,
            }
          );

        expect(lesAidantsRetournes).toHaveLength(1);
        expect(lesAidantsRetournes[0].email).toBe('aidant-qui-matche@mail.con');
        expect(lesAidantsRetournes[0].nomPrenom).toBe('Jean MARTIN');
      });

      it('Retourne 2 aidants', async () => {
        const entrepotAidant = new EntrepotAidantPostgres(
          new ServiceDeChiffrementClair()
        );
        FournisseurHorlogeDeTest.initialise(
          new Date('2025-03-19T13:50:00.000Z')
        );
        const aidantPouvantANouveauMatcher = unAidant()
          .ayantPourDepartements([finistere])
          .ayantPourSecteursActivite([{ nom: 'Transports' }])
          .ayantPourTypesEntite([entitesPubliques])
          .avecUnEmail('aidant-avec-deux-demandes@mail.con')
          .avecUnNomPrenom('Jean DUPONT')
          .construis();
        const secondAidant = unAidant()
          .ayantPourDepartements([finistere])
          .ayantPourSecteursActivite([{ nom: 'Transports' }])
          .ayantPourTypesEntite([entitesPubliques])
          .avecUnEmail('aidant-qui-matche@mail.con')
          .avecUnNomPrenom('Jean MARTIN')
          .construis();
        await entrepotAidant.persiste(aidantPouvantANouveauMatcher);
        await entrepotAidant.persiste(secondAidant);
        await creeDeuxDemandesAideEnDatePour(aidantPouvantANouveauMatcher, [
          new Date('2025-02-17T13:49:00.000Z'),
          new Date('2025-03-15T08:50:00.000Z'),
        ]);

        const lesAidantsRetournes =
          await entrepotAidant.lesAidantsCorrespondantAuxCriteresDeEntiteAMoinsDe2DiagsSur30JoursGlissant(
            {
              departement: finistere,
              secteursActivite: [{ nom: 'Transports' }],
              typeEntite: entitesPubliques,
            }
          );

        expect(lesAidantsRetournes).toHaveLength(2);
        expect(lesAidantsRetournes.map((a) => a.email)).toEqual(
          expect.arrayContaining([
            'aidant-qui-matche@mail.con',
            'aidant-avec-deux-demandes@mail.con',
          ])
        );
      });
    });
  });

  describe('EntrepotStatistiquesAidant', () => {
    const entrepotAidant = new EntrepotAidantPostgres(
      adaptateurServiceChiffrement()
    );
    const entrepotUtilisateurInscritPostgres =
      new EntrepotUtilisateurInscritPostgres(adaptateurServiceChiffrement());

    beforeEach(async () => {
      await nettoieLaBaseDeDonneesAidants();
      await nettoieLaBaseDeDonneesRelations();
    });
    const entrepotRelation = new EntrepotRelationPostgres();

    it('Récupère un Aidant ayant plus de 2 diagnostics', async () => {
      const aidant = unAidant().construis();
      await entrepotAidant.persiste(aidant);
      await entrepotRelation.persiste(
        unTupleAidantInitieDiagnostic(aidant.identifiant, crypto.randomUUID())
      );
      await entrepotRelation.persiste(
        unTupleAidantInitieDiagnostic(aidant.identifiant, crypto.randomUUID())
      );

      const entrepotAidantExtraction = new EntrepotStatistiquesAidantPostgres(
        adaptateurServiceChiffrement()
      );

      expect(
        await entrepotAidantExtraction.rechercheAidantAyantAuMoinsNDiagnostics(
          2
        )
      ).toStrictEqual<AidantExtraction[]>([
        {
          identifiant: aidant.identifiant,
          nomPrenom: aidant.nomPrenom,
          email: aidant.email,
          compteCree: aidant.dateSignatureCGU!,
          departements: aidant.preferences.departements,
          entite: '',
        },
      ]);
    });

    it('Récupère un Aidant sans diagnostic', async () => {
      const aidant = unAidant().construis();
      await entrepotAidant.persiste(aidant);

      const entrepotAidantExtraction = new EntrepotStatistiquesAidantPostgres(
        adaptateurServiceChiffrement()
      );

      expect(
        await entrepotAidantExtraction.rechercheAidantSansDiagnostic()
      ).toStrictEqual<AidantExtraction[]>([
        {
          identifiant: aidant.identifiant,
          nomPrenom: aidant.nomPrenom,
          email: aidant.email,
          compteCree: aidant.dateSignatureCGU!,
          departements: aidant.preferences.departements,
          entite: '',
        },
      ]);
    });

    it('Récupère uniquement les Aidants sans diagnostic', async () => {
      const utilisateurInscrit = unUtilisateurInscrit().construis();
      await entrepotUtilisateurInscritPostgres.persiste(utilisateurInscrit);
      const aidant = unAidant().construis();
      await entrepotAidant.persiste(aidant);

      const entrepotAidantExtraction = new EntrepotStatistiquesAidantPostgres(
        adaptateurServiceChiffrement()
      );

      expect(
        await entrepotAidantExtraction.rechercheAidantSansDiagnostic()
      ).toStrictEqual<AidantExtraction[]>([
        {
          identifiant: aidant.identifiant,
          nomPrenom: aidant.nomPrenom,
          email: aidant.email,
          compteCree: aidant.dateSignatureCGU!,
          departements: aidant.preferences.departements,
          entite: '',
        },
      ]);
    });

    it('Récupère un Aidant sans diagnostic avec son entité et ses départements', async () => {
      const aidant = unAidant()
        .faisantPartieDeEntite('ServicePublic')
        .ayantPourDepartements([gironde, allier])
        .construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new Map([
          [aidant.nomPrenom, 'abcd'],
          [aidant.email, 'efgh'],
          [aidant.entite!.nom!, 'ijkl'],
        ])
      );
      const entrepotAidant = new EntrepotAidantPostgres(serviceDeChiffrement);
      await entrepotAidant.persiste(aidant);

      const entrepotAidantExtraction = new EntrepotStatistiquesAidantPostgres(
        serviceDeChiffrement
      );

      expect(
        await entrepotAidantExtraction.rechercheAidantSansDiagnostic()
      ).toStrictEqual<AidantExtraction[]>([
        {
          identifiant: aidant.identifiant,
          nomPrenom: aidant.nomPrenom,
          email: aidant.email,
          compteCree: aidant.dateSignatureCGU!,
          departements: aidant.preferences.departements,
          entite: aidant.entite!.nom!,
        },
      ]);
    });

    it('Récupère un Aidant avec ses diagnostic, son entité et ses départements', async () => {
      const aidant = unAidant()
        .faisantPartieDeEntite('ServicePublic')
        .ayantPourDepartements([gironde, allier])
        .construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new Map([
          [aidant.nomPrenom, 'mnop'],
          [aidant.email, 'qrst'],
          [aidant.entite!.nom!, 'uvwx'],
        ])
      );
      const entrepotAidant = new EntrepotAidantPostgres(serviceDeChiffrement);
      await entrepotAidant.persiste(aidant);

      const entrepotAidantExtraction = new EntrepotStatistiquesAidantPostgres(
        serviceDeChiffrement
      );

      expect(
        await entrepotAidantExtraction.rechercheAidantAvecNombreDeDiagnostics()
      ).toStrictEqual<AidantExtraction[]>([
        {
          identifiant: aidant.identifiant,
          nomPrenom: aidant.nomPrenom,
          email: aidant.email,
          compteCree: aidant.dateSignatureCGU!,
          departements: aidant.preferences.departements,
          entite: aidant.entite!.nom!,
          nombreDiagnostics: 0,
        },
      ]);
    });

    it('Récupère les Aidants ayant fait exactement 1 diagnostic', async () => {
      const premierAidant = unAidant().construis();
      const secondAidant = unAidant().construis();
      await entrepotAidant.persiste(premierAidant);
      await entrepotAidant.persiste(secondAidant);
      await entrepotRelation.persiste(
        unTupleAidantInitieDiagnostic(
          premierAidant.identifiant,
          crypto.randomUUID()
        )
      );
      await entrepotRelation.persiste(
        unTupleAidantInitieDiagnostic(
          secondAidant.identifiant,
          crypto.randomUUID()
        )
      );

      const entrepotAidantExtraction = new EntrepotStatistiquesAidantPostgres(
        adaptateurServiceChiffrement()
      );

      assert.sameDeepMembers(
        await entrepotAidantExtraction.rechercheAidantAyantExactementNDiagnostics(
          1
        ),
        [
          {
            identifiant: premierAidant.identifiant,
            nomPrenom: premierAidant.nomPrenom,
            email: premierAidant.email,
            compteCree: premierAidant.dateSignatureCGU!,
            departements: premierAidant.preferences.departements,
            entite: '',
          },
          {
            identifiant: secondAidant.identifiant,
            nomPrenom: secondAidant.nomPrenom,
            email: secondAidant.email,
            compteCree: secondAidant.dateSignatureCGU!,
            departements: premierAidant.preferences.departements,
            entite: '',
          },
        ]
      );
    });

    it('Récupère les Aidants avec leur nombre de diagnostics', async () => {
      const premierAidant = unAidant().construis();
      const secondAidant = unAidant().construis();
      const troisiemeAidant = unAidant().construis();
      await entrepotAidant.persiste(premierAidant);
      await entrepotAidant.persiste(secondAidant);
      await entrepotAidant.persiste(troisiemeAidant);
      await entrepotRelation.persiste(
        unTupleAidantInitieDiagnostic(
          premierAidant.identifiant,
          crypto.randomUUID()
        )
      );
      await entrepotRelation.persiste(
        unTupleAidantInitieDiagnostic(
          premierAidant.identifiant,
          crypto.randomUUID()
        )
      );
      await entrepotRelation.persiste(
        unTupleAidantInitieDiagnostic(
          secondAidant.identifiant,
          crypto.randomUUID()
        )
      );

      const entrepotAidantExtraction = new EntrepotStatistiquesAidantPostgres(
        adaptateurServiceChiffrement()
      );

      assert.sameDeepMembers(
        await entrepotAidantExtraction.rechercheAidantAvecNombreDeDiagnostics(),
        [
          {
            identifiant: premierAidant.identifiant,
            nomPrenom: premierAidant.nomPrenom,
            email: premierAidant.email,
            nombreDiagnostics: 2,
            compteCree: premierAidant.dateSignatureCGU!,
            departements: premierAidant.preferences.departements,
            entite: '',
          },
          {
            identifiant: secondAidant.identifiant,
            nomPrenom: secondAidant.nomPrenom,
            email: secondAidant.email,
            nombreDiagnostics: 1,
            compteCree: secondAidant.dateSignatureCGU!,
            departements: premierAidant.preferences.departements,
            entite: '',
          },
          {
            identifiant: troisiemeAidant.identifiant,
            nomPrenom: troisiemeAidant.nomPrenom,
            email: troisiemeAidant.email,
            nombreDiagnostics: 0,
            compteCree: troisiemeAidant.dateSignatureCGU!,
            departements: premierAidant.preferences.departements,
            entite: '',
          },
        ]
      );
    });

    it('Récupère uniquement les Aidants avec leur nombre de diagnostics', async () => {
      const premierAidant = unAidant().construis();
      const utilisateurInscrit = unUtilisateurInscrit().construis();
      await entrepotUtilisateurInscritPostgres.persiste(utilisateurInscrit);
      await entrepotAidant.persiste(premierAidant);
      await entrepotRelation.persiste(
        unTupleAidantInitieDiagnostic(
          premierAidant.identifiant,
          crypto.randomUUID()
        )
      );

      const entrepotAidantExtraction = new EntrepotStatistiquesAidantPostgres(
        adaptateurServiceChiffrement()
      );

      assert.sameDeepMembers(
        await entrepotAidantExtraction.rechercheAidantAvecNombreDeDiagnostics(),
        [
          {
            identifiant: premierAidant.identifiant,
            nomPrenom: premierAidant.nomPrenom,
            email: premierAidant.email,
            nombreDiagnostics: 1,
            compteCree: premierAidant.dateSignatureCGU!,
            departements: premierAidant.preferences.departements,
            entite: '',
          },
        ]
      );
    });

    it("Ne récupère pas d'Aidant", async () => {
      const aidant = unAidant().construis();
      await entrepotAidant.persiste(aidant);
      await entrepotRelation.persiste(
        unTupleAidantInitieDiagnostic(aidant.identifiant, crypto.randomUUID())
      );

      const entrepotAidantExtraction = new EntrepotStatistiquesAidantPostgres(
        adaptateurServiceChiffrement()
      );

      expect(
        await entrepotAidantExtraction.rechercheAidantAyantAuMoinsNDiagnostics(
          2
        )
      ).toStrictEqual<Aidant[]>([]);
    });
  });

  describe('Entrepot Annuaire Aidants Postgres', () => {
    beforeEach(async () => await nettoieLaBaseDeDonneesAidants());
    it('Retourne les Aidants ayant consenti à apparaître dans l’Annuaire', async () => {
      const premierAidantSansConsentement = unAidant().construis();
      const secondAidantSansConsentement = unAidant().construis();
      const premierAidantAvecConsentement = unAidant()
        .ayantConsentiPourLAnnuaire()
        .construis();
      const secondAidantAvecConsentement = unAidant()
        .ayantConsentiPourLAnnuaire(TypeAffichageAnnuaire.PRENOM_N)
        .construis();
      const entrepotAidant = new EntrepotAidantPostgres(
        new ServiceDeChiffrementClair()
      );
      await entrepotAidant.persiste(premierAidantAvecConsentement);
      await entrepotAidant.persiste(secondAidantAvecConsentement);
      await entrepotAidant.persiste(premierAidantSansConsentement);
      await entrepotAidant.persiste(secondAidantSansConsentement);

      const tousLesAidants = await new EntrepotAnnuaireAidantsPostgres(
        new ServiceDeChiffrementClair()
      ).rechercheParCriteres();

      expect(tousLesAidants).toStrictEqual<AnnuaireAidant[]>([
        {
          identifiant: premierAidantAvecConsentement.identifiant,
          nomPrenom: premierAidantAvecConsentement.nomPrenom,
          departements: premierAidantAvecConsentement.preferences.departements,
        },
        {
          identifiant: secondAidantAvecConsentement.identifiant,
          nomPrenom:
            secondAidantAvecConsentement.preferences.nomAffichageAnnuaire,
          departements: secondAidantAvecConsentement.preferences.departements,
        },
      ]);
    });

    it('Utilise le service de chiffrement pour déchiffrer le nom de l’Aidant', async () => {
      const aidant = unAidant()
        .avecUnNomPrenom('Jean Dupont')
        .ayantConsentiPourLAnnuaire()
        .construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new Map([[aidant.nomPrenom, 'ccc']])
      );
      const entrepotAidant = new EntrepotAidantPostgres(serviceDeChiffrement);
      await entrepotAidant.persiste(aidant);

      const tousLesAidants = await new EntrepotAnnuaireAidantsPostgres(
        serviceDeChiffrement
      ).rechercheParCriteres();

      expect(tousLesAidants).toStrictEqual<AnnuaireAidant[]>([
        {
          identifiant: aidant.identifiant,
          nomPrenom: 'Jean Dupont',
          departements: aidant.preferences.departements,
        },
      ]);
    });

    describe('Lorsque l’on filtre', () => {
      describe('Par territoire', () => {
        it('Retourne les Aidants pouvant intervenir dans le département', async () => {
          const premierAidantAvecConsentement = unAidant()
            .ayantConsentiPourLAnnuaire()
            .ayantPourDepartements([departements[0], departements[32]])
            .construis();
          const secondAidantAvecConsentement = unAidant()
            .ayantConsentiPourLAnnuaire()
            .ayantPourDepartements([departements[0]])
            .construis();
          const entrepotAidant = new EntrepotAidantPostgres(
            new ServiceDeChiffrementClair()
          );
          await entrepotAidant.persiste(premierAidantAvecConsentement);
          await entrepotAidant.persiste(secondAidantAvecConsentement);

          const tousLesAidants = await new EntrepotAnnuaireAidantsPostgres(
            new ServiceDeChiffrementClair()
          ).rechercheParCriteres({ departement: 'Gers' });

          expect(tousLesAidants).toStrictEqual<AnnuaireAidant[]>([
            {
              identifiant: premierAidantAvecConsentement.identifiant,
              nomPrenom: premierAidantAvecConsentement.nomPrenom,
              departements: [departements[0], departements[32]],
            },
          ]);
        });
      });

      describe('Par nature de l‘entité', () => {
        it.each(typesEntites)(
          'Retourne les Aidants pouvant intervenir pour une $nom',
          async (typeEntite) => {
            const premierAidantAvecConsentement = unAidant()
              .ayantConsentiPourLAnnuaire()
              .ayantPourDepartements([gironde])
              .ayantPourTypesEntite([typeEntite])
              .construis();
            const secondAidantAvecConsentement = unAidant()
              .ayantConsentiPourLAnnuaire()
              .ayantPourDepartements([gironde])
              .construis();
            const entrepotAidant = new EntrepotAidantPostgres(
              new ServiceDeChiffrementClair()
            );
            await entrepotAidant.persiste(premierAidantAvecConsentement);
            await entrepotAidant.persiste(secondAidantAvecConsentement);

            const tousLesAidants = await new EntrepotAnnuaireAidantsPostgres(
              new ServiceDeChiffrementClair()
            ).rechercheParCriteres({
              departement: gironde.nom,
              typeEntite: typeEntite.nom,
            });

            expect(tousLesAidants).toStrictEqual<AnnuaireAidant[]>([
              {
                identifiant: premierAidantAvecConsentement.identifiant,
                nomPrenom: premierAidantAvecConsentement.nomPrenom,
                departements: [gironde],
              },
            ]);
          }
        );
      });
    });
  });

  describe('Entrepot Utilisateur', () => {
    beforeEach(async () => {
      await nettoieLaBaseDeDonneesUtilisateurs();
    });

    it('Persiste un utilisateur', async () => {
      const utilisateur = unUtilisateur().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new Map([
          [utilisateur.identifiantConnexion, 'aaa'],
          [utilisateur.motDePasse, 'bbb'],
          [utilisateur.nomPrenom, 'ccc'],
        ])
      );
      const entrepotUtilisateurPostgres = new EntrepotUtilisateurPostgres(
        serviceDeChiffrement
      );

      await entrepotUtilisateurPostgres.persiste(utilisateur);

      const utilisateurRecu = await entrepotUtilisateurPostgres.lis(
        utilisateur.identifiant
      );
      expect(utilisateurRecu).toStrictEqual<Utilisateur>({
        ...utilisateur,
        motDePasse: 'bbb',
      });
    });

    describe('Recherche par identifiant et mot de passe', () => {
      it("L'utilisateur est trouvé", async () => {
        const utilisateur = unUtilisateur().construis();
        const serviceDeChiffrement = new FauxServiceDeChiffrement(
          new Map([
            [utilisateur.identifiantConnexion, 'aaa'],
            [utilisateur.motDePasse, 'bbb'],
            [utilisateur.nomPrenom, 'ccc'],
          ])
        );
        const entrepotUtilisateurPostgres = new EntrepotUtilisateurPostgres(
          serviceDeChiffrement
        );
        await entrepotUtilisateurPostgres.persiste(utilisateur);

        const utilisateurRecu =
          await entrepotUtilisateurPostgres.rechercheParIdentifiantConnexionEtMotDePasse(
            utilisateur.identifiantConnexion,
            utilisateur.motDePasse
          );

        expect(utilisateurRecu).toStrictEqual<Utilisateur>({
          ...utilisateur,
          motDePasse: 'bbb',
        });
      });

      it("l'utilisateur n'est pas trouvé", () => {
        expect(
          new EntrepotUtilisateurPostgres(
            new FauxServiceDeChiffrement(new Map())
          ).rechercheParIdentifiantConnexionEtMotDePasse(
            'identifiant-inconnu',
            'mdp'
          )
        ).rejects.toThrow(new Error("Le utilisateur demandé n'existe pas."));
      });
    });

    describe('Recherche par identifiant', () => {
      it('L’utilisateur est trouvé', async () => {
        const utilisateur = unUtilisateur().construis();
        const serviceDeChiffrement = new FauxServiceDeChiffrement(
          new Map([
            [utilisateur.identifiantConnexion, 'aaa'],
            [utilisateur.motDePasse, 'bbb'],
            [utilisateur.nomPrenom, 'ccc'],
          ])
        );
        const entrepotUtilisateurPostgres = new EntrepotUtilisateurPostgres(
          serviceDeChiffrement
        );
        await entrepotUtilisateurPostgres.persiste(utilisateur);

        const utilisateurRecu =
          await entrepotUtilisateurPostgres.rechercheParIdentifiantDeConnexion(
            utilisateur.identifiantConnexion
          );

        expect(utilisateurRecu).toStrictEqual<Utilisateur>({
          ...utilisateur,
          motDePasse: 'bbb',
        });
      });

      it('L’utilisateur n’est pas trouvé', async () => {
        const entrepotUtilisateurPostgres = new EntrepotUtilisateurPostgres(
          new ServiceDeChiffrementClair()
        );
        expect(
          entrepotUtilisateurPostgres.rechercheParIdentifiantDeConnexion(
            'email-inconnu@mail.com'
          )
        ).rejects.toThrow(new Error("Le utilisateur demandé n'existe pas."));
      });
    });

    describe('Met à jour un utilisateur', () => {
      it('Met à jour la date de signature des CGU', async () => {
        const serviceDeChiffrement = new ServiceDeChiffrementClair();
        const entrepotUtilisateurPostgres = new EntrepotUtilisateurPostgres(
          serviceDeChiffrement
        );
        const dateSignature = new Date(Date.parse('2024-02-04T13:25:17+01:00'));
        FournisseurHorlogeDeTest.initialise(dateSignature);
        const utilisateur = unUtilisateur().sansCGUSignees().construis();
        await entrepotUtilisateurPostgres.persiste(utilisateur);

        utilisateur.dateSignatureCGU = FournisseurHorloge.maintenant();
        await entrepotUtilisateurPostgres.persiste(utilisateur);

        const utilisateurRecu = await entrepotUtilisateurPostgres.lis(
          utilisateur.identifiant
        );
        expect(utilisateurRecu.dateSignatureCGU).toStrictEqual(dateSignature);
      });
    });
  });

  describe('Entrepot profil aidant', () => {
    beforeEach(async () => {
      await nettoieLaBaseDeDonneesAidants();
      await nettoieLaBaseDeDonneesUtilisateurs();
    });

    it('Récupère le profil d’un Aidant', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const utilisateur = unUtilisateur().construis();
      const aidant = unAidant()
        .avecUnIdentifiant(utilisateur.identifiant)
        .construis();
      await new EntrepotUtilisateurPostgres(
        new ServiceDeChiffrementClair()
      ).persiste(utilisateur);
      await new EntrepotAidantPostgres(
        new ServiceDeChiffrementClair()
      ).persiste(aidant);

      const profilAidant = await new EntrepotProfilAidantPostgres(
        new ServiceDeChiffrementClair()
      ).lis(aidant.identifiant);

      expect(profilAidant).toStrictEqual<ProfilAidant>({
        identifiant: aidant.identifiant,
        nomPrenom: aidant.nomPrenom,
        consentementAnnuaire: false,
        email: aidant.email,
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        nomAffichageAnnuaire: aidant.preferences.nomAffichageAnnuaire,
      });
    });
  });

  describe('Entrepot Utilisateurs MAC', () => {
    const serviceDeChiffrementClair = new ServiceDeChiffrementClair();
    const entrepotAidantPostgres = new EntrepotAidantPostgres(
      new ServiceDeChiffrementClair()
    );
    const entrepotUtilisateurInscritPostgres =
      new EntrepotUtilisateurInscritPostgres(new ServiceDeChiffrementClair());
    const entrepotUtilisateurMACPostgres = new EntrepotUtilisateurMACPostgres(
      serviceDeChiffrementClair
    );

    beforeEach(async () => {
      await nettoieLaBaseDeDonneesAidants();
    });

    describe('Recherche par identifiant', () => {
      it('Retourne un utilisateur au profil Aidant', async () => {
        const aidant = unAidant().construis();
        await entrepotAidantPostgres.persiste(aidant);

        const utilisateurMAC =
          await entrepotUtilisateurMACPostgres.rechercheParIdentifiant(
            aidant.identifiant
          );

        expect(utilisateurMAC).toStrictEqual<UtilisateurMAC>({
          identifiant: aidant.identifiant,
          profil: 'Aidant',
          email: aidant.email,
          nomPrenom: aidant.nomPrenom,
          dateValidationCGU: aidant.dateSignatureCGU!,
        });
        expect(serviceDeChiffrementClair.dechiffreAEteAppele()).toBe(true);
      });

      it('Retourne un utilisateur au profil Gendarme', async () => {
        const aidant = unAidant().avecUnProfilGendarme().construis();
        await entrepotAidantPostgres.persiste(aidant);

        const utilisateurMAC =
          await entrepotUtilisateurMACPostgres.rechercheParIdentifiant(
            aidant.identifiant
          );

        expect(utilisateurMAC).toStrictEqual<UtilisateurMAC>({
          identifiant: aidant.identifiant,
          profil: 'Gendarme',
          email: aidant.email,
          nomPrenom: aidant.nomPrenom,
          dateValidationCGU: aidant.dateSignatureCGU!,
        });
      });

      it('Retourne un utilisateur au profil Utilisateur Inscrit', async () => {
        const utilisateurInscrit = unUtilisateurInscrit().construis();
        await entrepotUtilisateurInscritPostgres.persiste(utilisateurInscrit);

        const utilisateurMAC =
          await entrepotUtilisateurMACPostgres.rechercheParIdentifiant(
            utilisateurInscrit.identifiant
          );

        expect(utilisateurMAC).toStrictEqual<UtilisateurMAC>({
          identifiant: utilisateurInscrit.identifiant,
          profil: 'UtilisateurInscrit',
          nomPrenom: utilisateurInscrit.nomPrenom,
          email: utilisateurInscrit.email,
          dateValidationCGU: utilisateurInscrit.dateSignatureCGU!,
        });
      });

      it("Renvoie une erreur AggregatNonTrouvé si l'utilisateur n'existe pas", async () => {
        expect(
          entrepotUtilisateurMACPostgres.rechercheParIdentifiant(
            crypto.randomUUID()
          )
        ).rejects.toThrowError(new AggregatNonTrouve('utilisateur MAC'));
      });

      it('Renvoie la date de validation des CGU', async () => {
        const dateValidationCGU = new Date(Date.parse('2025-02-04T14:37:22'));
        const utilisateurInscrit = unUtilisateurInscrit()
          .avecUneDateDeSignatureDeCGU(dateValidationCGU)
          .construis();
        await entrepotUtilisateurInscritPostgres.persiste(utilisateurInscrit);

        const utilisateurMAC =
          await entrepotUtilisateurMACPostgres.rechercheParIdentifiant(
            utilisateurInscrit.identifiant
          );

        expect(utilisateurMAC.dateValidationCGU).toStrictEqual(
          dateValidationCGU
        );
      });
    });

    describe('Recherche par mail', () => {
      const email = 'jean.dupont@email.com';
      const nomPrenom = 'Jean Dupont';
      const fauxServiceDeChiffrement = new FauxServiceDeChiffrement(
        new Map([
          [email, 'ccc'],
          [nomPrenom, 'ddd'],
        ])
      );
      const entrepotUtilisateurMACPostgres = new EntrepotUtilisateurMACPostgres(
        fauxServiceDeChiffrement
      );
      const entrepotAidantPostgres = new EntrepotAidantPostgres(
        fauxServiceDeChiffrement
      );
      const entrepotUtilisateurInscritPostgres =
        new EntrepotUtilisateurInscritPostgres(fauxServiceDeChiffrement);

      it('Retourne un utilisateur au profil Aidant', async () => {
        const aidant = unAidant()
          .avecUnEmail(email)
          .avecUnNomPrenom(nomPrenom)
          .construis();
        await entrepotAidantPostgres.persiste(aidant);

        const utilisateurMAC =
          await entrepotUtilisateurMACPostgres.rechercheParMail(aidant.email);

        expect(utilisateurMAC).toStrictEqual<UtilisateurMAC>({
          identifiant: aidant.identifiant,
          profil: 'Aidant',
          nomPrenom: aidant.nomPrenom,
          email: aidant.email,
          dateValidationCGU: aidant.dateSignatureCGU!,
        });
      });

      it('Retourne un utilisateur au profil Gendarme', async () => {
        const aidant = unAidant()
          .avecUnEmail(email)
          .avecUnNomPrenom(nomPrenom)
          .avecUnProfilGendarme()
          .construis();
        await entrepotAidantPostgres.persiste(aidant);

        const utilisateurMAC =
          await entrepotUtilisateurMACPostgres.rechercheParMail(aidant.email);

        expect(utilisateurMAC).toStrictEqual<UtilisateurMAC>({
          identifiant: aidant.identifiant,
          profil: 'Gendarme',
          nomPrenom: aidant.nomPrenom,
          email: aidant.email,
          dateValidationCGU: aidant.dateSignatureCGU!,
        });
      });

      it('Retourne un utilisateur au profil Utilisateur Inscrit', async () => {
        const utilisateurInscrit = unUtilisateurInscrit()
          .avecUnEmail(email)
          .avecUnNomPrenom(nomPrenom)
          .construis();
        await entrepotUtilisateurInscritPostgres.persiste(utilisateurInscrit);

        const utilisateurMAC =
          await entrepotUtilisateurMACPostgres.rechercheParMail(
            utilisateurInscrit.email
          );

        expect(utilisateurMAC).toStrictEqual<UtilisateurMAC>({
          identifiant: utilisateurInscrit.identifiant,
          profil: 'UtilisateurInscrit',
          nomPrenom: utilisateurInscrit.nomPrenom,
          email: utilisateurInscrit.email,
          dateValidationCGU: utilisateurInscrit.dateSignatureCGU!,
        });
      });

      it("Renvoie une erreur AggregatNonTrouvé si l'utilisateur n'existe pas", async () => {
        expect(
          entrepotUtilisateurMACPostgres.rechercheParMail(
            'utilisateur-inconnu@email.com'
          )
        ).rejects.toThrowError(new AggregatNonTrouve('utilisateur MAC'));
      });

      it('Renvoie la date de validation des CGU', async () => {
        const dateValidationCGU = new Date(Date.parse('2025-02-04T14:37:22'));
        const utilisateurInscrit = unUtilisateurInscrit()
          .avecUneDateDeSignatureDeCGU(dateValidationCGU)
          .avecUnEmail(email)
          .avecUnNomPrenom(nomPrenom)
          .construis();
        await entrepotUtilisateurInscritPostgres.persiste(utilisateurInscrit);

        const utilisateurMAC =
          await entrepotUtilisateurMACPostgres.rechercheParMail(
            utilisateurInscrit.email
          );

        expect(utilisateurMAC.dateValidationCGU).toStrictEqual(
          dateValidationCGU
        );
      });
    });

    describe('Déchiffre', () => {
      it('Retourne un utilisateur au profil Aidant', async () => {
        const aidant = unAidant().construis();
        const fauxServiceChiffrement = new FauxServiceDeChiffrement(
          new Map([
            [aidant.nomPrenom, 'bbb'],
            [aidant.email, 'ccc'],
          ])
        );
        const entrepotAidantPostgres = new EntrepotAidantPostgres(
          fauxServiceChiffrement
        );
        const entrepotUtilisateurMACPostgres =
          new EntrepotUtilisateurMACPostgres(fauxServiceChiffrement);
        await entrepotAidantPostgres.persiste(aidant);

        const utilisateurMAC =
          await entrepotUtilisateurMACPostgres.rechercheParIdentifiant(
            aidant.identifiant
          );

        expect(utilisateurMAC).toStrictEqual<UtilisateurMAC>({
          identifiant: aidant.identifiant,
          profil: 'Aidant',
          nomPrenom: aidant.nomPrenom,
          email: aidant.email,
          dateValidationCGU: aidant.dateSignatureCGU!,
        });
      });
    });
  });

  describe('Entrepot Utilisateur Inscrit', () => {
    const serviceDeChiffrement: FauxServiceDeChiffrement =
      new FauxServiceDeChiffrement(new Map());
    let entrepot = new EntrepotUtilisateurInscritPostgres(serviceDeChiffrement);

    beforeEach(async () => {
      await nettoieLaBaseDeDonneesUtilisateursInscrits();
      serviceDeChiffrement.nettoie();
    });

    it('Persiste un utilisateur inscrit', async () => {
      const utilisateurInscrit = unUtilisateurInscrit().construis();
      serviceDeChiffrement.ajoute(utilisateurInscrit.email, 'aaa');
      serviceDeChiffrement.ajoute(utilisateurInscrit.nomPrenom, 'ccc');

      await entrepot.persiste(utilisateurInscrit);

      const utilisateurInscritRecu =
        await new EntrepotUtilisateurInscritPostgres(serviceDeChiffrement).lis(
          utilisateurInscrit.identifiant
        );
      expect(utilisateurInscritRecu).toStrictEqual<UtilisateurInscrit>(
        utilisateurInscrit
      );
    });

    it('Persiste un utilisateur sans entité', async () => {
      const utilisateurInscrit = unUtilisateurInscrit()
        .sansEntite()
        .construis();
      serviceDeChiffrement.ajoute(utilisateurInscrit.email, 'aaa');
      serviceDeChiffrement.ajoute(utilisateurInscrit.nomPrenom, 'ccc');

      await entrepot.persiste(utilisateurInscrit);

      const utilisateurInscritRecu =
        await new EntrepotUtilisateurInscritPostgres(serviceDeChiffrement).lis(
          utilisateurInscrit.identifiant
        );
      expect(utilisateurInscritRecu).toStrictEqual<UtilisateurInscrit>(
        utilisateurInscrit
      );
    });

    it('Persiste un utilisateur inscrit avec son Siret', async () => {
      const aidant = unUtilisateurInscrit()
        .avecLeSiret('1234567891')
        .construis();
      serviceDeChiffrement.ajoute(aidant.entite!.siret!, 'cccc');

      await entrepot.persiste(aidant);

      const utilisateurInscritRecu =
        await new EntrepotUtilisateurInscritPostgres(serviceDeChiffrement).lis(
          aidant.identifiant
        );
      expect(
        utilisateurInscritRecu.entite
      ).toStrictEqual<EntiteUtilisateurInscrit>({
        siret: aidant.entite!.siret!,
      });
    });

    it('Persiste un utilisateur inscrit avec la date de signature des CGU', async () => {
      const dateSignatureCGU = new Date();
      const aidant = unUtilisateurInscrit()
        .avecUneDateDeSignatureDeCGU(dateSignatureCGU)
        .construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(new Map());

      await entrepot.persiste(aidant);

      const utilisateurInscritRecu =
        await new EntrepotUtilisateurInscritPostgres(serviceDeChiffrement).lis(
          aidant.identifiant
        );
      expect(utilisateurInscritRecu.dateSignatureCGU).toStrictEqual(
        dateSignatureCGU
      );
    });

    it('Passe un Aidant en utilisateur inscrit', async () => {
      const aidant = unAidant().construis();
      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);
      const utilisateurInscrit = unUtilisateurInscrit()
        .avecUnIdentifiant(aidant.identifiant)
        .construis();
      serviceDeChiffrement.ajoute(utilisateurInscrit.email, 'aaa');
      serviceDeChiffrement.ajoute(utilisateurInscrit.nomPrenom, 'ccc');

      await entrepot.persiste(utilisateurInscrit);

      const utilisateurInscritRecu =
        await new EntrepotUtilisateurInscritPostgres(serviceDeChiffrement).lis(
          utilisateurInscrit.identifiant
        );
      expect(utilisateurInscritRecu).toStrictEqual<UtilisateurInscrit>(
        utilisateurInscrit
      );
    });

    describe('Pour le type Utilisateur inscrit', () => {
      it('Retourne une erreur s’il ne s’agit pas d’un Utilisateur inscrit', async () => {
        const id = crypto.randomUUID();
        await knex(knexfile)
          .insert({
            id,
            type: 'AIDANT',
            donnees: { email: 'jean.dupont@aidant.com' },
          })
          .into('utilisateurs_mac');

        const utilisateurInscritTrouve = new EntrepotUtilisateurInscritPostgres(
          new ServiceDeChiffrementClair()
        ).lis(id);

        expect(utilisateurInscritTrouve).rejects.toStrictEqual(
          new AggregatNonTrouve('utilisateur inscrit')
        );
      });

      it('Retourne uniquement les utilisateurs inscrits', async () => {
        const utilisateurInscrit = unUtilisateurInscrit().construis();
        const serviceDeChiffrement = new ServiceDeChiffrementClair();
        entrepot = new EntrepotUtilisateurInscritPostgres(serviceDeChiffrement);

        await entrepot.persiste(utilisateurInscrit);
        await knex(knexfile)
          .insert({
            id: crypto.randomUUID(),
            type: 'AIDANT',
            donnees: { email: 'jean.dupont@aidant.com' },
          })
          .into('utilisateurs_mac');

        const aidants = await new EntrepotUtilisateurInscritPostgres(
          serviceDeChiffrement
        ).tous();
        expect(aidants).toStrictEqual<UtilisateurInscrit[]>([
          utilisateurInscrit,
        ]);
      });
    });
  });

  describe('EntrepoStatistiquesUtilisateurInscrit', () => {
    beforeEach(async () => {
      await nettoieLaBaseDeDonneesAidants();
      await nettoieLaBaseDeDonneesRelations();
    });
    const entrepotRelation = new EntrepotRelationPostgres();

    it('Récupère les Aidants avec leur nombre de diagnostics', async () => {
      const premierUtilisateur = unUtilisateurInscrit().construis();
      const secondUtilisateur = unUtilisateurInscrit().construis();
      const troisiemeUtilisateur = unUtilisateurInscrit().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new Map([
          [premierUtilisateur.nomPrenom, 'abcd'],
          [premierUtilisateur.email, 'efgh'],
          [secondUtilisateur.nomPrenom, 'ijkl'],
          [secondUtilisateur.email, 'mnop'],
          [troisiemeUtilisateur.nomPrenom, 'qrst'],
          [troisiemeUtilisateur.email, 'uvwx'],
        ])
      );
      const entrepotAidant = new EntrepotAidantPostgres(serviceDeChiffrement);
      const entrepotUtilisateurInscritPostgres =
        new EntrepotUtilisateurInscritPostgres(serviceDeChiffrement);
      await entrepotUtilisateurInscritPostgres.persiste(premierUtilisateur);
      await entrepotUtilisateurInscritPostgres.persiste(secondUtilisateur);
      await entrepotUtilisateurInscritPostgres.persiste(troisiemeUtilisateur);
      await entrepotRelation.persiste(
        unTupleUtilisateurInscritInitieDiagnostic(
          premierUtilisateur.identifiant,
          crypto.randomUUID()
        )
      );
      await entrepotRelation.persiste(
        unTupleUtilisateurInscritInitieDiagnostic(
          premierUtilisateur.identifiant,
          crypto.randomUUID()
        )
      );
      await entrepotRelation.persiste(
        unTupleUtilisateurInscritInitieDiagnostic(
          secondUtilisateur.identifiant,
          crypto.randomUUID()
        )
      );
      await entrepotAidant.persiste(unAidant().construis());

      const entrepotStatistiquesUtilisateurInscrit =
        new EntrepotStatistiquesUtilisateursInscritsPostgres(
          serviceDeChiffrement
        );

      assert.sameDeepMembers(
        await entrepotStatistiquesUtilisateurInscrit.rechercheUtilisateursInscritsAvecNombreDeDiagnostics(),
        [
          {
            identifiant: premierUtilisateur.identifiant,
            nomPrenom: premierUtilisateur.nomPrenom,
            email: premierUtilisateur.email,
            nombreDiagnostics: 2,
          },
          {
            identifiant: secondUtilisateur.identifiant,
            nomPrenom: secondUtilisateur.nomPrenom,
            email: secondUtilisateur.email,
            nombreDiagnostics: 1,
          },
          {
            identifiant: troisiemeUtilisateur.identifiant,
            nomPrenom: troisiemeUtilisateur.nomPrenom,
            email: troisiemeUtilisateur.email,
            nombreDiagnostics: 0,
          },
        ]
      );
    });
  });
});
