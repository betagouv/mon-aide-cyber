describe('Ecran être aidé', () => {
  it('doit s‘afficher', () => {
    cy.visit('/beneficier-du-dispositif/etre-aide');
  });

  it('Une entité Aidée peut demander une aide', () => {
    cy.visit('/beneficier-du-dispositif/etre-aide');

    cy.wait(2000);

    cy.contains(
      '.bouton-mac.bouton-mac-primaire-inverse',
      'Je fais une demande'
    ).click();

    cy.wait(2000);

    cy.contains(
      '.bouton-mac.bouton-mac-primaire-inverse',
      'Je fais une demande'
    ).click();

    cy.get('#adresse-electronique').type('user11@yopmail.com', {
      delay: 100,
    });

    cy.get('#departement').type('Gironde', {
      delay: 100,
    });

    cy.get('label[for="cgu-aide"]').click();

    cy.get('.bouton-demande-etre-aide').click();
    cy.wait(2000);

    cy.contains('Votre demande a bien été prise en compte !');
  });
});
