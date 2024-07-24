class ServiceRechercheCOT {
  chercheMailGeneriqueParDepartement(departement: string) {
    const departementsParCot = [
      {
        departements: ["Val-d'Oise"],
        mailGeneriqueCot: 'ile-de-france@ssi.gouv.fr',
      },
      {
        departements: ['Corse-du-Sud'],
        mailGeneriqueCot: 'corse@ssi.gouv.fr',
      },
      {
        departements: ['Finistère'],
        mailGeneriqueCot: 'bretagne@ssi.gouv.fr',
      },
    ];

    return departementsParCot.find((zoneAdministreeParCot) =>
      zoneAdministreeParCot.departements.find((dep) => dep === departement)
    )!.mailGeneriqueCot;
  }
}

describe('Service de recherche COT', () => {
  it('retourne le mail générique du COT de la région dans lequelle se situe le département renseigné', () => {
    expect(
      new ServiceRechercheCOT().chercheMailGeneriqueParDepartement('Finistère')
    ).toStrictEqual('bretagne@ssi.gouv.fr');
    expect(
      new ServiceRechercheCOT().chercheMailGeneriqueParDepartement(
        'Corse-du-Sud'
      )
    ).toStrictEqual('corse@ssi.gouv.fr');
    expect(
      new ServiceRechercheCOT().chercheMailGeneriqueParDepartement("Val-d'Oise")
    ).toStrictEqual('ile-de-france@ssi.gouv.fr');
  });
});
