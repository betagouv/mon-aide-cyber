import { describe, expect, it } from 'vitest';
import { uneDemandeDevenirAidant } from '../../constructeurs/constructeurDemandesDevenirAidant';
import {
  EntrepotDemandeAideLectureMemoire,
  EntrepotDemandeDevenirAidantMemoire,
  EntrepotStatistiquesAidantMemoire,
} from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import {
  DemandeAide,
  DemandesAide,
  Entete,
  ListeDesAidants,
  Rapport,
  RepresentationRapport,
  StatistiquesAidant,
  uneExtraction,
} from '../../../src/espace-admin/extraction/Extraction';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import {
  DemandeDevenirAidant,
  DemandesDevenirAidant,
} from '../../../src/gestion-demandes/devenir-aidant/ServiceDemandeDevenirAidant';
import { uneDemandeAide } from '../../gestion-demandes/aide/ConstructeurDemandeAide';
import { EntrepotRelationMemoire } from '../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { uneStatistiqueAidant } from '../../constructeurs/constructeurStatistiqueAidant';

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
    const key = representation.intitule.toLowerCase().replace(/ /g, '-');
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
    return Promise.resolve({
      'demandes-devenir-aidant': demandesDevenirAidant,
      ...(demandesAvantArbitrage.length > 0 && {
        'demandes-avant-arbitrage': demandesAvantArbitrage,
      }),
      ...(demandesAide &&
        demandesAide.length > 0 && { 'demandes-aide': demandesAide }),
      ...(listeDesAidants &&
        listeDesAidants.length > 0 && { 'liste-des-aidants': listeDesAidants }),
    });
  }
}

type RepresentationJSON = {
  'demandes-devenir-aidant': DemandesDevenirAidant;
  'demandes-avant-arbitrage'?: DemandesDevenirAidant;
  'demandes-aide'?: DemandesAide;
  'liste-des-aidants'?: ListeDesAidants;
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
      }).extrais<RepresentationJSON>(new RapportJSON());

      expect(rapport).toStrictEqual<{ [clef: string]: DemandesDevenirAidant }>({
        'demandes-devenir-aidant': [
          {
            nom: demande.nom,
            prenom: demande.prenom,
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
      const demandeAvantArbitrage = uneDemandeDevenirAidant()
        .avantArbitrage()
        .construis();
      const entrepotDemande = new EntrepotDemandeDevenirAidantMemoire();
      await entrepotDemande.persiste(demande);
      await entrepotDemande.persiste(demandeAvantArbitrage);

      const rapport = await uneExtraction({
        entrepotDemandes: entrepotDemande,
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
      }).extrais<RepresentationJSON>(new RapportJSON());

      expect(
        rapport['demandes-devenir-aidant']
      ).toStrictEqual<DemandesDevenirAidant>([
        {
          nom: demande.nom,
          prenom: demande.prenom,
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
      }).extrais<RepresentationJSON>(rapportJSON);

      expect(rapportJSON.entetes.get('demandes-devenir-aidant')).toStrictEqual<
        Entete<DemandeDevenirAidant>[]
      >([
        { entete: 'Nom', clef: 'nom' },
        { entete: 'Prénom', clef: 'prenom' },
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
      }).extrais<RepresentationJSON>(new RapportJSON());

      expect(rapport['demandes-devenir-aidant'][0].entiteMorale).toStrictEqual(
        demande.entite?.nom
      );
    });

    it('Fournit l’information si le futur Aidant est en attente d’adhésion à une association', async () => {
      const demande = uneDemandeDevenirAidant().enAttenteAdhesion().construis();
      const entrepotDemande = new EntrepotDemandeDevenirAidantMemoire();
      await entrepotDemande.persiste(demande);

      const rapport = await uneExtraction({
        entrepotDemandes: entrepotDemande,
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
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
      const demandeAvantArbitrage = uneDemandeDevenirAidant()
        .avantArbitrage()
        .construis();
      const entrepotDemande = new EntrepotDemandeDevenirAidantMemoire();
      await entrepotDemande.persiste(demande);
      await entrepotDemande.persiste(demandeAvantArbitrage);

      const rapport = await uneExtraction({
        entrepotDemandes: entrepotDemande,
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
      }).extrais<RepresentationJSON>(new RapportJSON());

      expect(rapport).toStrictEqual<{ [clef: string]: DemandesDevenirAidant }>({
        'demandes-devenir-aidant': [
          {
            nom: demande.nom,
            prenom: demande.prenom,
            dateDemande: FournisseurHorloge.formateDate(demande.date).date,
            departement: demande.departement.nom,
            entiteMorale: demande.entite!.nom!,
          },
        ],
        'demandes-avant-arbitrage': [
          {
            nom: demandeAvantArbitrage.nom,
            prenom: demandeAvantArbitrage.prenom,
            dateDemande: FournisseurHorloge.formateDate(demande.date).date,
            departement: demande.departement.nom,
          },
        ],
      });
    });

    it('Le rapport contient entête et intitulé', async () => {
      const demande = uneDemandeDevenirAidant().avantArbitrage().construis();
      const entrepotDemande = new EntrepotDemandeDevenirAidantMemoire();
      await entrepotDemande.persiste(demande);

      const rapportJSON = new RapportJSON();
      await uneExtraction({
        entrepotDemandes: entrepotDemande,
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
      }).extrais<RepresentationJSON>(rapportJSON);

      expect(rapportJSON.entetes.get('demandes-avant-arbitrage')).toStrictEqual<
        Entete<DemandeDevenirAidant>[]
      >([
        { entete: 'Nom', clef: 'nom' },
        { entete: 'Prénom', clef: 'prenom' },
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
      const entrepotAidant = new EntrepotStatistiquesAidantMemoire(
        new EntrepotRelationMemoire()
      );
      const aidant = await uneStatistiqueAidant(
        entrepotAidant,
        new EntrepotRelationMemoire()
      ).construis();

      const rapportJSON = new RapportJSON();
      const rapport = await uneExtraction({
        entrepotDemandes: new EntrepotDemandeDevenirAidantMemoire(),
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: entrepotAidant,
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
      const entrepotAidant = new EntrepotStatistiquesAidantMemoire(
        new EntrepotRelationMemoire()
      );
      await uneStatistiqueAidant(
        entrepotAidant,
        new EntrepotRelationMemoire()
      ).construis();

      const rapportJSON = new RapportJSON();
      await uneExtraction({
        entrepotDemandes: new EntrepotDemandeDevenirAidantMemoire(),
        entrepotDemandesAide: new EntrepotDemandeAideLectureMemoire(),
        entrepotStatistiquesAidant: new EntrepotStatistiquesAidantMemoire(
          new EntrepotRelationMemoire()
        ),
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
});
