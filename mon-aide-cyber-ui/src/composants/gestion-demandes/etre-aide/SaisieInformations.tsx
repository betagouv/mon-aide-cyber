import { useCallback, useEffect, useReducer } from 'react';
import {
  adresseElectroniqueSaisie,
  cguValidees,
  departementSaisi,
  departementsCharges,
  initialiseEtatSaisieInformations,
  raisonSocialeSaisie,
  reducteurSaisieInformations,
  relationAidantCliquee,
} from './reducteurSaisieInformations.tsx';
import {
  Departement,
  estDepartement,
} from '../../../domaine/gestion-demandes/departement.ts';
import { useModale } from '../../../fournisseurs/hooks.ts';
import { CorpsCGU } from '../../../vues/ComposantCGU.tsx';
import { AutoCompletion } from '../../auto-completion/AutoCompletion.tsx';
import { CorpsDemandeEtreAide } from '../../../domaine/gestion-demandes/etre-aide/EtreAide.ts';

type ProprietesSaisiesInformations = {
  departements: Departement[];
  surValidation: {
    erreur?: Error;
    execute: (saisieInformations: CorpsDemandeEtreAide) => void;
  };
};

export const SaisieInformations = (
  proprietes: ProprietesSaisiesInformations
) => {
  const [etatSaisieInformations, envoie] = useReducer(
    reducteurSaisieInformations,
    initialiseEtatSaisieInformations(proprietes.departements)
  );

  useEffect(
    () => envoie(departementsCharges(proprietes.departements)),
    [proprietes.departements]
  );

  const surSoumissionFormulaire = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (proprietes.surValidation.erreur) {
        return;
      }

      proprietes.surValidation.execute({
        cguValidees: etatSaisieInformations.cguValidees,
        departement: etatSaisieInformations.departement.nom,
        email: etatSaisieInformations.email,
        raisonSociale: etatSaisieInformations.raisonSociale,
        relationAidant: etatSaisieInformations.relationAidantSaisie,
      });
    },
    [etatSaisieInformations.pretPourEnvoi]
  );

  const surSaisieAdresseElectronique = useCallback(
    (adresseElectronique: string) => {
      envoie(adresseElectroniqueSaisie(adresseElectronique));
    },
    []
  );
  const surSaisieDepartement = useCallback(
    (departement: Departement | string) => {
      envoie(departementSaisi(departement));
    },
    []
  );
  const surSaisieRaisonSociale = useCallback((raisonSociale: string) => {
    envoie(raisonSocialeSaisie(raisonSociale));
  }, []);
  const surCGUValidees = useCallback(() => {
    envoie(cguValidees());
  }, []);
  const { affiche } = useModale();
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
  const surRelationAidant = useCallback(() => {
    envoie(relationAidantCliquee());
  }, []);
  return (
    <>
      <div className="fr-mb-2w">Demande pour bénéficier de MonAideCyber</div>
      <div className="fr-mt-2w">
        <div>
          <h4>
            Vous souhaitez bénéficier du dispositif MonAideCyber en tant
            qu’entité publique ou privée
          </h4>
          <p>
            Veuillez compléter les informations ci-dessous pour formaliser votre
            demande.
          </p>
        </div>
        <div className="champs-obligatoire">
          <span className="asterisque">*</span>
          <span> Champ obligatoire</span>
        </div>
        <form
          className="formulaire-etre-aide-layout"
          onSubmit={(e) => surSoumissionFormulaire(e)}
        >
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
                    onBlur={(e) => {
                      surSaisieAdresseElectronique(e.target.value);
                    }}
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
                    valeurSaisie={etatSaisieInformations.departement}
                    suggestionsInitiales={etatSaisieInformations.departements}
                    mappeur={(departement) => {
                      return estDepartement(departement)
                        ? `${departement.code} - ${departement.nom}`
                        : typeof departement === 'string'
                          ? departement
                          : '';
                    }}
                    surSelection={(departement) =>
                      surSaisieDepartement(departement)
                    }
                    surSaisie={(departement) => {
                      surSaisieDepartement(departement);
                    }}
                    clefsFiltrage={['code', 'nom']}
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
                        de MonAideCyber au nom de l&apos;entité que je
                        représente
                      </span>
                    </div>
                  </label>
                  {etatSaisieInformations.erreur?.cguValidees?.texteExplicatif}
                </div>
              </div>
              <div className="fr-col-12">
                <div className="fr-checkbox-group mac-radio-group">
                  <input
                    type="checkbox"
                    id="relation-aidant"
                    name="relation-aidant"
                    onClick={surRelationAidant}
                    checked={etatSaisieInformations.relationAidantSaisie}
                  />
                  <label className="fr-label" htmlFor="relation-aidant">
                    <span>Je suis déjà en relation avec un Aidant</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="actions fr-grid-row fr-grid-row--right fr-pt-3w">
              <button
                type="submit"
                disabled={!etatSaisieInformations.pretPourEnvoi}
                key="envoyer-demande-aide"
                className="bouton-mac bouton-mac-primaire bouton-demande-etre-aide"
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
