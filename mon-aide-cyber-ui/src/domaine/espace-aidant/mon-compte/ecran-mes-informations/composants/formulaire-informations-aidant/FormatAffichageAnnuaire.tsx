import { ChampRadio } from '../../../../../../composants/communs/ChampCaseACocher/ChampCaseACocher.tsx';
import { TypeAffichage } from '../reducteurProfil.ts';
import { TypeAffichageAnnuaire } from 'mon-aide-cyber-api/src/espace-aidant/Aidant.ts';
import './format-affichage-annuaire.scss';

export const FormatAffichageAnnuaire = ({
  affichagesAnnuaire,
  surChangement,
}: {
  affichagesAnnuaire: {
    type: TypeAffichageAnnuaire;
    valeur: string;
    actif?: boolean;
  }[];
  surChangement: (typeAffichage: TypeAffichage) => void;
}) => {
  return (
    <div className="formats-affichage-annuaire fr-mb-2w">
      <p>Sous quelle forme souhaitez-vous apparaître sur l‘annuaire ?</p>
      <div className="fr-mb-2w fr-checkbox-group mac-radio-group liste">
        {affichagesAnnuaire.map((affichage) => (
          <ChampRadio
            key={affichage.type}
            element={{ code: affichage.type, nom: affichage.valeur }}
            checked={affichage.actif}
            label={affichage.valeur}
            onChange={() => surChangement(affichage.type)}
          />
        ))}
      </div>
    </div>
  );
};
