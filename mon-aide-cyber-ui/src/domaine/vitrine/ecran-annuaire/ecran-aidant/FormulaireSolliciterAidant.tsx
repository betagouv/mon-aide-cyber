import { AidantAnnuaire } from '../AidantAnnuaire.ts';
import { useReducer } from 'react';
import { reducteurFormulaireSolliciterAidant } from './reducteurFormulaireSolliciterAidant.ts';

type ProprietetsFormulaireSolliciterAidant = {
  aidant: AidantAnnuaire;
  departement: string;
};

export const FormulaireSolliciterAidant = ({
  aidant,
  departement,
}: ProprietetsFormulaireSolliciterAidant) => {
  const [etatFormulaire, declencheChangement] = useReducer(
    reducteurFormulaireSolliciterAidant,
    {}
  );

  return (
    <div className="fr-col-md-8 fr-col-sm-12 section">
      <div className="fr-mb-2w">Demande pour bénéficier de MonAideCyber</div>
      <div className="fr-mt-2w">
        <div>
          <h4>Vous souhaitez bénéficier du dispositif MonAideCyber</h4>
          <p>
            Veuillez compléter les informations ci-dessous pour formaliser votre
            demande.
          </p>
        </div>
        <div className="champs-obligatoire">
          <span className="asterisque">*</span>
          <span> Champ obligatoire</span>
        </div>
      </div>
      <form>
        <fieldset className="fr-mb-5w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12">
              <div className="fr-input-group">
                <label className="fr-label" htmlFor="departement">
                  <span>
                    Vous avez souhaité être accompagné par l&apos;Aidant suivant
                    :
                  </span>
                </label>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    className="fr-input"
                    value={aidant?.nomPrenom}
                    type="text"
                    disabled={true}
                    id="aidant"
                    name="aidant"
                  />
                </div>
              </div>
            </div>
            <div className=" fr-col-12">
              <div
                className={`fr-input-group ${
                  etatFormulaire.erreur
                    ? etatFormulaire.erreur.adresseElectronique?.className
                    : ''
                }`}
              >
                <label className="fr-label" htmlFor="adresse-electronique">
                  <span className="asterisque">*</span>
                  <span> Votre adresse électronique</span>
                </label>
                <input
                  className="fr-input"
                  type="text"
                  id="adresse-electronique"
                  name="adresse-electronique"
                  onChange={(e) => surSaisieAdresseElectronique(e.target.value)}
                />
                {etatFormulaire.erreur?.adresseElectronique?.texteExplicatif}
              </div>
            </div>
            <div className=" fr-col-12">
              <div
                className={`fr-input-group ${
                  etatFormulaire.erreur
                    ? etatFormulaire.erreur.departement?.className
                    : ''
                }`}
              >
                <label className="fr-label" htmlFor="departement">
                  <span className="asterisque">*</span>
                  <span> Le département où se situe votre entité</span>
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    className="fr-input"
                    value={departement}
                    type="text"
                    disabled={true}
                    id="departement"
                    name="departement"
                  />
                </div>
              </div>
            </div>
            <div className=" fr-col-12">
              <div className="fr-input-group">
                <label className="fr-label" htmlFor="raison-sociale">
                  Raison sociale
                  <span className="fr-hint-text">optionnelle</span>
                </label>
                <input
                  className="fr-input"
                  type="text"
                  id="raison-sociale"
                  name="raison-sociale"
                  onChange={(e) => surSaisieRaisonSociale(e.target.value)}
                />
              </div>
            </div>
            <div className="fr-col-12">
              <div
                className={`fr-checkbox-group mac-radio-group ${
                  etatFormulaire.erreur
                    ? etatFormulaire.erreur.cguValidees?.className
                    : ''
                }`}
              >
                <input
                  type="checkbox"
                  id="cgu-aide"
                  name="cgu-aide"
                  onClick={surCGUValidees}
                  checked={etatFormulaire.cguValidees}
                />
                <label className="fr-label" htmlFor="cgu-aide">
                  <div>
                    <span className="asterisque">*</span>
                    <span>
                      {' '}
                      J&apos;accepte les{' '}
                      <b>
                        <a href="#" onClick={afficheModaleCGU}>
                          conditions générales d&apos;utilisation
                        </a>
                      </b>{' '}
                      de MonAideCyber au nom de l&apos;entité que je représente
                    </span>
                  </div>
                </label>
                {etatFormulaire.erreur?.cguValidees?.texteExplicatif}
              </div>
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--right fr-pt-3w">
            <button
              type="button"
              key="envoyer-demande-aide"
              className="fr-btn bouton-mac bouton-mac-primaire"
              onClick={() => declencheChangement()}
            >
              Terminer
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
