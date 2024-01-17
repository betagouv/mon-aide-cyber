import { ConstructeurDeTableau } from './constructeur';
import { Mesures } from '../../src/diagnostic/Mesures';

class ConstructeurMesures extends ConstructeurDeTableau<Mesures> {
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
      { q1: { niveau1: 'reco 1', niveau2: 'reco 12', priorisation: 1 } },
      { q2: { niveau1: 'reco 2', niveau2: 'reco 22', priorisation: 2 } },
      { q3: { niveau1: 'reco 3', niveau2: 'reco 32', priorisation: 3 } },
      { q4: { niveau1: 'reco 4', niveau2: 'reco 42', priorisation: 4 } },
      { q5: { niveau1: 'reco 5', niveau2: 'reco 52', priorisation: 5 } },
      { q6: { niveau1: 'reco 6', niveau2: 'reco 62', priorisation: 6 } },
      { q7: { niveau1: 'reco 7', niveau2: 'reco 72', priorisation: 7 } },
    ])
    .construis();
};
