import { listeDepartements } from '../../src/infrastructure/departements/listeDepartements/listeDepartements';

class ServiceRechercheCOT {
  chercheMailParDepartement(nomDepartement: string): string | undefined {
    const annuaireCOT = [
      {
        codeRegion: '11',
        mail: 'ile-de-france@ssi.gouv.fr',
      },
      {
        codeRegion: '94',
        mail: 'corse@ssi.gouv.fr',
      },
      {
        codeRegion: '53',
        mail: 'bretagne@ssi.gouv.fr',
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
