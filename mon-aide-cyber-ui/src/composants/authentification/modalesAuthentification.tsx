import { ActionsModale } from '../../fournisseurs/ContexteModale.ts';
import { FormulaireAuthentification } from './FormulaireAuthentification.tsx';

export const afficheModaleSessionExpiree = (
  modale: ActionsModale,
  surAnnuler: () => void,
) => {
  modale.affiche({
    titre: 'Veuillez vous reconnecter',
    corps: (
      <FormulaireAuthentification
        surAnnuler={surAnnuler}
        surSeConnecter={modale.ferme}
      />
    ),
  });
};
