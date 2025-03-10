import {
  HTMLAttributes,
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import {
  adresseElectroniqueSaisie,
  cguValidees,
  departementSaisi,
  departementsCharges,
  emailUtilisateurSaisi,
  initialiseEtatFormulaireDemandeEtreAide,
  raisonSocialeSaisie,
  reducteurFormulaireDemandeEtreAide,
  relationUtilisateurCliquee,
} from './reducteurFormulaireDemandeEtreAide.tsx';
import {
  Departement,
  estDepartement,
} from '../../../domaine/gestion-demandes/departement.ts';
import { useModale } from '../../../fournisseurs/hooks.ts';
import { CorpsCGU } from '../../../vues/ComposantCGU.tsx';
import { AutoCompletion } from '../../auto-completion/AutoCompletion.tsx';
import { CorpsDemandeEtreAide } from '../../../domaine/gestion-demandes/etre-aide/EtreAide.ts';
import { Input } from '../../atomes/Input/Input.tsx';
import './demande-aide.scss';

type ProprietesSaisiesInformations = {
  departements: Departement[];
  surValidation: {
    erreur?: Error;
    execute: (saisieInformations: CorpsDemandeEtreAide) => void;
  };
};

type ProprietesChampSaisieEmailUtilisateur = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    surSaisieEmailUtilisateur: (email: string) => void;
  }
>;
const ChampSaisieEmailUtilisateur = ({
  children,
  ...proprietesChampSaisieEmailUtilisateur
}: ProprietesChampSaisieEmailUtilisateur) => {
  const { className, surSaisieEmailUtilisateur } =
    proprietesChampSaisieEmailUtilisateur;

  return (
    <div
      className={`section-encadree fr-input-group ${className ? className : ''}`}
    >
      <label>
        <span className="asterisque">*</span>
        <span>
          {' '}
          Veuillez indiquer l’adresse électronique de la personne qui vous
          accompagne :
        </span>
      </label>
      <Input
        type="email"
        placeholder="Exemple : jean.dupont@email.com"
        onBlur={(e) => surSaisieEmailUtilisateur(e.target.value)}
      />
      {children}
    </div>
  );
};

export const FormulaireDemandeEtreAide = (
  proprietes: ProprietesSaisiesInformations
) => {
  const [etatFormulaireDemandeEtreAide, envoie] = useReducer(
    reducteurFormulaireDemandeEtreAide,
    initialiseEtatFormulaireDemandeEtreAide(proprietes.departements)
  );

  useEffect(
    () => envoie(departementsCharges(proprietes.departements)),
    [proprietes.departements]
  );

  const surSoumissionFormulaire = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (proprietes.surValidation.erreur) {
      return;
    }

    proprietes.surValidation.execute({
      cguValidees: etatFormulaireDemandeEtreAide.cguValidees,
      departement: etatFormulaireDemandeEtreAide.departement.nom,
      email: etatFormulaireDemandeEtreAide.email,
      raisonSociale: etatFormulaireDemandeEtreAide.raisonSociale,
      ...(etatFormulaireDemandeEtreAide.relationUtilisateurSaisie !==
        undefined &&
        etatFormulaireDemandeEtreAide.relationUtilisateurSaisie !== 'Non' && {
          relationUtilisateur:
            etatFormulaireDemandeEtreAide.relationUtilisateurSaisie,
        }),
    });
  };

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

  const surRelationUtilisateurOui = useCallback(() => {
    envoie(relationUtilisateurCliquee(true));
  }, []);

  const surRelationUtilisateurNon = useCallback(() => {
    envoie(relationUtilisateurCliquee(false));
  }, []);

  const surSaisieEmailUtilisateur = useCallback((email: string) => {
    envoie(emailUtilisateurSaisi(email));
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
            <b>NB</b> : notre dispositif n’est pas adapté aux particuliers, aux
            entreprises mono-salariés et aux auto-entrepreneurs.
          </p>
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
                    etatFormulaireDemandeEtreAide.erreur
                      ? etatFormulaireDemandeEtreAide.erreur.adresseElectronique
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
                    etatFormulaireDemandeEtreAide.erreur?.adresseElectronique
                      ?.texteExplicatif
                  }
                </div>
              </div>
              <div className=" fr-col-12">
                <div
                  className={`fr-input-group ${
                    etatFormulaireDemandeEtreAide.erreur
                      ? etatFormulaireDemandeEtreAide.erreur.departement
                          ?.className
                      : ''
                  }`}
                >
                  <label className="fr-label" htmlFor="departement">
                    <span className="asterisque">*</span>
                    <span> Le département où se situe votre entité</span>
                  </label>
                  <AutoCompletion<Departement>
                    nom="departement"
                    valeurSaisie={etatFormulaireDemandeEtreAide.departement}
                    suggestionsInitiales={
                      etatFormulaireDemandeEtreAide.departements
                    }
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
                  {
                    etatFormulaireDemandeEtreAide.erreur?.departement
                      ?.texteExplicatif
                  }
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
                <div className="choix-utilisateur">
                  <p className="m-0">
                    <span className="asterisque">*</span>
                    <span>
                      {' '}
                      Êtes-vous déjà en relation avec une personne prête à vous
                      accompagner pour le diagnostic MonAideCyber ?
                    </span>
                  </p>
                  <div className="fr-radio-group mac-radio-group">
                    <Input
                      type="radio"
                      name="relation-utilisateur"
                      id="relation-utilisateur-non"
                      value="Non"
                      onClick={surRelationUtilisateurNon}
                    />
                    <label
                      className="fr-label"
                      htmlFor="relation-utilisateur-non"
                    >
                      <span>Non</span>
                    </label>
                  </div>
                  <div className="fr-radio-group mac-radio-group">
                    <Input
                      type="radio"
                      name="relation-utilisateur"
                      id="relation-utilisateur-oui"
                      value="Oui"
                      onClick={surRelationUtilisateurOui}
                    />
                    <label
                      className="fr-label"
                      htmlFor="relation-utilisateur-oui"
                    >
                      <span>Oui</span>
                    </label>
                    {etatFormulaireDemandeEtreAide.relationUtilisateurSaisie !==
                      undefined &&
                    etatFormulaireDemandeEtreAide.relationUtilisateurSaisie !==
                      'Non' ? (
                      <ChampSaisieEmailUtilisateur
                        className={
                          etatFormulaireDemandeEtreAide.erreur
                            ?.relationUtilisateurSaisie?.className ||
                          'bordure-gauche'
                        }
                        surSaisieEmailUtilisateur={surSaisieEmailUtilisateur}
                      >
                        {
                          etatFormulaireDemandeEtreAide.erreur
                            ?.relationUtilisateurSaisie?.texteExplicatif
                        }
                      </ChampSaisieEmailUtilisateur>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className="fr-col-12">
                <div
                  className={`fr-checkbox-group mac-radio-group ${
                    etatFormulaireDemandeEtreAide.erreur
                      ? etatFormulaireDemandeEtreAide.erreur.cguValidees
                          ?.className
                      : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    id="cgu-aide"
                    name="cgu-aide"
                    onClick={surCGUValidees}
                    checked={etatFormulaireDemandeEtreAide.cguValidees}
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
                  {
                    etatFormulaireDemandeEtreAide.erreur?.cguValidees
                      ?.texteExplicatif
                  }
                </div>
              </div>
            </div>
            <div className="actions fr-grid-row fr-grid-row--right fr-pt-3w">
              <button
                type="submit"
                disabled={!etatFormulaireDemandeEtreAide.pretPourEnvoi}
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
