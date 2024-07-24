import { listeDepartements } from '../../src/infrastructure/departements/listeDepartements/listeDepartements';

class ServiceRechercheCOT {
  chercheMailParDepartement(nomDepartement: string): string | undefined {
    const annuaireCOT = [
      {
        codeRegion: '01',
        mail: 'outre-mer@ssi.gouv.fr',
      },
      {
        codeRegion: '02',
        mail: 'outre-mer@ssi.gouv.fr',
      },
      {
        codeRegion: '03',
        mail: 'outre-mer@ssi.gouv.fr',
      },
      {
        codeRegion: '04',
        mail: 'outre-mer@ssi.gouv.fr',
      },
      {
        codeRegion: '06',
        mail: 'outre-mer@ssi.gouv.fr',
      },
      {
        codeRegion: '978',
        mail: 'outre-mer@ssi.gouv.fr',
      },
      {
        codeRegion: '977',
        mail: 'outre-mer@ssi.gouv.fr',
      },
      {
        codeRegion: '975',
        mail: 'outre-mer@ssi.gouv.fr',
      },
      {
        codeRegion: '986',
        mail: 'outre-mer@ssi.gouv.fr',
      },
      {
        codeRegion: '987',
        mail: 'outre-mer@ssi.gouv.fr',
      },
      {
        codeRegion: '988',
        mail: 'outre-mer@ssi.gouv.fr',
      },
      {
        codeRegion: '11',
        mail: 'ile-de-france@ssi.gouv.fr',
      },
      {
        codeRegion: '24',
        mail: 'centre-val-de-loire@ssi.gouv.fr',
      },
      {
        codeRegion: '27',
        mail: 'bourgogne-franche-comte@ssi.gouv.fr',
      },
      {
        codeRegion: '28',
        mail: 'normandie@ssi.gouv.fr',
      },
      {
        codeRegion: '32',
        mail: 'hauts-de-france@ssi.gouv.fr',
      },
      {
        codeRegion: '44',
        mail: 'grand-est@ssi.gouv.fr',
      },
      {
        codeRegion: '52',
        mail: 'pays-de-la-loire@ssi.gouv.fr',
      },
      {
        codeRegion: '53',
        mail: 'bretagne@ssi.gouv.fr',
      },
      {
        codeRegion: '75',
        mail: 'nouvelle-aquitaine@ssi.gouv.fr',
      },
      {
        codeRegion: '76',
        mail: 'occitanie@ssi.gouv.fr',
      },
      {
        codeRegion: '84',
        mail: 'auvergne-rhone-alpes@ssi.gouv.fr',
      },
      {
        codeRegion: '93',
        mail: 'paca@ssi.gouv.fr',
      },
      {
        codeRegion: '94',
        mail: 'corse@ssi.gouv.fr',
      },
    ];

    const codeRegionDepartement = listeDepartements.find(
      ({ nom }) => nom === nomDepartement
    )?.codeRegion;

    return codeRegionDepartement
      ? annuaireCOT.find(
          ({ codeRegion: codeRegionCOT }) =>
            codeRegionCOT === codeRegionDepartement
        )?.mail
      : undefined;
  }
}

describe('Service de recherche COT', () => {
  it('retourne le mail du COT de la région dans lequelle se situe le département renseigné', () => {
    expect(
      new ServiceRechercheCOT().chercheMailParDepartement('Finistère')
    ).toStrictEqual('bretagne@ssi.gouv.fr');
    expect(
      new ServiceRechercheCOT().chercheMailParDepartement('Corse-du-Sud')
    ).toStrictEqual('corse@ssi.gouv.fr');
    expect(
      new ServiceRechercheCOT().chercheMailParDepartement("Val-d'Oise")
    ).toStrictEqual('ile-de-france@ssi.gouv.fr');
  });

  it("retourne 'undefined' lorsque le mail du COT n'est pas trouvé", () => {
    expect(
      new ServiceRechercheCOT().chercheMailParDepartement(
        'département-introuvable'
      )
    ).toBeUndefined();
  });
});
