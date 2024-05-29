import { describe, expect } from 'vitest';
import {
  GestionnaireProcessus,
  Processeur,
} from '../../src/processus/Processus';

class ProcesseurDeTest implements Processeur<string, string> {
  constructor(private readonly leveUneErreur = false) {}

  execute(
    donnees: string,
    enSucces: (resultat: string) => void,
    enErreur: (message: string) => void,
  ): void {
    if (this.leveUneErreur) {
      enErreur('Une erreur est survenue!');
    }
    enSucces(`Bonjour ${donnees}!`);
  }
}

describe('Gestionnaire de processus', () => {
  it('Éxécute le processus demandé', async () => {
    let resultat = '';
    await GestionnaireProcessus.initialise(new ProcesseurDeTest()).execute(
      {
        enSucces: (r: string) => (resultat = r),
      },
      'le monde',
    );

    expect(resultat).toStrictEqual('Bonjour le monde!');
  });

  it('Le processus échoue', async () => {
    let resultat = '';
    await GestionnaireProcessus.initialise(new ProcesseurDeTest(true)).execute(
      {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        enSucces: (_: string) => {},
        enErreur: (message: string) => (resultat = message),
      },
      'le monde',
    );

    expect(resultat).toStrictEqual('Une erreur est survenue!');
  });
});
