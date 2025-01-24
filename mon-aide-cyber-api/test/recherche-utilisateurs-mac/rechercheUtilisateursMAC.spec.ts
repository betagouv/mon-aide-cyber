import { describe, expect, it } from 'vitest';
import {
  uneRechercheUtilisateursMAC,
  UtilisateurMACDTO,
} from '../../src/recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  EntrepotAidantMemoire,
  EntrepotUtilisateurInscritMemoire,
  EntrepotUtilisateurMACMemoire,
} from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import {
  unAidant,
  unUtilisateurInscrit,
} from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { adaptateurEnvironnement } from '../../src/adaptateurs/adaptateurEnvironnement';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('La recherche utilisateur MAC', () => {
  describe('Dans le cas de l’Aidant', () => {
    it('Retourne la date de validation des CGU', async () => {
      const dateValidationCGU = new Date(Date.parse('2024-12-22T13:41:24'));
      const aidant = unAidant().cguValideesLe(dateValidationCGU).construis();
      const entrepotAidant = new EntrepotAidantMemoire();
      await entrepotAidant.persiste(aidant);

      const utilisateur = await uneRechercheUtilisateursMAC(
        new EntrepotUtilisateurMACMemoire({
          aidant: entrepotAidant,
          utilisateurInscrit: new EntrepotUtilisateurInscritMemoire(),
        })
      ).rechercheParIdentifiant(aidant.identifiant);

      expect(utilisateur).toBeDefined();
      expect(utilisateur?.dateValidationCGU).toStrictEqual(dateValidationCGU);
    });
  });

  it('Retourne le nom de l’utilisateur tel qu’il doit être affiché', async () => {
    const aidant = unAidant().avecUnNomPrenom('Jean Dupont').construis();
    const entrepotAidant = new EntrepotAidantMemoire();
    await entrepotAidant.persiste(aidant);

    const utilisateur = await uneRechercheUtilisateursMAC(
      new EntrepotUtilisateurMACMemoire({
        aidant: entrepotAidant,
        utilisateurInscrit: new EntrepotUtilisateurInscritMemoire(),
      })
    ).rechercheParIdentifiant(aidant.identifiant);

    expect(utilisateur?.nomUsage).toStrictEqual('Jean D.');
    expect(utilisateur?.nomComplet).toStrictEqual('Jean Dupont');
  });

  it('L’Utilisateur doit valider les CGU', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2025-03-20T14:05:00'))
    );
    const aidant = unAidant()
      .cguValideesLe(new Date(Date.parse('2025-03-19T12:37:12')))
      .construis();
    adaptateurEnvironnement.nouveauParcoursDevenirAidant = () =>
      '2025-03-20T00:00:00';
    const entrepotAidant = new EntrepotAidantMemoire();
    await entrepotAidant.persiste(aidant);

    const utilisateur = await uneRechercheUtilisateursMAC(
      new EntrepotUtilisateurMACMemoire({
        aidant: entrepotAidant,
        utilisateurInscrit: new EntrepotUtilisateurInscritMemoire(),
      })
    ).rechercheParIdentifiant(aidant.identifiant);

    expect(utilisateur?.doitValiderLesCGU).toBe(true);
  });

  it('L’Utilisateur doit valider les CGU une fois la date de validité des CGU échue', async () => {
    const aidant = unAidant()
      .cguValideesLe(new Date(Date.parse('2025-03-19T12:37:12')))
      .construis();
    adaptateurEnvironnement.nouveauParcoursDevenirAidant = () =>
      '2025-03-20T15:00:00';
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2025-03-20T14:05:00'))
    );
    const entrepotAidant = new EntrepotAidantMemoire();
    await entrepotAidant.persiste(aidant);

    const utilisateur = await uneRechercheUtilisateursMAC(
      new EntrepotUtilisateurMACMemoire({
        aidant: entrepotAidant,
        utilisateurInscrit: new EntrepotUtilisateurInscritMemoire(),
      })
    ).rechercheParIdentifiant(aidant.identifiant);

    expect(utilisateur?.doitValiderLesCGU).toBe(false);
  });

  describe('Dans le cas de l’Utilisateur Inscrit', () => {
    it('Retourne la date de validation des CGU', async () => {
      const dateValidationCGU = new Date(Date.parse('2024-12-22T13:41:24'));
      const utilisateurInscrit = unUtilisateurInscrit()
        .avecUneDateDeSignatureDeCGU(dateValidationCGU)
        .construis();
      const entrepotUtilisateurInscrit =
        new EntrepotUtilisateurInscritMemoire();
      await entrepotUtilisateurInscrit.persiste(utilisateurInscrit);

      const utilisateur = await uneRechercheUtilisateursMAC(
        new EntrepotUtilisateurMACMemoire({
          aidant: new EntrepotAidantMemoire(),
          utilisateurInscrit: entrepotUtilisateurInscrit,
        })
      ).rechercheParIdentifiant(utilisateurInscrit.identifiant);

      expect(utilisateur).toBeDefined();
      expect(utilisateur?.dateValidationCGU).toStrictEqual(dateValidationCGU);
    });
  });

  it('Recherche un utilisateur de type Aidant par mail', async () => {
    const aidant = unAidant().avecUnNomPrenom('Jean Dupont').construis();
    const entrepotAidant = new EntrepotAidantMemoire();
    await entrepotAidant.persiste(aidant);

    const utilisateur = await uneRechercheUtilisateursMAC(
      new EntrepotUtilisateurMACMemoire({
        aidant: entrepotAidant,
        utilisateurInscrit: new EntrepotUtilisateurInscritMemoire(),
      })
    ).rechercheParMail(aidant.email);

    expect(utilisateur).toStrictEqual<UtilisateurMACDTO>({
      identifiant: aidant.identifiant,
      profil: 'Aidant',
      nomUsage: 'Jean D.',
      nomComplet: 'Jean Dupont',
      dateValidationCGU: aidant.dateSignatureCGU!,
      doitValiderLesCGU: false,
    });
  });

  it('Recherche un utilisateur de type Utilisateur Inscrit par mail', async () => {
    const utilisateurInscrit = unUtilisateurInscrit()
      .avecUnNomPrenom('Jean Dujardin')
      .construis();
    const entrepotutilisateurInscrit = new EntrepotUtilisateurInscritMemoire();
    await entrepotutilisateurInscrit.persiste(utilisateurInscrit);

    const utilisateur = await uneRechercheUtilisateursMAC(
      new EntrepotUtilisateurMACMemoire({
        aidant: new EntrepotAidantMemoire(),
        utilisateurInscrit: entrepotutilisateurInscrit,
      })
    ).rechercheParMail(utilisateurInscrit.email);

    expect(utilisateur).toStrictEqual<UtilisateurMACDTO>({
      identifiant: utilisateurInscrit.identifiant,
      profil: 'UtilisateurInscrit',
      nomUsage: 'Jean D.',
      nomComplet: 'Jean Dujardin',
      dateValidationCGU: utilisateurInscrit.dateSignatureCGU!,
      doitValiderLesCGU: false,
    });
  });

  it('Ne lance pas d’erreur si l’utilisateurn’est pas connu', async () => {
    const utilisateur = await uneRechercheUtilisateursMAC(
      new EntrepotUtilisateurMACMemoire({
        aidant: new EntrepotAidantMemoire(),
        utilisateurInscrit: new EntrepotUtilisateurInscritMemoire(),
      })
    ).rechercheParMail('email@inconnu.com');

    expect(utilisateur).toBeUndefined();
  });
});
