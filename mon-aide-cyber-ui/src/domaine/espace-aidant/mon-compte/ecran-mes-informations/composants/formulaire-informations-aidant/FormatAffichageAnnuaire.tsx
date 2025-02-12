import { ChampRadio } from '../../../../../../composants/communs/ChampCaseACocher/ChampCaseACocher.tsx';
import { TypeAffichage } from '../reducteurProfil.ts';
import { TypeAffichageAnnuaire } from 'mon-aide-cyber-api/src/espace-aidant/Aidant.ts';

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
    <div>
      <p>Sous quelle forme souhaitez-vous apparaître sur l‘annuaire ?</p>
      <div
        className="fr-mt-2w fr-mb-2w fr-checkbox-group mac-radio-group"
        style={{ borderLeft: '4px #5D2A9D solid', paddingLeft: '1rem' }}
      >
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
