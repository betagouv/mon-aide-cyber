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
  public entete: any[] = [];
  public intitule = '';

  ajoute<
    REPRESENTATION_VALEUR,
    REPRESENTATION_RAPPORT extends RepresentationRapport<
      REPRESENTATION_VALEUR,
      any
    >,
  >(representation: REPRESENTATION_RAPPORT): void {
    this.entete = representation.entetes;
    this.intitule = representation.intitule;
    const key = representation.intitule.toLowerCase().replace(/ /g, '-');
    this.representations.set(
      key,
      representation.valeur as DemandesDevenirAidant
    );
  }

  genere(): Promise<RepresentationJSON> {
    return Promise.resolve({
      'demandes-devenir-aidant': this.representations.get(
        'demandes-devenir-aidant'
      ) as DemandesDevenirAidant,
    });
  }
}

type RepresentationJSON = {
  'demandes-devenir-aidant': DemandesDevenirAidant;
};

describe('Extraction', () => {
  it('Extrait les demandes en cours', async () => {
    const demande = uneDemandeDevenirAidant().construis();
    const entrepotDemande = new EntrepotDemandeDevenirAidantMemoire();
    await entrepotDemande.persiste(demande);

    const rapport = await uneExtraction({
      entrepotDemandes: entrepotDemande,
    }).extrais<RepresentationJSON>(new RapportJSON());

    expect(rapport).toStrictEqual({
      'demandes-devenir-aidant': [
        {
          nom: demande.nom,
          prenom: demande.prenom,
          dateDemande: FournisseurHorloge.formateDate(demande.date).date,
          departement: demande.departement.nom,
        },
      ],
    });
  });

  it('Le rapport contient entête et intitulé', async () => {
    const demande = uneDemandeDevenirAidant().construis();
    const entrepotDemande = new EntrepotDemandeDevenirAidantMemoire();
    await entrepotDemande.persiste(demande);

    const rapportJSON = new RapportJSON();
    await uneExtraction({
      entrepotDemandes: entrepotDemande,
    }).extrais<RepresentationJSON>(rapportJSON);

    expect(rapportJSON.entete).toStrictEqual<Entete<DemandeDevenirAidant>[]>([
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
    expect(rapportJSON.intitule).toStrictEqual('Demandes devenir Aidant');
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
