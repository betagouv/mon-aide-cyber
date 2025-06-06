import { TypographieH3 } from '../../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import { useEffect, useState } from 'react';
import useDefilementFluide from '../../../../hooks/useDefilementFluide.ts';
import ChoixActiviteProfessionnelle from './choix/ChoixActiviteProfessionnelle.tsx';
import ChoixInteretGeneral from './choix/ChoixInteretGeneral.tsx';

export type Utilisation = 'InteretGeneral' | 'ActiviteProfessionnelle';

export const ChoixUtilisation = ({
  choixPossibles = ['InteretGeneral', 'ActiviteProfessionnelle'],
  surClick,
}: {
  choixPossibles: Utilisation[];
  surClick: (choix: Utilisation) => void;
}) => {
  useDefilementFluide();
  const [choix, setChoix] = useState<Utilisation | undefined>(undefined);

  useEffect(() => {
    if (!choix) return;
    document
      .getElementById('etape-suivante-bouton')
      ?.scrollIntoView({ behavior: 'smooth' });
  }, [choix]);

  return (
    <>
      <div className="choix-utilisation texte-centre">
        <TypographieH3 className="violet-fonce">
          Quelle utilisation du service envisagez-vous ?
        </TypographieH3>
        <span>Sélectionnez l&apos;usage qui vous correspond.</span>
      </div>

      <div className="formulaire-colonne-gauche">
        <ChoixActiviteProfessionnelle
          actif={choixPossibles.includes('ActiviteProfessionnelle')}
          surChoix={() => setChoix('ActiviteProfessionnelle')}
        />
      </div>
      <div className="formulaire-colonne-droite">
        <ChoixInteretGeneral
          actif={choixPossibles.includes('InteretGeneral')}
          surChoix={() => setChoix('InteretGeneral')}
        />
      </div>

      <div className="validation">
        <button
          id="etape-suivante-bouton"
          disabled={!choix}
          type="button"
          className="fr-btn bouton-mac bouton-mac-primaire"
          onClick={() => {
            if (choix) {
              surClick(choix);
            }
          }}
        >
          Je valide ma sélection
        </button>
      </div>
    </>
  );
};
