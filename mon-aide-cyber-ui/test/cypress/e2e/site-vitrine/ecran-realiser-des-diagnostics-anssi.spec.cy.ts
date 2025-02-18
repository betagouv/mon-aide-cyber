describe('Ecran réaliser des diagnostics ANSSI', () => {
  it("doit s'afficher", () => {
    cy.visit('/realiser-des-diagnostics-anssi');
    cy.wait(2000);
    cy.get('h1').should('be.visible');
  });

  it('Une personne peut remplir une demande devenir Aidant cyber', () => {
    cy.visit('/realiser-des-diagnostics-anssi');
    cy.wait(2000);

    const boutonSoumettre = cy.get('#etape-suivante-bouton');
    boutonSoumettre.should('be.disabled');

    cy.contains(
      '.bouton-mac.bouton-mac-primaire-inverse',
      'Je réalise des diagnostics'
    ).click();

    cy.wait(2000);
    cy.get('.carte-choix-utilisation.formulaire-colonne-droite').click();

    boutonSoumettre.should('not.be.disabled');
    cy.get('#etape-suivante-bouton').click();
    cy.wait(2000);
    cy.url().should('include', '/demandes/devenir-aidant');

    cy.get('label.selecteur-type-aidant').first().click();
    cy.get('#entreprise').type('BORDEAUX', { delay: 100 });

    cy.wait(1000);
    cy.contains(
      'button',
      'COMMUNE DE BORDEAUX - BORDEAUX (33) - (21330063500017)'
    ).click();

    cy.contains('button', 'Suivant').click();

    cy.wait(2000);
    cy.get('#charte-aidant').should('be.disabled');

    cy.scrollTo(0, 500);

    cy.wait(1000);
    cy.get('.zone-charte-defilable').scrollTo('bottom');

    cy.wait(2000);
    cy.get('#charte-aidant').should('not.be.disabled');
    cy.get("label[for='charte-aidant']").click();

    cy.wait(1000);

    cy.contains('button', 'Suivant').should('not.be.disabled');
    cy.contains('button', 'Suivant').click();

    cy.wait(2000);
    cy.get('#prenom').type('Jean', { delay: 100 });
    cy.get('#nom').type('Dupont', { delay: 100 });
    cy.get('#mail').type('user13@yopmail.com', { delay: 100 });
    cy.get('#departement').type('Gironde', { delay: 100 });

    cy.wait(1000);

    cy.contains('button', 'Envoyer').should('be.disabled');

    cy.get("label[for='cgu-aide']").click();

    cy.wait(1000);
    cy.contains('button', 'Envoyer').should('not.be.disabled');
    cy.contains('button', 'Envoyer').click();

    cy.wait(2000);

    cy.contains('Votre demande a bien été prise en compte !');
  });
});
