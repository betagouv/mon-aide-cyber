import { ExpressValidator } from 'express-validator';
import { departements } from '../../gestion-demandes/departements';

type CriteresDeValidation = {
  emplacement: 'CORPS' | 'PARAMETRE_REQUETE';
  nomChamp: string;
  presence: 'OPTIONELLE' | 'OBLIGATOIRE';
};

export const validateurDeDepartement = (
  criteres: CriteresDeValidation = {
    emplacement: 'CORPS',
    nomChamp: 'departement',
    presence: 'OBLIGATOIRE',
  }
) => {
  const { body, query } = new ExpressValidator({
    departementConnu: (value: string) =>
      departements.some((departement) => departement.nom === value),
  });

  let chaineDeValidation =
    criteres.emplacement === 'CORPS'
      ? body(criteres.nomChamp)
      : query(criteres.nomChamp);

  if (criteres.presence === 'OPTIONELLE') {
    chaineDeValidation = chaineDeValidation.optional();
  }

  return chaineDeValidation
    .trim()
    .departementConnu()
    .withMessage('Veuillez renseigner un département.');
};
