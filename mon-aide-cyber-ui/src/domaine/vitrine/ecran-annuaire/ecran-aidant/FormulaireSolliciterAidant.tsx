import { AidantAnnuaire } from '../AidantAnnuaire.ts';
import { useCallback, useReducer } from 'react';
import {
  adresseElectroniqueSaisie,
  cguCliquees,
  initialiseFormulaireSolliciterAidant,
  raisonSocialeSaisie,
  reducteurFormulaireSolliciterAidant,
} from './reducteurFormulaireSolliciterAidant.ts';
import { CorpsDemandeSolliciterAidant } from '../../../gestion-demandes/etre-aide/EtreAide.ts';
import { CorpsCGU } from '../../../../vues/ComposantCGU.tsx';
import { useModale } from '../../../../fournisseurs/hooks.ts';

type ProprietetsFormulaireSolliciterAidant = {
  aidant: AidantAnnuaire;
  departement: string;
  soumetFormulaire: (formulaire: CorpsDemandeSolliciterAidant) => void;
};

export const FormulaireSolliciterAidant = ({
  aidant,
  departement,
  soumetFormulaire,
}: ProprietetsFormulaireSolliciterAidant) => {
  const { affiche } = useModale();

  const [etatFormulaire, declencheChangement] = useReducer(
    reducteurFormulaireSolliciterAidant,
    initialiseFormulaireSolliciterAidant()
  );

  const surSoumission = () => {
    soumetFormulaire({
      aidant: aidant,
      cguValidees: etatFormulaire.cguValidees,
      departement: departement,
      email: etatFormulaire.email,
      raisonSociale: etatFormulaire.raisonSociale,
    });
  };

  const afficheModaleCGU = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      affiche({
        corps: <CorpsCGU />,
        taille: 'large',
      });
    },
    [affiche]
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
      <form onSubmit={surSoumission}>
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
                  etatFormulaire.erreurs?.adresseElectronique
                    ? 'fr-input-group--error'
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
                  onChange={(e) =>
                    declencheChangement(
                      adresseElectroniqueSaisie(e.target.value)
                    )
                  }
                />
                {etatFormulaire.erreurs?.adresseElectronique}
              </div>
            </div>
            <div className=" fr-col-12">
              <div className={`fr-input-group`}>
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
            <div className="fr-col-12">
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
                  onChange={(e) =>
                    declencheChangement(raisonSocialeSaisie(e.target.value))
                  }
                />
              </div>
            </div>
            <div className="fr-col-12">
              <div
                className={`fr-checkbox-group mac-radio-group ${
                  etatFormulaire.erreurs?.cguValidees
                    ? 'fr-input-group--error'
                    : ''
                }`}
              >
                <input
                  type="checkbox"
                  id="cgu-aide"
                  name="cgu-aide"
                  onClick={() => declencheChangement(cguCliquees())}
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
                {etatFormulaire.erreurs?.cguValidees}
              </div>
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--right fr-pt-3w">
            <button
              type="submit"
              key="envoyer-demande-aide"
              className="fr-btn bouton-mac bouton-mac-primaire"
            >
              Terminer
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
