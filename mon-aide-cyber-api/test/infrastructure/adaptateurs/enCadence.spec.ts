import { describe, expect, it } from 'vitest';
import { enCadence } from '../../../src/infrastructure/adaptateurs/enCadence';

const assertDuree = (fin: number, debut: number) => {
  expect(fin - debut).toBeGreaterThanOrEqual(10 * 4);
};

const fonctionQuiPrend5Ms = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 5));

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
    const debut = performance.now();

    const cadencee = await enCadence(10, fonctionQuiPrend5Ms);
    await cadencee();
    await cadencee();
    await cadencee();
    await cadencee();
    await cadencee();

    const fin = performance.now();
    assertDuree(fin, debut);
  });

  it('Peut fonctionner avec un Promise.all()', async () => {
    const debut = performance.now();

    const cadencee = await enCadence(10, fonctionQuiPrend5Ms);
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

    const cadencee = await enCadence(10, async (nombre: number) => {
      compteur += nombre;
      await fonctionQuiPrend5Ms();
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
