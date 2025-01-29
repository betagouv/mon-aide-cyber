import { unAidant } from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import {
  EntrepotAidantMemoire,
  EntrepotUtilisateurInscritMemoire,
} from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { unServiceAidant } from '../../src/espace-aidant/ServiceAidantMAC';
import { expect } from 'vitest';
import { UtilisateurInscrit } from '../../src/espace-utilisateur-inscrit/UtilisateurInscrit';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { unServiceUtilisateurInscrit } from '../../src/espace-utilisateur-inscrit/ServiceUtilisateurInscritMAC';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('ServiceUtilisateurInscrit', () => {
  beforeEach(() => {
    FournisseurHorlogeDeTest.initialise(new Date());
  });

  it('Transforme un Aidant en Utilisateur Inscrit', async () => {
    const dateValidationCGU = new Date(Date.parse('2024-12-22T13:41:24'));
    const aidant = unAidant().cguValideesLe(dateValidationCGU).construis();
    const entrepotAidant = new EntrepotAidantMemoire();
    const entrepotUtilisateurInscrit = new EntrepotUtilisateurInscritMemoire();
    await entrepotAidant.persiste(aidant);

    await unServiceUtilisateurInscrit(
      entrepotUtilisateurInscrit,
      unServiceAidant(entrepotAidant)
    ).valideProfil(aidant.identifiant);

    const utilisateurInscrit = await entrepotUtilisateurInscrit.lis(
      aidant.identifiant
    );
    expect(utilisateurInscrit).toBeDefined();
    expect(utilisateurInscrit).toStrictEqual<UtilisateurInscrit>({
      email: aidant.email,
      identifiant: aidant.identifiant,
      nomPrenom: aidant.nomPrenom,
      dateSignatureCGU: FournisseurHorloge.maintenant(),
    });
  });
});
