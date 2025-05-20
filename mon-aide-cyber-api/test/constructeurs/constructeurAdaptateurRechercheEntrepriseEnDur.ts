import {
  AdaptateurRechercheEntreprise,
  Entreprise,
} from '../../src/infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import { Constructeur } from './constructeur';
import {
  entitesPrivees,
  entitesPubliques,
} from '../../src/espace-aidant/Aidant';

class ConstructeurAdaptateurRechercheEntrepriseEnDur
  implements Constructeur<AdaptateurRechercheEntreprise>
{
  private reponse: Entreprise[] = [
    {
      siret: '12345678912345',
      nom: 'Une entreprise',
      departement: '33',
      commune: 'Bordeaux',
      codeEpci: 'Bordeaux Métropole',
      typeEntite: entitesPrivees,
      secteursActivite: [],
    },
  ];

  vide(): ConstructeurAdaptateurRechercheEntrepriseEnDur {
    this.reponse = [];
    return this;
  }

  dansAdministration(): ConstructeurAdaptateurRechercheEntrepriseEnDur {
    this.reponse[0].secteursActivite = [
      { nom: 'Administration' },
      { nom: 'Tertiaire' },
    ];
    return this;
  }

  dansLeServicePublic(): ConstructeurAdaptateurRechercheEntrepriseEnDur {
    this.reponse[0].typeEntite = entitesPubliques;
    return this;
  }

  portantLeNom(
    nomEntreprise: string
  ): ConstructeurAdaptateurRechercheEntrepriseEnDur {
    this.reponse[0].nom = nomEntreprise;
    return this;
  }

  dansLaVille(ville: {
    commune: string;
    departement: string;
  }): ConstructeurAdaptateurRechercheEntrepriseEnDur {
    this.reponse[0].commune = ville.commune;
    this.reponse[0].departement = ville.departement;
    return this;
  }

  avecLeSiret(
    numeroSiret: string
  ): ConstructeurAdaptateurRechercheEntrepriseEnDur {
    this.reponse[0].siret = numeroSiret;
    return this;
  }

  quiRenvoieCodeEpci(codeEpci: string) {
    this.reponse[0].codeEpci = codeEpci;
    return this;
  }

  construis(): AdaptateurRechercheEntreprise {
    return {
      rechercheEntreprise: async (
        __nomOuSiretEntreprise: string,
        __parametresRecherche: string
      ) => this.reponse,
      rechercheParSiret: async (__siret: string) => this.reponse[0],
    };
  }
}

export const unAdaptateurRechercheEntreprise = () =>
  new ConstructeurAdaptateurRechercheEntrepriseEnDur();
