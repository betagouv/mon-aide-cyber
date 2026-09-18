import { beforeEach, describe, expect, it } from 'vitest';
import { authentifie } from '../../src/authentification/authentification';
import { GestionnaireDeJetonJWT } from '../../src/infrastructure/authentification/gestionnaireDeJetonJWT';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { EntrepotUtilisateurMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';

import { unUtilisateur } from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { FauxServiceDeChiffrement } from '../infrastructure/securite/FauxServiceDeChiffrement';
import { ErreurMAC } from '../../src/domaine/erreurMAC';
import { ErreurAuthentification } from '../../src/authentification/Utilisateur';

describe('Authentification', () => {
  let serviceDeChiffrement: FauxServiceDeChiffrement;

  beforeEach(() => {
    serviceDeChiffrement = new FauxServiceDeChiffrement(new Map());
  });

  it('utilise le service de chiffrement pour vérifier le mot de passe', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2023-02-04T10:00:00+01:00'))
    );
    const entrepotUtilisateurMemoire = new EntrepotUtilisateurMemoire();
    const thomas = unUtilisateur()
      .avecUnIdentifiant('98fb45f5-db74-40d2-8ab8-0c774e39df36')
      .avecUnIdentifiantDeConnexion('Thomas')
      .avecUnMotDePasse('motDePasse hashee')
      .construis();
    await entrepotUtilisateurMemoire.persiste(thomas);

    const utilisateurAuthentifie = await authentifie(
      entrepotUtilisateurMemoire,
      serviceDeChiffrement,
      new GestionnaireDeJetonJWT('ma-clef-secrete'),
      'Thomas',
      'motDePasse'
    );

    expect(serviceDeChiffrement.aCompareLeMotDePasse()).toBe(true);
    expect(utilisateurAuthentifie).toBeDefined();
  });

  it('retourne une erreur d’authentification si le mot de passe est incorrect', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2023-02-04T10:00:00+01:00'))
    );
    const entrepotUtilisateurMemoire = new EntrepotUtilisateurMemoire();
    const thomas = unUtilisateur()
      .avecUnIdentifiant('98fb45f5-db74-40d2-8ab8-0c774e39df36')
      .avecUnIdentifiantDeConnexion('Thomas')
      .avecUnMotDePasse('motDePasse hashee')
      .construis();
    await entrepotUtilisateurMemoire.persiste(thomas);

    const utilisateurAuthentifie = authentifie(
      entrepotUtilisateurMemoire,
      serviceDeChiffrement,
      new GestionnaireDeJetonJWT('ma-clef-secrete'),
      'Thomas',
      'mauvais mot de passe'
    );

    await expect(() => utilisateurAuthentifie).rejects.toThrow(
      ErreurMAC.cree(
        "Demande d'Authentification",
        new ErreurAuthentification(new Error('Identifiants incorrects'))
      )
    );
  });

  it('génère un jeton JWT', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2023-02-04T10:00:00+01:00'))
    );
    const entrepotUtilisateurMemoire = new EntrepotUtilisateurMemoire();
    const thomas = unUtilisateur()
      .avecUnIdentifiant('98fb45f5-db74-40d2-8ab8-0c774e39df36')
      .avecUnIdentifiantDeConnexion('Thomas')
      .avecUnMotDePasse('motDePasse hashee')
      .construis();
    await entrepotUtilisateurMemoire.persiste(thomas);

    const utilisateurAuthentifie = await authentifie(
      entrepotUtilisateurMemoire,
      serviceDeChiffrement,
      new GestionnaireDeJetonJWT('ma-clef-secrete'),
      'Thomas',
      'motDePasse'
    );
    expect(utilisateurAuthentifie.jeton).toStrictEqual(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWFudCI6Ijk4ZmI0NWY1LWRiNzQtNDBkMi04YWI4LTBjNzc0ZTM5ZGYzNiIsImlhdCI6MTY3NTUwMTIwMDAwMCwiZXhwIjoxNjc1NTAxMjEwODAwfQ.JIEWOOa0UFid9NUihbdAIeAhDgXfh8WPXK7JxHcsKNc'
    );
  });
});
