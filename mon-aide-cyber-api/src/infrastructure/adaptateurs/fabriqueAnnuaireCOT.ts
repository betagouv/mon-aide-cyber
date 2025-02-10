import { Departement } from '../../gestion-demandes/departements';
import {
  emailCOTDeLaRegion,
  emailsDeTousLesCOT,
} from '../annuaireCOT/annuaireCOT';

type AnnuaireCOT = {
  annuaireCOT: () => {
    rechercheEmailParDepartement: (departement: Departement) => string;
    tous(): string[];
  };
};

export const fabriqueAnnuaireCOT = (): AnnuaireCOT => {
  if (process.env.ANNUAIRE_COT === 'ANNUAIRE_PRODUCTION') {
    return {
      annuaireCOT: () => ({
        rechercheEmailParDepartement: (departement: Departement): string =>
          emailCOTDeLaRegion(departement),
        tous: (): string[] => emailsDeTousLesCOT(),
      }),
    };
  } else {
    return {
      annuaireCOT: () => ({
        rechercheEmailParDepartement: (__departement: Departement): string =>
          'cot@email.com',
        tous: (): string[] => ['cot@email.com'],
      }),
    };
  }
};
