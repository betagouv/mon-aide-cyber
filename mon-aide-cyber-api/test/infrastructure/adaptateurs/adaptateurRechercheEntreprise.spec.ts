import { describe, expect, it } from 'vitest';
import {
  adaptateurRechercheEntreprise,
  APIEntreprise,
} from '../../../src/infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import {
  AdaptateurDeRequeteHTTP,
  RequeteHTTP,
} from '../../../src/infrastructure/adaptateurs/adaptateurDeRequeteHTTP';
import { Constructeur } from '../../constructeurs/constructeur';
import {
  associations,
  EntitesAssociations,
  EntitesEntreprisesPrivees,
  EntitesOrganisationsPubliques,
  entitesPrivees,
  entitesPubliques,
  TypesEntites,
} from '../../../src/espace-aidant/Aidant';
import { SecteurActivite } from '../../../src/espace-aidant/preferences/secteursActivite';
import { unConstructeurDeReponseAPIEntreprise } from '../../constructeurs/constructeurAPIEntreprise';

type ParametresTest<T> = {
  nomOuSIRETEntreprise: string;
  reponseRetournee?: APIEntreprise;
  parametresRecherche?: string;
  reponseAttendue: T;
};

describe('L’adaptateur de recherche Entreprise', () => {
  it.each<
    ParametresTest<
      | EntitesAssociations
      | EntitesEntreprisesPrivees
      | EntitesOrganisationsPubliques
    >
  >([
    {
      nomOuSIRETEntreprise: '01234567891234',
      reponseRetournee: unConstructeurDeReponseAPIEntreprise()
        .dansLeServicePublic()
        .construis(),
      reponseAttendue: entitesPubliques,
    },
    {
      nomOuSIRETEntreprise: '01234567891234',
      reponseRetournee: unConstructeurDeReponseAPIEntreprise()
        .estUneAssociation()
        .construis(),
      reponseAttendue: associations,
    },
    {
      nomOuSIRETEntreprise: '12345678912345',
      reponseRetournee: unConstructeurDeReponseAPIEntreprise()
        .dansLaVille({ commune: 'PARIS', departement: '75' })
        .dansLePrive()
        .construis(),
      reponseAttendue: entitesPrivees,
    },
    {
      nomOuSIRETEntreprise: 'reserviste',
      parametresRecherche: 'est_association=true',
      reponseAttendue: associations,
    },
  ])(
    'Retourne le type d’entité $reponseAttendue.nom',
    async ({
      nomOuSIRETEntreprise,
      reponseRetournee,
      parametresRecherche,
      reponseAttendue,
    }) => {
      const entreprises = await adaptateurRechercheEntreprise(
        unAdaptateurDeRequete().retournant(reponseRetournee).construis()
      ).rechercheEntreprise(nomOuSIRETEntreprise, parametresRecherche || '');

      expect(
        entreprises.map((entreprise) => entreprise.typeEntite)
      ).toStrictEqual<TypesEntites>([reponseAttendue]);
    }
  );

  it.each<ParametresTest<SecteurActivite[]>>([
    {
      nomOuSIRETEntreprise: '01234567891234',
      reponseRetournee: unConstructeurDeReponseAPIEntreprise()
        .dansAdministration()
        .construis(),
      reponseAttendue: [{ nom: 'Administration' }, { nom: 'Tertiaire' }],
    },
    {
      nomOuSIRETEntreprise: '01234567891234',
      reponseRetournee: unConstructeurDeReponseAPIEntreprise()
        .dansInformationEtCommunication()
        .construis(),
      reponseAttendue: [
        { nom: 'Information et communication' },
        { nom: 'Tertiaire' },
      ],
    },
    {
      nomOuSIRETEntreprise: '12345678912345',
      reponseRetournee: unConstructeurDeReponseAPIEntreprise()
        .dansActivitesImmobilieres()
        .construis(),
      reponseAttendue: [
        { nom: 'Activités immobilières' },
        { nom: 'Tertiaire' },
      ],
    },
    {
      nomOuSIRETEntreprise: 'reserviste',
      parametresRecherche: 'est_association=true',
      reponseAttendue: [],
    },
  ])(
    'Retourne le secteur d’activité $reponseAttendue',
    async ({ reponseAttendue, ...reste }) => {
      const entreprises = await adaptateurRechercheEntreprise(
        unAdaptateurDeRequete().retournant(reste.reponseRetournee).construis()
      ).rechercheEntreprise(
        reste.nomOuSIRETEntreprise,
        reste.parametresRecherche || ''
      );

      expect(
        entreprises.flatMap((entreprise) => entreprise.secteursActivite)
      ).toStrictEqual<SecteurActivite[]>(reponseAttendue);
    }
  );
});

type ReponseAPIEntreprise = {
  results: {
    nom_complet: string;
    siege: { siret: string; libelle_commune: string; departement: string };
    complements: { est_association?: boolean; est_service_public?: boolean };
  }[];
};

class ConstructeurAdaptateurDeRequete
  implements Constructeur<AdaptateurDeRequeteHTTP>
{
  private reponseRetournee: ReponseAPIEntreprise = { results: [] };

  retournant(reponseRetournee?: {
    nom_complet: string;
    siege: { siret: string; libelle_commune: string; departement: string };
    complements: { est_association?: boolean; est_service_public?: boolean };
  }): ConstructeurAdaptateurDeRequete {
    if (reponseRetournee) {
      this.reponseRetournee.results.push(reponseRetournee);
    }
    return this;
  }

  construis(): AdaptateurDeRequeteHTTP {
    return new AdaptateurDeRequeteHTTPMemoire(this.reponseRetournee);
  }
}

const unAdaptateurDeRequete = () => new ConstructeurAdaptateurDeRequete();

class AdaptateurDeRequeteHTTPMemoire extends AdaptateurDeRequeteHTTP {
  private _enErreur = false;
  requeteAttendue = '';

  constructor(private readonly reponseRetournee: ReponseAPIEntreprise) {
    super();
  }

  execute<REPONSE, REQUETE = void>(
    requete: RequeteHTTP<REQUETE>
  ): Promise<REPONSE> {
    return super.execute(requete, (_input, _init) => {
      this.requeteAttendue = _input.toString();

      const reponse: Response = {
        json: () => this.reponseRetournee as unknown as Promise<REPONSE>,
        headers: {} as Headers,
        status: this._enErreur ? 400 : 200,
        ok: !this._enErreur,
        redirected: false,
        statusText: 'status',
        type: 'default',
        url: '',
        clone: () => ({}) as Response,
        body: new Blob([JSON.stringify(this.reponseRetournee)]).stream(),
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
        blob: () => Promise.resolve(new Blob(['Hello'])),
        formData: () => Promise.resolve({} as FormData),
        text: () => Promise.resolve('Hello'),
      };
      return Promise.resolve(reponse);
    });
  }
}
