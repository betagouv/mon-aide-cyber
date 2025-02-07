import { describe, expect, it } from 'vitest';
import { uneDemandeDevenirAidant } from '../../constructeurs/constructeurDemandesDevenirAidant';
import { EntrepotDemandeDevenirAidantMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import {
  Rapport,
  uneExtraction,
} from '../../../src/espace-admin/extraction/Extraction';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { DemandesDevenirAidant } from '../../../src/gestion-demandes/devenir-aidant/ServiceDemandeDevenirAidant';

class RapportJSON implements Rapport<RepresentationJSON> {
  private readonly representations: Map<string, DemandesDevenirAidant> =
    new Map();

  ajoute<
    REPRESENTATION_VALEUR,
    REPRESENTATION_RAPPORT extends {
      entete: string | string[];
      intitule: string;
      valeur: REPRESENTATION_VALEUR;
    },
  >(representation: REPRESENTATION_RAPPORT): void {
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
  it('Extrais les demandes en cours', async () => {
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
});
