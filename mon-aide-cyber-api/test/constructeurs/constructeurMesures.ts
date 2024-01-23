import { ConstructeurDeTableau } from './constructeur';
import { ReferentielDeMesures } from '../../src/diagnostic/ReferentielDeMesures';

class ConstructeurMesures extends ConstructeurDeTableau<ReferentielDeMesures> {
  avecLesMesures(
    mesures: {
      [identifiant: string]: {
        niveau1: string;
        niveau2?: string;
        priorisation: number;
      };
    }[],
  ): ConstructeurMesures {
    mesures.forEach((mesure) => {
      this.tableau.push(
        ...Object.entries(mesure).map(([question, mesure]) => ({
          [question]: {
            niveau1: {
              titre: mesure.niveau1,
              pourquoi: 'parce-que',
              comment: 'comme ça',
            },
            ...(mesure.niveau2 && {
              niveau2: {
                titre: mesure.niveau2,
                pourquoi: 'parce-que',
                comment: 'comme ça',
              },
            }),
            priorisation: mesure.priorisation,
          },
        })),
      );
    });
    return this;
  }
}

export const desMesures = () => new ConstructeurMesures();
export const desMesuresPour7Questions = () => {
  return desMesures()
    .avecLesMesures([
      { q1: { niveau1: 'mesure 1', niveau2: 'mesure 12', priorisation: 1 } },
      { q2: { niveau1: 'mesure 2', niveau2: 'mesure 22', priorisation: 2 } },
      { q3: { niveau1: 'mesure 3', niveau2: 'mesure 32', priorisation: 3 } },
      { q4: { niveau1: 'mesure 4', niveau2: 'mesure 42', priorisation: 4 } },
      { q5: { niveau1: 'mesure 5', niveau2: 'mesure 52', priorisation: 5 } },
      { q6: { niveau1: 'mesure 6', niveau2: 'mesure 62', priorisation: 6 } },
      { q7: { niveau1: 'mesure 7', niveau2: 'mesure 72', priorisation: 7 } },
    ])
    .construis();
};
