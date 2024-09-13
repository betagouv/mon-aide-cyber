import { FormulaireCreationEspaceAidant } from './FormulaireCreationEspaceAidant.tsx';
type ProprietesComposantCreationEspaceAidant = {
  token: string;
};
export const EcranCreationEspaceAidant = ({
  token,
}: ProprietesComposantCreationEspaceAidant) => {
  return (
    <>
      <main role="main">
        <div className="fond-clair-mac creation-espace-aidant">
          <div className="fr-container">
            <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
              <div className="fr-col-8">
                <FormulaireCreationEspaceAidant token={token} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
