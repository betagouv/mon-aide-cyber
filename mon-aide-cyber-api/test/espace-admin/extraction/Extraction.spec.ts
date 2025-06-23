import { describe, expect, it } from 'vitest';
import { uneDemandeDevenirAidant } from '../../constructeurs/constructeurDemandesDevenirAidant';
import {
  EntrepotDemandeAideLectureMemoire,
  EntrepotDemandeDevenirAidantMemoire,
  EntrepotStatistiquesAidantMemoire,
  EntrepotStatistiquesUtilisateursInscritsMemoire,
  EntrepotUtilisateurMemoire,
} from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import {
  DemandeAide,
  DemandesAide,
  Entete,
  ListeDesAidants,
  ListeDesAidantsDevenusUtilisateursInscrits,
  ListeDesUtilisateursInscrits,
  Rapport,
  RepresentationRapport,
  StatistiquesAidant,
  StatistiquesUtilisateurInscrit,
  uneExtraction,
} from '../../../src/espace-admin/extraction/Extraction';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import {
  DemandeDevenirAidant,
  DemandesDevenirAidant,
} from '../../../src/gestion-demandes/devenir-aidant/ServiceDemandeDevenirAidant';
import { DemandeDevenirAidant as DomaineDemandeDevenirAidant } from '../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { uneDemandeAide } from '../../gestion-demandes/aide/ConstructeurDemandeAide';
import { EntrepotRelationMemoire } from '../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { uneStatistiqueAidant } from '../../constructeurs/constructeurStatistiqueAidant';
import { uneStatistiqueUtilisateurInscrit } from '../../constructeurs/constructeurStatistiquesUtilisateurInscrit';
import { unUtilisateur } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';

class RapportJSON implements Rapport<RepresentationJSON> {
  private readonly representations: Map<
    string,
    DemandesDevenirAidant | DemandesAide | ListeDesAidants
  > = new Map();
  public entetes: Map<string, any[]> = new Map();
  public intitule: Map<string, string> = new Map();

  ajoute<
    REPRESENTATION_VALEUR,
    REPRESENTATION_RAPPORT extends RepresentationRapport<
      REPRESENTATION_VALEUR,
      any
    >,
  >(representation: REPRESENTATION_RAPPORT): void {
    const key = representation.intitule
      .toLowerCase()
      .replace(/ /g, '-')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace('’', '-');
    this.entetes.set(key, representation.entetes);
    this.intitule.set(key, representation.intitule);
    this.representations.set(
      key,
      representation.valeur as DemandesDevenirAidant
    );
  }

  genere(): Promise<RepresentationJSON> {
    const demandesDevenirAidant = this.representations.get(
      'demandes-devenir-aidant'
    ) as DemandesDevenirAidant;
    const demandesAvantArbitrage = this.representations.get(
      'demandes-avant-arbitrage'
    ) as DemandesDevenirAidant;
    const demandesAide = this.representations.get(
      'demandes-aide'
    ) as DemandesAide;
    const listeDesAidants = this.representations.get(
      'liste-des-aidants'
    ) as ListeDesAidants;
    const listeDesUtilisateursInscrits = this.representations.get(
      'liste-des-utilisateurs-inscrits'
    ) as ListeDesUtilisateursInscrits;
    const listeDesAidantsDevenusUtilisateursInscrits = this.representations.get(
      'liste-des-aidants-ayant-fait-le-choix-d-utiliser-mac-a-des-fins-commerciales'
    ) as ListeDesAidantsDevenusUtilisateursInscrits;
    return Promise.resolve({
      'demandes-devenir-aidant': demandesDevenirAidant,
      ...(demandesAvantArbitrage.length > 0 && {
        'demandes-avant-arbitrage': demandesAvantArbitrage,
      }),
      ...(demandesAide &&
        demandesAide.length > 0 && { 'demandes-aide': demandesAide }),
      ...(listeDesAidants &&
        listeDesAidants.length > 0 && { 'liste-des-aidants': listeDesAidants }),
      ...(listeDesUtilisateursInscrits &&
        listeDesUtilisateursInscrits.length > 0 && {
          'liste-des-utilisateurs-inscrits': listeDesUtilisateursInscrits,
        }),
      ...(listeDesAidantsDevenusUtilisateursInscrits &&
        listeDesAidantsDevenusUtilisateursInscrits.length > 0 && {
          'liste-des-aidants-ayant-fait-le-choix-d-utiliser-mac-a-des-fins-commerciales':
            listeDesAidantsDevenusUtilisateursInscrits,
        }),
    });
  }
}

