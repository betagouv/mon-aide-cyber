import { describe, it, expect } from 'vitest';
import { enCadence } from '../../../src/infrastructure/adaptateurs/enCadence';

const assertDuree = (fin: number, debut: number) => {
  expect(Math.ceil(Number(fin - debut))).toBeGreaterThanOrEqual(10 * 4);
};

describe('En cadence', () => {
  it('Exécute la fonction', async () => {
    let compteur = 0;

    const cadencee = await enCadence(1, async () => {
      compteur += 1;
    });
    await cadencee();

    expect(compteur).toBe(1);
  });

  it('respecte l’intervale en millisecondes', async () => {
    let compteur = 0;
    const debut = performance.now();

    const cadencee = await enCadence(10, async () => {
      compteur += 1;
    });
    await cadencee();
    await cadencee();
    await cadencee();
    await cadencee();
    await cadencee();

    const fin = performance.now();
    assertDuree(fin, debut);
  });

  it('Peut fonctionner avec un Promise.all()', async () => {
    let compteur = 0;
    const debut = performance.now();

    const cadencee = await enCadence(10, async () => {
      compteur += 1;
    });
    await Promise.all([
      cadencee(),
      cadencee(),
      cadencee(),
      cadencee(),
      cadencee(),
    ]);

    const fin = performance.now();
    assertDuree(fin, debut);
  });

  it('Peut encapsuler une fonction asynchrone', async () => {
    let compteur = 0;
    const debut = performance.now();

    const cadencee = await enCadence(10, (nombre: number) => {
      return new Promise((resolve) => {
        compteur += nombre;
        resolve();
      });
    });
    await Promise.all([
      cadencee(2),
      cadencee(2),
      cadencee(2),
      cadencee(2),
      cadencee(2),
    ]);

    const fin = performance.now();
    assertDuree(fin, debut);
    expect(compteur).toBe(10);
  });
});
