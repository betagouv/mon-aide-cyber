import { FormEvent, useCallback, useReducer } from 'react';
import {
  adresseElectroniqueSaisie,
  cguValidees,
  departementSaisi,
  initialiseEtatSaisieInformations,
  raisonSocialeSaisie,
  reducteurSaisieInformations,
} from './reducteurSaisieInformations.tsx';

export const SaisieInformations = () => {
  const [etatSaisieInformations, envoie] = useReducer(
    reducteurSaisieInformations,
    initialiseEtatSaisieInformations(),
  );
  const envoieDemandeAide = useCallback((e: FormEvent) => {
    e.preventDefault();
  }, []);

  const surSaisieAdresseElectronique = useCallback(
    (adresseElectronique: string) => {
      envoie(adresseElectroniqueSaisie(adresseElectronique));
    },
    [],
  );
  const surSaisieDepartement = useCallback((departement: string) => {
    envoie(departementSaisi(departement));
  }, []);
  const surSaisieRaisonSociale = (raisonSociale: string) => {
    envoie(raisonSocialeSaisie(raisonSociale));
  };
  const surCGUValidees = () => {
    envoie(cguValidees());
  };
  return (
    <>
      <div className="fr-mb-2w">Demande d&apos;inscription à MonAideCyber</div>
      <div className="fr-mt-2w">
        <div>
          <h4>Vous souhaitez que votre entité bénéficie de MonAideCyber</h4>
          <p>
            Veuillez compléter les informations ci-dessous pour formaliser votre
            demande.
          </p>
        </div>
        <div className="champs-obligatoire">
          <span className="asterisque">*</span>
          <span> Champ obligatoire</span>
        </div>
        <form onSubmit={envoieDemandeAide}>
          <fieldset className="fr-mb-5w">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className=" fr-col-12">
                <div
                  className={`fr-input-group ${
                    etatSaisieInformations.erreur
                      ? etatSaisieInformations.erreur.adresseElectronique
                          ?.className
                      : ''
                  }`}
                >
                  <label className="fr-label" htmlFor="adresse-electronique">
                    <span className="asterisque">*</span>
                    <span> Votre adresse électronique</span>
                  </label>
                  {
                    etatSaisieInformations.erreur?.adresseElectronique
                      ?.texteExplicatif
                  }
                  <input
                    className="fr-input"
                    type="text"
                    id="adresse-electronique"
                    name="adresse-electronique"
                    onChange={(e) =>
                      surSaisieAdresseElectronique(e.target.value)
                    }
                  />
                </div>
              </div>
              <div className=" fr-col-12">
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="departement">
                    <span className="asterisque">*</span>
                    <span> Le département où se situe votre entité</span>
                  </label>
                  {etatSaisieInformations.erreur?.departement?.texteExplicatif}
                  <input
                    className="fr-input"
                    type="text"
                    id="departement"
                    name="departement"
                    onChange={(e) => surSaisieDepartement(e.target.value)}
                  />
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
                    etatSaisieInformations.erreur
                      ? etatSaisieInformations.erreur.cguValidees?.className
                      : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    id="cgu-aide"
                    name="cgu-aide"
                    onClick={surCGUValidees}
                    checked={etatSaisieInformations.cguValidees}
                  />
                  <label className="fr-label" htmlFor="cgu-aide">
                    <span>
                      {' '}
                      J&apos;accepte les{' '}
                      <b>
                        <a href="/cgu">
                          conditions générales d&apos;utilisation
                        </a>
                      </b>{' '}
                      de MonAideCyber au nom de l&apos;entité que je représente
                    </span>
                  </label>
                  {etatSaisieInformations.erreur?.cguValidees?.texteExplicatif}
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
    </>
  );
};