type RepresentationJSON = {
  'demandes-devenir-aidant': DemandesDevenirAidant;
  'demandes-avant-arbitrage'?: DemandesDevenirAidant;
  'demandes-aide'?: DemandesAide;
  'liste-des-aidants'?: ListeDesAidants;
  'liste-des-utilisateurs-inscrits'?: ListeDesUtilisateursInscrits;
};

describe('Extraction', () => {
  describe('Pour les demandes devenir Aidant en cours', () => {
    it('Extrait les demandes', async () => {
      const demande = uneDemandeDevenirAidant()
        .avecEntiteMorale('ServiceEtat')
        .construis();
      const entrepotDemande = new EntrepotDemandeDevenirAidantMemoire();
      await entrepotDemande.persiste(demande);

      const rapport = await uneExtraction({
        entrepotDemandes: entrepotDemande,
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit:
          new EntrepotStatistiquesUtilisateursInscritsMemoire(
            new EntrepotRelationMemoire()
          ),
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(new RapportJSON());

      expect(rapport).toStrictEqual<{ [clef: string]: DemandesDevenirAidant }>({
        'demandes-devenir-aidant': [
          {
            nom: demande.nom,
            prenom: demande.prenom,
            email: demande.mail,
            dateDemande: FournisseurHorloge.formateDate(demande.date).date,
            departement: demande.departement.nom,
            entiteMorale: demande.entite!.nom!,
          },
        ],
      });
    });

    it('Contient uniquement les nouvelles demandes suite à l’arbitrage', async () => {
      const demande = uneDemandeDevenirAidant()
        .avecEntiteMorale('ServicePublic')
        .construis();
      const { entite, ...demandeAvantArbitrage } =
        uneDemandeDevenirAidant().construis();
      const entrepotDemande = new EntrepotDemandeDevenirAidantMemoire();
      await entrepotDemande.persiste(demande);
      await entrepotDemande.persiste(
        demandeAvantArbitrage as DomaineDemandeDevenirAidant
      );

      const rapport = await uneExtraction({
        entrepotDemandes: entrepotDemande,
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit:
          new EntrepotStatistiquesUtilisateursInscritsMemoire(
            new EntrepotRelationMemoire()
          ),
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(new RapportJSON());

      expect(
        rapport['demandes-devenir-aidant']
      ).toStrictEqual<DemandesDevenirAidant>([
        {
          nom: demande.nom,
          prenom: demande.prenom,
          email: demande.mail,
          dateDemande: FournisseurHorloge.formateDate(demande.date).date,
          departement: demande.departement.nom,
          entiteMorale: demande.entite!.nom!,
        },
      ]);
    });

    it('Le rapport contient entête et intitulé', async () => {
      const demande = uneDemandeDevenirAidant().construis();
      const entrepotDemande = new EntrepotDemandeDevenirAidantMemoire();
      await entrepotDemande.persiste(demande);

      const rapportJSON = new RapportJSON();
      await uneExtraction({
        entrepotDemandes: entrepotDemande,
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit:
          new EntrepotStatistiquesUtilisateursInscritsMemoire(
            new EntrepotRelationMemoire()
          ),
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(rapportJSON);

      expect(rapportJSON.entetes.get('demandes-devenir-aidant')).toStrictEqual<
        Entete<DemandeDevenirAidant>[]
      >([
        { entete: 'Nom', clef: 'nom' },
        { entete: 'Prénom', clef: 'prenom' },
        { entete: 'Email', clef: 'email' },
        { entete: 'Date de la demande', clef: 'dateDemande' },
        { entete: 'Département', clef: 'departement' },
        { entete: 'Entité Morale', clef: 'entiteMorale' },
        {
          entete: 'En attente d’adhésion à une Association',
          clef: 'enAttenteAdhesion',
        },
      ]);
      expect(rapportJSON.intitule.get('demandes-devenir-aidant')).toStrictEqual(
        'Demandes devenir Aidant'
      );
    });

    it('Fournit l’entité morale de la demande', async () => {
      const demande = uneDemandeDevenirAidant()
        .avecEntiteMorale('ServicePublic')
        .construis();
      const entrepotDemande = new EntrepotDemandeDevenirAidantMemoire();
      await entrepotDemande.persiste(demande);

      const rapport = await uneExtraction({
        entrepotDemandes: entrepotDemande,
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit:
          new EntrepotStatistiquesUtilisateursInscritsMemoire(
            new EntrepotRelationMemoire()
          ),
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(new RapportJSON());

      expect(rapport['demandes-devenir-aidant'][0].entiteMorale).toStrictEqual(
        demande.entite?.nom
      );
    });

    it('Fournit l’information si le futur Aidant est en attente d’adhésion à une association', async () => {
      const { entite, ...demandeEnAttenteAdhesion } =
        uneDemandeDevenirAidant().construis();
      const entrepotDemande = new EntrepotDemandeDevenirAidantMemoire();
      await entrepotDemande.persiste({
        ...demandeEnAttenteAdhesion,
        entite: { type: 'Association' },
      } as DomaineDemandeDevenirAidant);

      const rapport = await uneExtraction({
        entrepotDemandes: entrepotDemande,
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit:
          new EntrepotStatistiquesUtilisateursInscritsMemoire(
            new EntrepotRelationMemoire()
          ),
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(new RapportJSON());

      expect(
        rapport['demandes-devenir-aidant'][0].enAttenteAdhesion
      ).toStrictEqual('Oui');
    });
  });

  describe('Pour les demandes devenir Aidant en cours avant arbitrage', () => {
    it('Extrait les demandes', async () => {
      const demande = uneDemandeDevenirAidant()
        .avecEntiteMorale('ServiceEtat')
        .construis();
      const { entite, ...demandeAvantArbitrage } =
        uneDemandeDevenirAidant().construis();
      const entrepotDemande = new EntrepotDemandeDevenirAidantMemoire();
      await entrepotDemande.persiste(demande);
      await entrepotDemande.persiste(
        demandeAvantArbitrage as DomaineDemandeDevenirAidant
      );

      const rapport = await uneExtraction({
        entrepotDemandes: entrepotDemande,
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit:
          new EntrepotStatistiquesUtilisateursInscritsMemoire(
            new EntrepotRelationMemoire()
          ),
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(new RapportJSON());

      expect(rapport).toStrictEqual<{ [clef: string]: DemandesDevenirAidant }>({
        'demandes-devenir-aidant': [
          {
            nom: demande.nom,
            prenom: demande.prenom,
            email: demande.mail,
            dateDemande: FournisseurHorloge.formateDate(demande.date).date,
            departement: demande.departement.nom,
            entiteMorale: demande.entite!.nom!,
          },
        ],
        'demandes-avant-arbitrage': [
          {
            nom: demandeAvantArbitrage.nom,
            prenom: demandeAvantArbitrage.prenom,
            email: demandeAvantArbitrage.mail,
            dateDemande: FournisseurHorloge.formateDate(demande.date).date,
            departement: demande.departement.nom,
          },
        ],
      });
    });

    it('Le rapport contient entête et intitulé', async () => {
      const { entite, ...demandeAvantArbitrage } =
        uneDemandeDevenirAidant().construis();
      const entrepotDemande = new EntrepotDemandeDevenirAidantMemoire();
      await entrepotDemande.persiste(
        demandeAvantArbitrage as DomaineDemandeDevenirAidant
      );

      const rapportJSON = new RapportJSON();
      await uneExtraction({
        entrepotDemandes: entrepotDemande,
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit:
          new EntrepotStatistiquesUtilisateursInscritsMemoire(
            new EntrepotRelationMemoire()
          ),
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(rapportJSON);

      expect(rapportJSON.entetes.get('demandes-avant-arbitrage')).toStrictEqual<
        Entete<DemandeDevenirAidant>[]
      >([
        { entete: 'Nom', clef: 'nom' },
        { entete: 'Prénom', clef: 'prenom' },
        { entete: 'Email', clef: 'email' },
        { entete: 'Date de la demande', clef: 'dateDemande' },
        { entete: 'Département', clef: 'departement' },
      ]);
      expect(
        rapportJSON.intitule.get('demandes-avant-arbitrage')
      ).toStrictEqual('Demandes avant arbitrage');
    });
  });

  describe('Pour les demandes d’Aide', () => {
    it('Extrait les demandes', async () => {
      const demandeAide = uneDemandeAide().construis();
      const entrepotAide = new EntrepotDemandeAideLectureMemoire();
      await entrepotAide.persiste(demandeAide);

      const rapport = await uneExtraction({
        entrepotDemandes: new EntrepotDemandeDevenirAidantMemoire(),
        entrepotDemandesAide: entrepotAide,
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit:
          new EntrepotStatistiquesUtilisateursInscritsMemoire(
            new EntrepotRelationMemoire()
          ),
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(new RapportJSON());

      expect(rapport).toStrictEqual<{
        [clef: string]: DemandesDevenirAidant | DemandesAide;
      }>({
        'demandes-devenir-aidant': [],
        'demandes-aide': [
          {
            dateDemande: FournisseurHorloge.formateDate(
              demandeAide.dateSignatureCGU
            ).date,
          },
        ],
      });
    });

    it('Le rapport contient entête et intitulé', async () => {
      const demandeAide = uneDemandeAide().construis();
      const entrepotAide = new EntrepotDemandeAideLectureMemoire();
      await entrepotAide.persiste(demandeAide);

      const rapportJSON = new RapportJSON();
      await uneExtraction({
        entrepotDemandes: new EntrepotDemandeDevenirAidantMemoire(),
        entrepotDemandesAide: entrepotAide,
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit:
          new EntrepotStatistiquesUtilisateursInscritsMemoire(
            new EntrepotRelationMemoire()
          ),
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(rapportJSON);

      expect(rapportJSON.entetes.get('demandes-aide')).toStrictEqual<
        Entete<DemandeAide>[]
      >([{ entete: 'Date de la demande', clef: 'dateDemande' }]);
      expect(rapportJSON.intitule.get('demandes-aide')).toStrictEqual(
        'Demandes Aide'
      );
    });
  });

  describe('Pour les Aidants', () => {
    it('Extrais les Aidants', async () => {
      const entrepotRelation = new EntrepotRelationMemoire();
      const entrepotAidant = new EntrepotStatistiquesAidantMemoire(
        entrepotRelation
      );
      const aidant = await uneStatistiqueAidant(
        entrepotAidant,
        entrepotRelation
      ).construis();

      const rapportJSON = new RapportJSON();
      const rapport = await uneExtraction({
        entrepotDemandes: new EntrepotDemandeDevenirAidantMemoire(),
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: entrepotAidant,
        entrepotStatistiquesUtilisateurInscrit:
          new EntrepotStatistiquesUtilisateursInscritsMemoire(entrepotRelation),
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(rapportJSON);

      expect(rapport).toStrictEqual<{
        [clef: string]: DemandesDevenirAidant | DemandesAide | ListeDesAidants;
      }>({
        'demandes-devenir-aidant': [],
        'liste-des-aidants': [
          {
            nomPrenom: aidant.nomPrenom,
            email: aidant.email,
            departements: aidant.departements.map((d) => d.nom).join(','),
            entiteMorale: aidant.entite,
            nombreDiagnostics: 0,
          },
        ],
      });
    });

    it('Le rapport contient entête et intitulé', async () => {
      const rapportJSON = new RapportJSON();

      await uneExtraction({
        entrepotDemandes: new EntrepotDemandeDevenirAidantMemoire(),
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit:
          new EntrepotStatistiquesUtilisateursInscritsMemoire(
            new EntrepotRelationMemoire()
          ),
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(rapportJSON);

      expect(rapportJSON.entetes.get('liste-des-aidants')).toStrictEqual<
        Entete<StatistiquesAidant>[]
      >([
        { entete: 'Nom Prénom', clef: 'nomPrenom' },
        { entete: 'Département', clef: 'departements' },
        { entete: 'Mail', clef: 'email' },
        { entete: 'Entité Morale', clef: 'entiteMorale' },
        {
          entete: 'Nombre de diagnostics effectués',
          clef: 'nombreDiagnostics',
        },
      ]);
      expect(rapportJSON.intitule.get('liste-des-aidants')).toStrictEqual(
        'Liste des Aidants'
      );
    });
  });

  describe('Pour les utilisateurs inscrits', () => {
    it('Extrais les utilisateurs inscrits', async () => {
      const entrepotRelation = new EntrepotRelationMemoire();
      const entrepotUtilisateurInscrit =
        new EntrepotStatistiquesUtilisateursInscritsMemoire(entrepotRelation);
      const statistiqueUtilisateurInscrit =
        await uneStatistiqueUtilisateurInscrit(
          entrepotUtilisateurInscrit,
          entrepotRelation
        )
          .ayantFaitNDiagnostics(2)
          .construis();

      const rapportJSON = new RapportJSON();
      const rapport = await uneExtraction({
        entrepotDemandes: new EntrepotDemandeDevenirAidantMemoire(),
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit: entrepotUtilisateurInscrit,
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(rapportJSON);

      expect(rapport).toStrictEqual<{
        [clef: string]:
          | DemandesDevenirAidant
          | DemandesAide
          | ListeDesAidants
          | ListeDesUtilisateursInscrits;
      }>({
        'demandes-devenir-aidant': [],
        'liste-des-utilisateurs-inscrits': [
          {
            nomPrenom: statistiqueUtilisateurInscrit.nomPrenom,
            email: statistiqueUtilisateurInscrit.email,
            nombreDiagnostics: 2,
          },
        ],
      });
    });

    it('Le rapport contient entête et intitulé', async () => {
      const rapportJSON = new RapportJSON();

      await uneExtraction({
        entrepotDemandes: new EntrepotDemandeDevenirAidantMemoire(),
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit:
          new EntrepotStatistiquesUtilisateursInscritsMemoire(
            new EntrepotRelationMemoire()
          ),
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(rapportJSON);

      expect(
        rapportJSON.entetes.get('liste-des-utilisateurs-inscrits')
      ).toStrictEqual<Entete<StatistiquesUtilisateurInscrit>[]>([
        { entete: 'Nom Prénom', clef: 'nomPrenom' },
        { entete: 'Mail', clef: 'email' },
        {
          entete: 'Nombre de diagnostics effectués',
          clef: 'nombreDiagnostics',
        },
      ]);
      expect(
        rapportJSON.intitule.get('liste-des-utilisateurs-inscrits')
      ).toStrictEqual('Liste des Utilisateurs Inscrits');
    });
  });

  describe('Pour les Aidants ayant choisi d’être utilisateurs inscrits', () => {
    it('Extrais les Aidants ayant fait le choix d’être utilisateurs inscrits', async () => {
      const entrepotRelation = new EntrepotRelationMemoire();
      const entrepotUtilisateurInscrit =
        new EntrepotStatistiquesUtilisateursInscritsMemoire(entrepotRelation);
      const statistiquesUtilisateurInscrit =
        await uneStatistiqueUtilisateurInscrit(
          entrepotUtilisateurInscrit,
          entrepotRelation
        )
          .ayantFaitNDiagnostics(2)
          .construis();
      const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      const compteUtilisateurMAC = unUtilisateur()
        .avecUnIdentifiant(statistiquesUtilisateurInscrit.identifiant)
        .construis();
      await entrepotUtilisateur.persiste(compteUtilisateurMAC);

      const rapportJSON = new RapportJSON();
      const rapport = await uneExtraction({
        entrepotDemandes: new EntrepotDemandeDevenirAidantMemoire(),
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit: entrepotUtilisateurInscrit,
        entrepotUtilisateur,
      }).extrais<RepresentationJSON>(rapportJSON);

      expect(rapport).toStrictEqual<{
        [clef: string]:
          | DemandesDevenirAidant
          | DemandesAide
          | ListeDesAidants
          | ListeDesUtilisateursInscrits
          | ListeDesAidantsDevenusUtilisateursInscrits;
      }>({
        'demandes-devenir-aidant': [],
        'liste-des-utilisateurs-inscrits': [
          {
            nomPrenom: statistiquesUtilisateurInscrit.nomPrenom,
            email: statistiquesUtilisateurInscrit.email,
            nombreDiagnostics: 2,
          },
        ],
        'liste-des-aidants-ayant-fait-le-choix-d-utiliser-mac-a-des-fins-commerciales':
          [
            {
              nomPrenom: statistiquesUtilisateurInscrit.nomPrenom,
              email: statistiquesUtilisateurInscrit.email,
              nombreDiagnostics: 2,
            },
          ],
      });
    });

    it('Le rapport contient entête et intitulé', async () => {
      const rapportJSON = new RapportJSON();

      await uneExtraction({
        entrepotDemandes: new EntrepotDemandeDevenirAidantMemoire(),
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
        entrepotStatistiquesUtilisateurInscrit:
          new EntrepotStatistiquesUtilisateursInscritsMemoire(
            new EntrepotRelationMemoire()
          ),
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      }).extrais<RepresentationJSON>(rapportJSON);

      expect(
        rapportJSON.entetes.get(
          'liste-des-aidants-ayant-fait-le-choix-d-utiliser-mac-a-des-fins-commerciales'
        )
      ).toStrictEqual<Entete<StatistiquesUtilisateurInscrit>[]>([
        { entete: 'Nom Prénom', clef: 'nomPrenom' },
        { entete: 'Mail', clef: 'email' },
        {
          entete: 'Nombre de diagnostics effectués',
          clef: 'nombreDiagnostics',
        },
      ]);
      expect(
        rapportJSON.intitule.get(
          'liste-des-aidants-ayant-fait-le-choix-d-utiliser-mac-a-des-fins-commerciales'
        )
      ).toStrictEqual(
        'Liste des Aidants ayant fait le choix d’utiliser mac à des fins commerciales'
      );
    });
  });
});
