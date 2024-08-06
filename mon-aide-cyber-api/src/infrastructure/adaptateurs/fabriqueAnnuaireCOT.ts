import { Departement } from '../../gestion-demandes/departements';
import { emailCOTDeLaRegion } from '../annuaireCOT/annuaireCOT';

export const fabriqueAnnuaireCOT = () => {
  if (process.env.ANNUAIRE_COT === 'ANNUAIRE_PRODUCTION') {
    return {
      annuaireCOT: () => ({
        rechercheEmailParDepartement: (departement: Departement) =>
          emailCOTDeLaRegion(departement),
      }),
    };
  } else {
    return {
      annuaireCOT: () => ({
        rechercheEmailParDepartement: (__departement: Departement) =>
          'cot@email.com',
      }),
    };
  }
};
