import { describe, expect, it } from 'vitest';
import { authentifie } from '../../src/authentification/authentification';
import { GestionnaireDeJetonJWT } from '../../src/infrastructure/authentification/gestionnaireDeJetonJWT';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { EntrepotUtilisateurMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';

import { unUtilisateur } from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';

describe('Authentification', () => {
  it('génère un jeton JWT', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2023-02-04T10:00:00+01:00'))
    );

    const entrepotUtilisateurMemoire = new EntrepotUtilisateurMemoire();
    const thomas = unUtilisateur()
      .avecUnIdentifiant('98fb45f5-db74-40d2-8ab8-0c774e39df36')
      .avecUnIdentifiantDeConnexion('Thomas')
      .avecUnMotDePasse('motDePasse')
      .construis();
    entrepotUtilisateurMemoire.persiste(thomas);

    const utilisateurAuthentifie = await authentifie(
      entrepotUtilisateurMemoire,
      new GestionnaireDeJetonJWT('ma-clef-secrete'),
      'Thomas',
      'motDePasse'
    );
    expect(utilisateurAuthentifie.jeton).toStrictEqual(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWFudCI6Ijk4ZmI0NWY1LWRiNzQtNDBkMi04YWI4LTBjNzc0ZTM5ZGYzNiIsImlhdCI6MTY3NTUwMTIwMDAwMCwiZXhwIjoxNjc1NTAxMjEwODAwfQ.JIEWOOa0UFid9NUihbdAIeAhDgXfh8WPXK7JxHcsKNc'
    );
  });
});
