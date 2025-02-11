import { ChampRadio } from '../../../../../../composants/communs/ChampCaseACocher/ChampCaseACocher.tsx';
import { TypeAffichage } from '../reducteurProfil.ts';

export const FormatAffichageAnnuaire = ({
  valeurParDefaut,
  surChangement,
}: {
  valeurParDefaut: TypeAffichage | undefined;
  surChangement: (typeAffichage: TypeAffichage) => void;
}) => {
  const affichagesALister: { type: TypeAffichage; valeur: string }[] = [
    {
      type: 'PRENOM_NOM',
      valeur: 'Martin Véron',
    },
    {
      type: 'PRENOM_N',
      valeur: 'Martin V.',
    },
    {
      type: 'P_NOM',
      valeur: 'M. Véron',
    },
  ];
  return (
    <div>
      <p>Sous quelle forme souhaitez-vous apparaître sur l‘annuaire ?</p>
      <div
        className="fr-mt-2w fr-mb-2w fr-checkbox-group mac-radio-group"
        style={{ borderLeft: '4px #5D2A9D solid', paddingLeft: '1rem' }}
      >
        {affichagesALister.map((affichage) => (
          <ChampRadio
            element={{ code: affichage.type, nom: affichage.type }}
            checked={affichage.type === valeurParDefaut}
            label={affichage.valeur}
            onChange={() => surChangement(affichage.type)}
          />
        ))}
      </div>
    </div>
  );
};
