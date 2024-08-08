import { ExpressValidator } from 'express-validator';
import { departements } from '../../gestion-demandes/departements';

export const validateurDeDepartement = () => {
  const { body } = new ExpressValidator({
    departementConnu: (value: string) =>
      departements.some((departement) => departement.nom === value),
  });

  return body('departement')
    .trim()
    .departementConnu()
    .withMessage('Veuillez renseigner un département');
};
