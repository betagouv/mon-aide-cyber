import { FormulaireDevenirAidant } from '../../domaine/gestion-demandes/devenir-aidant/formulaire-devenir-aidant/FormulaireDevenirAidant.tsx';
import Button from '../../composants/atomes/Button/Button.tsx';
import { useState } from 'react';
import { ReponseDemandeInitiee } from '../../domaine/gestion-demandes/devenir-aidant/DevenirAidant.ts';

export const DemandeDevenirAidant = ({
  informationsLieesALaDemande,
}: {
  informationsLieesALaDemande: ReponseDemandeInitiee | undefined;
}) => {
  const [estValide, setEstValide] = useState(false);
  return (
    <div>
      <FormulaireDevenirAidant>
        <FormulaireDevenirAidant.AvantPropos>
          Avant propos
        </FormulaireDevenirAidant.AvantPropos>
        <FormulaireDevenirAidant.Formulaire
          informationsLieesALaDemande={informationsLieesALaDemande}
          surSoumission={() => null}
          devientValide={(estFormulaireValide) =>
            setEstValide(estFormulaireValide)
          }
        >
          <Button
            type="submit"
            key="envoyer-demande-devenir-aidant"
            className="fr-btn bouton-mac bouton-mac-primaire"
            disabled={!estValide}
          >
            Envoyer
          </Button>
        </FormulaireDevenirAidant.Formulaire>
      </FormulaireDevenirAidant>
    </div>
  );
};
