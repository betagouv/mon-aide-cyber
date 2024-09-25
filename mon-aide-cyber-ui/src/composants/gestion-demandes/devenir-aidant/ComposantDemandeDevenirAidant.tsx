import { FormulaireDevenirAidant } from '../../../domaine/gestion-demandes/devenir-aidant/formulaire-devenir-aidant/FormulaireDevenirAidant.tsx';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';

export const ComposantDemandeDevenirAidant = () => {
  return (
    <main role="main" className="demande-devenir-aidant">
      <div className="mode-fonce">
        <div className="fr-container">
          <div className="fr-grid-row contenu">
            <h2>Vous souhaitez devenir Aidant MonAideCyber</h2>
            <p>
              Pour cela, il convient d&apos;effectuer une formation. Complétez
              le formulaire pour être averti de la prochaine formation prévue
              sur votre territoire !
            </p>
          </div>
        </div>
      </div>
      <div className="fond-clair-mac">
        <div className="fr-container">
          <FormulaireDevenirAidant macAPI={useMACAPI()} />
        </div>
      </div>
    </main>
  );
};
