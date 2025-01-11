import { FormulaireDevenirAidant } from '../../domaine/gestion-demandes/devenir-aidant/formulaire-devenir-aidant/FormulaireDevenirAidant.tsx';
import Button from '../../composants/atomes/Button/Button.tsx';
import { Departement } from '../../domaine/gestion-demandes/departement.ts';
import { useState } from 'react';

export const DemandeDevenirAidant = ({
  referentielDepartements,
}: {
  referentielDepartements: Departement[];
}) => {
  const [estValide, setEstValide] = useState(false);
  return (
    <div>
      <FormulaireDevenirAidant>
        <FormulaireDevenirAidant.AvantPropos>
          Avant propos
        </FormulaireDevenirAidant.AvantPropos>
        <FormulaireDevenirAidant.Formulaire
          referentielDepartements={referentielDepartements}
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
