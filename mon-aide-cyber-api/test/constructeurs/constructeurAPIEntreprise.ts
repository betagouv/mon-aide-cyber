import { Constructeur } from './constructeur';
import { APIEntreprise } from '../../src/infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import { fakerFR } from '@faker-js/faker';
import { LettreSecteur } from '../../src/api/recherche-entreprise/equivalenceSecteursActivite';
import { departements } from '../../src/gestion-demandes/departements';

const lettresSecteur: LettreSecteur[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
];

class ConstructeurAPIEntreprise implements Constructeur<APIEntreprise> {
  private apiEntreprise: APIEntreprise = {
    complements: { est_association: false, est_service_public: false },
    nom_complet: fakerFR.company.name(),
    section_activite_principale:
      lettresSecteur[fakerFR.number.int({ min: 0, max: 19 })],
    siege: {
      departement: departements.map((d) => d.nom)[
        fakerFR.number.int({ min: 0, max: 100 })
      ],
      libelle_commune: fakerFR.location.city(),
      siret: fakerFR.string.numeric(10),
    },
  };

  portantLeNom(nomEntreprise: string): ConstructeurAPIEntreprise {
    this.apiEntreprise.nom_complet = nomEntreprise;
    return this;
  }

  dansLaVille(localisation: {
    commune: string;
    departement: string;
    codeEPCI?: string;
  }): ConstructeurAPIEntreprise {
    this.apiEntreprise.siege.libelle_commune = localisation.commune;
    this.apiEntreprise.siege.departement = departements.find(
      (d) => d.code === localisation.departement
    )!.code;
    return this;
  }

  dansLeServicePublic(): ConstructeurAPIEntreprise {
    this.apiEntreprise.complements.est_service_public = true;
    return this;
  }

  estUneAssociation(): ConstructeurAPIEntreprise {
    this.apiEntreprise.complements.est_association = true;
    return this;
  }

  dansLePrive(): ConstructeurAPIEntreprise {
    this.apiEntreprise.complements.est_service_public = false;
    this.apiEntreprise.complements.est_association = false;
    return this;
  }

  dansAdministration(): ConstructeurAPIEntreprise {
    this.apiEntreprise.section_activite_principale = 'O';
    return this;
  }

  dansInformationEtCommunication(): ConstructeurAPIEntreprise {
    this.apiEntreprise.section_activite_principale = 'J';
    return this;
  }

  dansActivitesImmobilieres(): ConstructeurAPIEntreprise {
    this.apiEntreprise.section_activite_principale = 'L';
    return this;
  }

  avecLeSiret(numeroSIRET: string): ConstructeurAPIEntreprise {
    this.apiEntreprise.siege.siret = numeroSIRET;
    return this;
  }

  construis(): APIEntreprise {
    return this.apiEntreprise;
  }
}

export const unConstructeurDeReponseAPIEntreprise =
  (): ConstructeurAPIEntreprise => new ConstructeurAPIEntreprise();
