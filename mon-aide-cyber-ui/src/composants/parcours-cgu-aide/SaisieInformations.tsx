import { useCallback, useEffect, useReducer } from 'react';
import {
  adresseElectroniqueSaisie,
  cguValidees,
  demandeTerminee,
  Departement,
  departementSaisi,
  initialiseEtatSaisieInformations,
  raisonSocialeSaisie,
  reducteurSaisieInformations,
} from './reducteurSaisieInformations.tsx';
import { AutoCompletion } from '../auto-completion/AutoCompletion.tsx';

export type DonneesSaisieInformations = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
};

type ProprietesSaisiesInformations = {
  onClick: (saisieInformations: DonneesSaisieInformations) => void;
};
export const SaisieInformations = (
  proprietes: ProprietesSaisiesInformations,
) => {
  const [etatSaisieInformations, envoie] = useReducer(
    reducteurSaisieInformations,
    initialiseEtatSaisieInformations([
      { nom: 'Ain', code: '1' },
      { nom: 'Finistère', code: '29' },
      { nom: 'Gironde', code: '33' },
    ]),
  );

  useEffect(() => {
    if (etatSaisieInformations.pretPourEnvoi) {
      proprietes.onClick({
        cguValidees: etatSaisieInformations.cguValidees,
        departement: etatSaisieInformations.departement,
        email: etatSaisieInformations.email,
        raisonSociale: etatSaisieInformations.raisonSociale,
      });
    }
  }, [etatSaisieInformations, proprietes]);

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
        <form>
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
                  <input
                    className="fr-input"
                    type="text"
                    id="adresse-electronique"
                    name="adresse-electronique"
                    onChange={(e) =>
                      surSaisieAdresseElectronique(e.target.value)
                    }
                  />
                  {
                    etatSaisieInformations.erreur?.adresseElectronique
                      ?.texteExplicatif
                  }
                </div>
              </div>
              <div className=" fr-col-12">
                <div
                  className={`fr-input-group ${
                    etatSaisieInformations.erreur
                      ? etatSaisieInformations.erreur.departement?.className
                      : ''
                  }`}
                >
                  <label className="fr-label" htmlFor="departement">
                    <span className="asterisque">*</span>
                    <span> Le département où se situe votre entité</span>
                  </label>
                  <AutoCompletion<Departement>
                    nom="departement"
                    valeur={etatSaisieInformations.valeurSaisieDepartement}
                    valeurs={etatSaisieInformations.departements}
                    mappeur={(departement) => departement.nom}
                    surValidation={(departement) =>
                      surSaisieDepartement(departement)
                    }
                  />
                  {etatSaisieInformations.erreur?.departement?.texteExplicatif}
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
                type="button"
                key="envoyer-demande-aide"
                className="fr-btn bouton-mac bouton-mac-primaire"
                onClick={() => envoie(demandeTerminee())}
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
