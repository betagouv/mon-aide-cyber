import { describe, expect, it } from 'vitest';
import { uneDemandeDevenirAidant } from '../../constructeurs/constructeurDemandesDevenirAidant';
import { EntrepotDemandeDevenirAidantMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import {
  Entete,
  Rapport,
  RepresentationRapport,
  uneExtraction,
} from '../../../src/espace-admin/extraction/Extraction';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import {
  DemandeDevenirAidant,
  DemandesDevenirAidant,
} from '../../../src/gestion-demandes/devenir-aidant/ServiceDemandeDevenirAidant';

class RapportJSON implements Rapport<RepresentationJSON> {
  private readonly representations: Map<string, DemandesDevenirAidant> =
    new Map();
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
    return Promise.resolve({
      'demandes-devenir-aidant': demandesDevenirAidant,
      ...(demandesAvantArbitrage.length > 0 && {
        'demandes-avant-arbitrage': demandesAvantArbitrage,
      }),
    });
  }
}

type RepresentationJSON = {
  'demandes-devenir-aidant': DemandesDevenirAidant;
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
});
