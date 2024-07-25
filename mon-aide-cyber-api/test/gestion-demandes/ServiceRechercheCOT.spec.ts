import { listeDepartements } from '../../src/infrastructure/departements/listeDepartements/listeDepartements';

class ServiceRechercheCOT {
  chercheMailParDepartement(nomDepartement: string): string | undefined {
    const annuaireCOT = [
      {
        codeRegion: [
          '01',
          '02',
          '03',
          '04',
          '06',
          '978',
          '977',
          '975',
          '986',
          '987',
          '988',
        ],
        mail: 'outre-mer@ssi.gouv.fr',
      },
      {
        codeRegion: ['11'],
        mail: 'ile-de-france@ssi.gouv.fr',
      },
      {
        codeRegion: ['24'],
        mail: 'centre-val-de-loire@ssi.gouv.fr',
      },
      {
        codeRegion: ['27'],
        mail: 'bourgogne-franche-comte@ssi.gouv.fr',
      },
      {
        codeRegion: ['28'],
        mail: 'normandie@ssi.gouv.fr',
      },
      {
        codeRegion: ['32'],
        mail: 'hauts-de-france@ssi.gouv.fr',
      },
      {
        codeRegion: ['44'],
        mail: 'grand-est@ssi.gouv.fr',
      },
      {
        codeRegion: ['52'],
        mail: 'pays-de-la-loire@ssi.gouv.fr',
      },
      {
        codeRegion: ['53'],
        mail: 'bretagne@ssi.gouv.fr',
      },
      {
        codeRegion: ['75'],
        mail: 'nouvelle-aquitaine@ssi.gouv.fr',
      },
      {
        codeRegion: ['76'],
        mail: 'occitanie@ssi.gouv.fr',
      },
      {
        codeRegion: ['84'],
        mail: 'auvergne-rhone-alpes@ssi.gouv.fr',
      },
      {
        codeRegion: ['93'],
        mail: 'paca@ssi.gouv.fr',
      },
      {
        codeRegion: ['94'],
        mail: 'corse@ssi.gouv.fr',
      },
    ];

    const codeRegionDepartement = listeDepartements.find(
      ({ nom }) => nom === nomDepartement
    )?.codeRegion;

    return codeRegionDepartement
      ? annuaireCOT.find(({ codeRegion: codeRegionCOT }) =>
          codeRegionCOT.includes(codeRegionDepartement)
        )?.mail
      : undefined;
  }
}

describe('Service de recherche COT', () => {
  describe('trouve un mail de COT pour chacun des départements', () => {
    it.each(listeDepartements)('$nom', (departement) => {
      expect(
        new ServiceRechercheCOT().chercheMailParDepartement(departement.nom)
      ).toBeDefined();
    });
  });

  it("retourne 'undefined' lorsque le mail du COT n'est pas trouvé", () => {
    expect(
      new ServiceRechercheCOT().chercheMailParDepartement(
        'département-introuvable'
      )
    ).toBeUndefined();
  });
});
