import { beforeEach, describe, expect, it } from 'vitest';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import {
  executeLaRechercheDesAidants,
  ResultatChallenge,
} from '../../../src/administration/aidants/challenge-rentree/executeLaRechercheDesAidants';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import crypto from 'crypto';
import { Aidant } from '../../../src/espace-aidant/Aidant';

const versLigneCSV = (aidant: Aidant, nombreDiagnostics: number) => {
  return `${crypto.createHash('sha256').update(aidant.identifiant).digest('hex')};12/7/2025;${nombreDiagnostics}`;
};

describe('Le challenge de la rentrée', () => {
  beforeEach(async () => {
    FournisseurHorlogeDeTest.initialise(new Date('2025-07-12'));
  });

  it('Trouve l’Aidant correspondant', () => {
    const jeanDujardin = unAidant()
      .avecUnNomPrenom('Jean Dujardin')
      .construis();
    const ligne = versLigneCSV(jeanDujardin, 5);

    const resultat = executeLaRechercheDesAidants(ligne, [jeanDujardin]);

    expect(resultat).toStrictEqual<ResultatChallenge>({
      nomPrenom: 'Jean Dujardin',
      date: '12/7/2025',
      nombreDiagnostics: 5,
    });
  });

  it('Retourne un résultat undefined si l’Aidant n’est pas trouvé', () => {
    const jeanDujardin = unAidant()
      .avecUnNomPrenom('Jean Dujardin')
      .construis();
    const ligne = versLigneCSV(jeanDujardin, 5);

    const resultat = executeLaRechercheDesAidants(ligne, []);

    expect(resultat).toBeUndefined();
  });
});
