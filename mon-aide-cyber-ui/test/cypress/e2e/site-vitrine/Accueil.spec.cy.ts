describe('La landing page', () => {
  it('doit s‘afficher', () => {
    cy.visit('/');
  });

  it('peut se rendre sur la page de demande d‘aide', () => {
    cy.visit('/');

    cy.contains(
      '.fr-btn.bouton-mac.bouton-mac-primaire',
      "Je fais une demande d'aide"
    ).click();

    cy.wait(2000);

    cy.contains('Faire une demande MonAideCyber');
  });
});
