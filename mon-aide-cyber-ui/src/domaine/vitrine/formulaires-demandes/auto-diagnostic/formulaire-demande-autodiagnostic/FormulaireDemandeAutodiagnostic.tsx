import { TypographieH5 } from '../../../../../composants/communs/typographie/TypographieH5/TypographieH5.tsx';
import Button from '../../../../../composants/atomes/Button/Button.tsx';
import { useModale } from '../../../../../fournisseurs/hooks.ts';
import { FormEvent, useCallback, useReducer } from 'react';
import {
  adresseElectroniqueSaisie,
  cguCliquees,
  initialiseFormulaireDemandeAutodiagnostic,
  reducteurFormulaireDemandeAutodiagnostic,
} from './reducteurFormulaireDemandeAutodiagnostic.ts';
import { CorpsCGU } from '../../../../../vues/ComposantCGU.tsx';

export const FormulaireDemandeAutodiagnostic = () => {
  const { affiche } = useModale();

  const [etatFormulaire, declencheChangement] = useReducer(
    reducteurFormulaireDemandeAutodiagnostic,
    initialiseFormulaireDemandeAutodiagnostic()
  );

  const surSoumission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /*soumetFormulaire({
      aidantSollicite: aidant.identifiant,
      cguValidees: etatFormulaire.cguValidees,
      departement: departement,
      email: etatFormulaire.email,
      raisonSociale: etatFormulaire.raisonSociale,
    });*/
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
      <div className="fr-mt-2w introduction">
        <div>
          <TypographieH5>
            Vous souhaitez bénéficier du dispositif MonAideCyber et mener un
            diagnostic en autonomie
          </TypographieH5>

          <p>Veuillez compléter les informations ci-dessous.</p>
        </div>
      </div>
      <div className="champs-obligatoire">
        <span className="asterisque">*</span>
        <span> Champ obligatoire</span>
      </div>
      <form onSubmit={(e) => surSoumission(e)}>
        <fieldset className="fr-mb-5w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 champs">
              <div
                className={`fr-input-group ${
                  etatFormulaire.erreurs?.adresseElectronique
                    ? 'fr-input-group--error'
                    : ''
                }`}
              >
                <label className="fr-label" htmlFor="mail">
                  <span className="asterisque">*</span>
                  <span> Votre adresse électronique :</span>
                </label>
                <input
                  className="fr-input"
                  type="text"
                  id="mail"
                  name="mail"
                  placeholder="Exemple : martin@mail.com"
                  onBlur={(e) =>
                    declencheChangement(
                      adresseElectroniqueSaisie(e.target.value)
                    )
                  }
                />
                {etatFormulaire.erreurs?.adresseElectronique ? (
                  <p className="fr-error-text">
                    {etatFormulaire.erreurs?.adresseElectronique}
                  </p>
                ) : null}
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
                {etatFormulaire.erreurs?.cguValidees ? (
                  <p className="fr-error-text">
                    {etatFormulaire.erreurs?.cguValidees}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="fr-grid-row fr-grid-row--right fr-pt-3w">
              <Button
                type="submit"
                key="envoyer-demande-devenir-aidant"
                disabled={!etatFormulaire.pretPourEnvoi}
              >
                Accéder au diagnostic
              </Button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
