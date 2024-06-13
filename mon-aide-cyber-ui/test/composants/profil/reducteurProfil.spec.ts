import { describe, expect, it } from 'vitest';
import {
  EtatProfil,
  profilCharge,
  reducteurProfil,
} from '../../../src/composants/profil/reducteurProfil.ts';

describe('reducteur profil', () => {
  const profilVide: EtatProfil = {
    dateCreationCompte: '',
    email: '',
    nom: '',
    prenom: '',
    enCoursDeChargement: true,
  };

  it('charge un profil', () => {
    const etatProfil = reducteurProfil(
      profilVide,
      profilCharge({
        liens: { 'modifier-profil': { url: '' }, suite: { url: '' } },
        nomPrenom: 'Jean Dupont',
        dateSignatureCGU: '03.12.2023',
        identifiantConnexion: 'jean.dupont@email.fr',
      })
    );

    expect(etatProfil).toStrictEqual({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@email.fr',
      dateCreationCompte: '03.12.2023',
      enCoursDeChargement: false,
    });
  });
});
